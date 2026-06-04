(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[turbopack]/browser/dev/hmr-client/hmr-client.ts [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/// <reference path="../../../shared/runtime-types.d.ts" />
/// <reference path="../../runtime/base/dev-globals.d.ts" />
/// <reference path="../../runtime/base/dev-protocol.d.ts" />
/// <reference path="../../runtime/base/dev-extensions.ts" />
__turbopack_context__.s([
    "connect",
    ()=>connect,
    "setHooks",
    ()=>setHooks,
    "subscribeToUpdate",
    ()=>subscribeToUpdate
]);
function connect({ addMessageListener, sendMessage, onUpdateError = console.error }) {
    addMessageListener((msg)=>{
        switch(msg.type){
            case 'turbopack-connected':
                handleSocketConnected(sendMessage);
                break;
            default:
                try {
                    if (Array.isArray(msg.data)) {
                        for(let i = 0; i < msg.data.length; i++){
                            handleSocketMessage(msg.data[i]);
                        }
                    } else {
                        handleSocketMessage(msg.data);
                    }
                    applyAggregatedUpdates();
                } catch (e) {
                    console.warn('[Fast Refresh] performing full reload\n\n' + "Fast Refresh will perform a full reload when you edit a file that's imported by modules outside of the React rendering tree.\n" + 'You might have a file which exports a React component but also exports a value that is imported by a non-React component file.\n' + 'Consider migrating the non-React component export to a separate file and importing it into both files.\n\n' + 'It is also possible the parent component of the component you edited is a class component, which disables Fast Refresh.\n' + 'Fast Refresh requires at least one parent function component in your React tree.');
                    onUpdateError(e);
                    location.reload();
                }
                break;
        }
    });
    const queued = globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS;
    if (queued != null && !Array.isArray(queued)) {
        throw new Error('A separate HMR handler was already registered');
    }
    globalThis.TURBOPACK_CHUNK_UPDATE_LISTENERS = {
        push: ([chunkPath, callback])=>{
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    };
    if (Array.isArray(queued)) {
        for (const [chunkPath, callback] of queued){
            subscribeToChunkUpdate(chunkPath, sendMessage, callback);
        }
    }
}
const updateCallbackSets = new Map();
function sendJSON(sendMessage, message) {
    sendMessage(JSON.stringify(message));
}
function resourceKey(resource) {
    return JSON.stringify({
        path: resource.path,
        headers: resource.headers || null
    });
}
function subscribeToUpdates(sendMessage, resource) {
    sendJSON(sendMessage, {
        type: 'turbopack-subscribe',
        ...resource
    });
    return ()=>{
        sendJSON(sendMessage, {
            type: 'turbopack-unsubscribe',
            ...resource
        });
    };
}
function handleSocketConnected(sendMessage) {
    for (const key of updateCallbackSets.keys()){
        subscribeToUpdates(sendMessage, JSON.parse(key));
    }
}
// we aggregate all pending updates until the issues are resolved
const chunkListsWithPendingUpdates = new Map();
function aggregateUpdates(msg) {
    const key = resourceKey(msg.resource);
    let aggregated = chunkListsWithPendingUpdates.get(key);
    if (aggregated) {
        aggregated.instruction = mergeChunkListUpdates(aggregated.instruction, msg.instruction);
    } else {
        chunkListsWithPendingUpdates.set(key, msg);
    }
}
function applyAggregatedUpdates() {
    if (chunkListsWithPendingUpdates.size === 0) return;
    hooks.beforeRefresh();
    for (const msg of chunkListsWithPendingUpdates.values()){
        triggerUpdate(msg);
    }
    chunkListsWithPendingUpdates.clear();
    finalizeUpdate();
}
function mergeChunkListUpdates(updateA, updateB) {
    let chunks;
    if (updateA.chunks != null) {
        if (updateB.chunks == null) {
            chunks = updateA.chunks;
        } else {
            chunks = mergeChunkListChunks(updateA.chunks, updateB.chunks);
        }
    } else if (updateB.chunks != null) {
        chunks = updateB.chunks;
    }
    let merged;
    if (updateA.merged != null) {
        if (updateB.merged == null) {
            merged = updateA.merged;
        } else {
            // Since `merged` is an array of updates, we need to merge them all into
            // one, consistent update.
            // Since there can only be `EcmascriptMergeUpdates` in the array, there is
            // no need to key on the `type` field.
            let update = updateA.merged[0];
            for(let i = 1; i < updateA.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateA.merged[i]);
            }
            for(let i = 0; i < updateB.merged.length; i++){
                update = mergeChunkListEcmascriptMergedUpdates(update, updateB.merged[i]);
            }
            merged = [
                update
            ];
        }
    } else if (updateB.merged != null) {
        merged = updateB.merged;
    }
    return {
        type: 'ChunkListUpdate',
        chunks,
        merged
    };
}
function mergeChunkListChunks(chunksA, chunksB) {
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    return chunks;
}
function mergeChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted' || updateA.type === 'deleted' && updateB.type === 'added') {
        return undefined;
    }
    if (updateA.type === 'partial') {
        invariant(updateA.instruction, 'Partial updates are unsupported');
    }
    if (updateB.type === 'partial') {
        invariant(updateB.instruction, 'Partial updates are unsupported');
    }
    return undefined;
}
function mergeChunkListEcmascriptMergedUpdates(mergedA, mergedB) {
    const entries = mergeEcmascriptChunkEntries(mergedA.entries, mergedB.entries);
    const chunks = mergeEcmascriptChunksUpdates(mergedA.chunks, mergedB.chunks);
    return {
        type: 'EcmascriptMergedUpdate',
        entries,
        chunks
    };
}
function mergeEcmascriptChunkEntries(entriesA, entriesB) {
    return {
        ...entriesA,
        ...entriesB
    };
}
function mergeEcmascriptChunksUpdates(chunksA, chunksB) {
    if (chunksA == null) {
        return chunksB;
    }
    if (chunksB == null) {
        return chunksA;
    }
    const chunks = {};
    for (const [chunkPath, chunkUpdateA] of Object.entries(chunksA)){
        const chunkUpdateB = chunksB[chunkPath];
        if (chunkUpdateB != null) {
            const mergedUpdate = mergeEcmascriptChunkUpdates(chunkUpdateA, chunkUpdateB);
            if (mergedUpdate != null) {
                chunks[chunkPath] = mergedUpdate;
            }
        } else {
            chunks[chunkPath] = chunkUpdateA;
        }
    }
    for (const [chunkPath, chunkUpdateB] of Object.entries(chunksB)){
        if (chunks[chunkPath] == null) {
            chunks[chunkPath] = chunkUpdateB;
        }
    }
    if (Object.keys(chunks).length === 0) {
        return undefined;
    }
    return chunks;
}
function mergeEcmascriptChunkUpdates(updateA, updateB) {
    if (updateA.type === 'added' && updateB.type === 'deleted') {
        // These two completely cancel each other out.
        return undefined;
    }
    if (updateA.type === 'deleted' && updateB.type === 'added') {
        const added = [];
        const deleted = [];
        const deletedModules = new Set(updateA.modules ?? []);
        const addedModules = new Set(updateB.modules ?? []);
        for (const moduleId of addedModules){
            if (!deletedModules.has(moduleId)) {
                added.push(moduleId);
            }
        }
        for (const moduleId of deletedModules){
            if (!addedModules.has(moduleId)) {
                deleted.push(moduleId);
            }
        }
        if (added.length === 0 && deleted.length === 0) {
            return undefined;
        }
        return {
            type: 'partial',
            added,
            deleted
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'partial') {
        const added = new Set([
            ...updateA.added ?? [],
            ...updateB.added ?? []
        ]);
        const deleted = new Set([
            ...updateA.deleted ?? [],
            ...updateB.deleted ?? []
        ]);
        if (updateB.added != null) {
            for (const moduleId of updateB.added){
                deleted.delete(moduleId);
            }
        }
        if (updateB.deleted != null) {
            for (const moduleId of updateB.deleted){
                added.delete(moduleId);
            }
        }
        return {
            type: 'partial',
            added: [
                ...added
            ],
            deleted: [
                ...deleted
            ]
        };
    }
    if (updateA.type === 'added' && updateB.type === 'partial') {
        const modules = new Set([
            ...updateA.modules ?? [],
            ...updateB.added ?? []
        ]);
        for (const moduleId of updateB.deleted ?? []){
            modules.delete(moduleId);
        }
        return {
            type: 'added',
            modules: [
                ...modules
            ]
        };
    }
    if (updateA.type === 'partial' && updateB.type === 'deleted') {
        // We could eagerly return `updateB` here, but this would potentially be
        // incorrect if `updateA` has added modules.
        const modules = new Set(updateB.modules ?? []);
        if (updateA.added != null) {
            for (const moduleId of updateA.added){
                modules.delete(moduleId);
            }
        }
        return {
            type: 'deleted',
            modules: [
                ...modules
            ]
        };
    }
    // Any other update combination is invalid.
    return undefined;
}
function invariant(_, message) {
    throw new Error(`Invariant: ${message}`);
}
const CRITICAL = [
    'bug',
    'error',
    'fatal'
];
function compareByList(list, a, b) {
    const aI = list.indexOf(a) + 1 || list.length;
    const bI = list.indexOf(b) + 1 || list.length;
    return aI - bI;
}
const chunksWithIssues = new Map();
function emitIssues() {
    const issues = [];
    const deduplicationSet = new Set();
    for (const [_, chunkIssues] of chunksWithIssues){
        for (const chunkIssue of chunkIssues){
            if (deduplicationSet.has(chunkIssue.formatted)) continue;
            issues.push(chunkIssue);
            deduplicationSet.add(chunkIssue.formatted);
        }
    }
    sortIssues(issues);
    hooks.issues(issues);
}
function handleIssues(msg) {
    const key = resourceKey(msg.resource);
    let hasCriticalIssues = false;
    for (const issue of msg.issues){
        if (CRITICAL.includes(issue.severity)) {
            hasCriticalIssues = true;
        }
    }
    if (msg.issues.length > 0) {
        chunksWithIssues.set(key, msg.issues);
    } else if (chunksWithIssues.has(key)) {
        chunksWithIssues.delete(key);
    }
    emitIssues();
    return hasCriticalIssues;
}
const SEVERITY_ORDER = [
    'bug',
    'fatal',
    'error',
    'warning',
    'info',
    'log'
];
const CATEGORY_ORDER = [
    'parse',
    'resolve',
    'code generation',
    'rendering',
    'typescript',
    'other'
];
function sortIssues(issues) {
    issues.sort((a, b)=>{
        const first = compareByList(SEVERITY_ORDER, a.severity, b.severity);
        if (first !== 0) return first;
        return compareByList(CATEGORY_ORDER, a.category, b.category);
    });
}
const hooks = {
    beforeRefresh: ()=>{},
    refresh: ()=>{},
    buildOk: ()=>{},
    issues: (_issues)=>{}
};
function setHooks(newHooks) {
    Object.assign(hooks, newHooks);
}
function handleSocketMessage(msg) {
    sortIssues(msg.issues);
    handleIssues(msg);
    switch(msg.type){
        case 'issues':
            break;
        case 'partial':
            // aggregate updates
            aggregateUpdates(msg);
            break;
        default:
            // run single update
            const runHooks = chunkListsWithPendingUpdates.size === 0;
            if (runHooks) hooks.beforeRefresh();
            triggerUpdate(msg);
            if (runHooks) finalizeUpdate();
            break;
    }
}
function finalizeUpdate() {
    hooks.refresh();
    hooks.buildOk();
    // This is used by the Next.js integration test suite to notify it when HMR
    // updates have been completed.
    // TODO: Only run this in test environments (gate by `process.env.__NEXT_TEST_MODE`)
    if (globalThis.__NEXT_HMR_CB) {
        globalThis.__NEXT_HMR_CB();
        globalThis.__NEXT_HMR_CB = null;
    }
}
function subscribeToChunkUpdate(chunkListPath, sendMessage, callback) {
    return subscribeToUpdate({
        path: chunkListPath
    }, sendMessage, callback);
}
function subscribeToUpdate(resource, sendMessage, callback) {
    const key = resourceKey(resource);
    let callbackSet;
    const existingCallbackSet = updateCallbackSets.get(key);
    if (!existingCallbackSet) {
        callbackSet = {
            callbacks: new Set([
                callback
            ]),
            unsubscribe: subscribeToUpdates(sendMessage, resource)
        };
        updateCallbackSets.set(key, callbackSet);
    } else {
        existingCallbackSet.callbacks.add(callback);
        callbackSet = existingCallbackSet;
    }
    return ()=>{
        callbackSet.callbacks.delete(callback);
        if (callbackSet.callbacks.size === 0) {
            callbackSet.unsubscribe();
            updateCallbackSets.delete(key);
        }
    };
}
function triggerUpdate(msg) {
    const key = resourceKey(msg.resource);
    const callbackSet = updateCallbackSets.get(key);
    if (!callbackSet) {
        return;
    }
    for (const callback of callbackSet.callbacks){
        callback(msg);
    }
    if (msg.type === 'notFound') {
        // This indicates that the resource which we subscribed to either does not exist or
        // has been deleted. In either case, we should clear all update callbacks, so if a
        // new subscription is created for the same resource, it will send a new "subscribe"
        // message to the server.
        // No need to send an "unsubscribe" message to the server, it will have already
        // dropped the update stream before sending the "notFound" message.
        updateCallbackSets.delete(key);
    }
}
}),
"[project]/src/Component/common/Breadcrumb/Breadcrumb.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "breadcrumb": "Breadcrumb-module__f5-L5G__breadcrumb",
});
}),
"[project]/src/Component/common/Breadcrumb/Breadcrumb.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Breadcrumb
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$common$2f$Breadcrumb$2f$Breadcrumb$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/Component/common/Breadcrumb/Breadcrumb.module.css [client] (css module)");
;
;
;
function Breadcrumb({ pageName }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$common$2f$Breadcrumb$2f$Breadcrumb$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].breadcrumb,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                href: "/",
                children: "Home"
            }, void 0, false, {
                fileName: "[project]/src/Component/common/Breadcrumb/Breadcrumb.js",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                children: "/"
            }, void 0, false, {
                fileName: "[project]/src/Component/common/Breadcrumb/Breadcrumb.js",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                children: pageName
            }, void 0, false, {
                fileName: "[project]/src/Component/common/Breadcrumb/Breadcrumb.js",
                lineNumber: 19,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/Component/common/Breadcrumb/Breadcrumb.js",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
_c = Breadcrumb;
var _c;
__turbopack_context__.k.register(_c, "Breadcrumb");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/Component/contact/ContactPage/ContactPage.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "apiError": "ContactPage-module__86eg3a__apiError",
  "buttonGroup": "ContactPage-module__86eg3a__buttonGroup",
  "contactInfo": "ContactPage-module__86eg3a__contactInfo",
  "contactSection": "ContactPage-module__86eg3a__contactSection",
  "errorText": "ContactPage-module__86eg3a__errorText",
  "formCard": "ContactPage-module__86eg3a__formCard",
  "formHeader": "ContactPage-module__86eg3a__formHeader",
  "icon": "ContactPage-module__86eg3a__icon",
  "infoBox": "ContactPage-module__86eg3a__infoBox",
  "inputError": "ContactPage-module__86eg3a__inputError",
  "inputGroup": "ContactPage-module__86eg3a__inputGroup",
  "submitBtn": "ContactPage-module__86eg3a__submitBtn",
  "successMsg": "ContactPage-module__86eg3a__successMsg",
  "tag": "ContactPage-module__86eg3a__tag",
  "whatsappBtn": "ContactPage-module__86eg3a__whatsappBtn",
});
}),
"[project]/src/services/FetchNodeServices.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "deleteData",
    ()=>deleteData,
    "getData",
    ()=>getData,
    "getToken",
    ()=>getToken,
    "patchData",
    ()=>patchData,
    "postData",
    ()=>postData,
    "serverURL",
    ()=>serverURL
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/axios/lib/axios.js [client] (ecmascript)");
;
const serverURL = 'http://localhost:8000/api';
const getToken = ()=>{
    const admin = JSON.parse(sessionStorage.getItem('Admin'));
    return admin?.token;
};
const postData = async (url, body)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].post(`${serverURL}/${url}`, body, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
};
const getData = async (url)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].get(`${serverURL}/${url}`);
        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
};
const patchData = async (url, body)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].put(`${serverURL}/${url}`, body, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
};
const deleteData = async (url)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].delete(`${serverURL}/${url}`, {
            headers: {
                Authorization: `Bearer ${getToken()}`
            }
        });
        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
};
;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/Component/contact/ContactPage/ContactPage.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ContactPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$common$2f$Breadcrumb$2f$Breadcrumb$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/common/Breadcrumb/Breadcrumb.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/Component/contact/ContactPage/ContactPage.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$FetchNodeServices$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/FetchNodeServices.js [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
function ContactPage() {
    _s();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        fullName: '',
        phoneNumber: '',
        email: '',
        productInterest: '',
        message: ''
    });
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [successMsg, setSuccessMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    // ─── Handle Input Change ───────────────────────────────────────────────────
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setForm((prev)=>({
                ...prev,
                [name]: value
            }));
        // ✅ Clear error on type
        if (errors[name]) {
            setErrors((prev)=>({
                    ...prev,
                    [name]: ""
                }));
        }
    };
    // ─── Validation ────────────────────────────────────────────────────────────
    const validate = ()=>{
        const newErrors = {};
        if (!form.fullName.trim()) {
            newErrors.fullName = "Name is required";
        }
        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            newErrors.email = "Enter a valid email";
        }
        if (!form.phoneNumber.trim()) {
            newErrors.phoneNumber = "Phone is required";
        } else if (!/^[6-9]\d{9}$/.test(form.phoneNumber)) {
            newErrors.phoneNumber = "Enter a valid 10-digit phone number";
        }
        if (!form.message.trim()) {
            newErrors.message = "Message is required";
        }
        if (!form.productInterest.trim()) {
            newErrors.productInterest = "Message is required";
        }
        return newErrors;
    };
    // ─── Handle Submit ─────────────────────────────────────────────────────────
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        // ✅ Payload
        const payload = {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phoneNumber: form.phoneNumber.trim(),
            message: form.message.trim(),
            productInterest: form.productInterest.trim()
        };
        console.log("Enquiry Payload =>", payload);
        setLoading(true);
        setSuccessMsg("");
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$FetchNodeServices$2e$js__$5b$client$5d$__$28$ecmascript$29$__["postData"])("contact/create", payload);
            console.log("Enquiry Response =>", response);
            if (response?.success === true) {
                setSuccessMsg("Thank you! We'll get back to you soon.");
                setForm({
                    fullName: '',
                    phoneNumber: '',
                    email: '',
                    productInterest: '',
                    message: ''
                }); // ✅ reset
                setErrors({});
            } else {
                setErrors({
                    api: response?.message || "Something went wrong. Please try again."
                });
            }
        } catch (e) {
            console.error("Enquiry submit failed:", e?.message);
            setErrors({
                api: "Server error. Please try again later."
            });
        } finally{
            setLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].contactSection,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$common$2f$Breadcrumb$2f$Breadcrumb$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                    pageName: "Contact Us"
                }, void 0, false, {
                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                    lineNumber: 108,
                    columnNumber: 17
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "row",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-lg-5 mb-4",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].contactInfo,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tag,
                                        children: "Get In Touch"
                                    }, void 0, false, {
                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                        lineNumber: 114,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        children: "Let's Build Your Perfect Dental Clinic"
                                    }, void 0, false, {
                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                        lineNumber: 116,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        children: "Connect with TECHNOMAC for premium dental equipment, clinic setup solutions and healthcare support."
                                    }, void 0, false, {
                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                        lineNumber: 120,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].infoBox,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].icon,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaPhoneAlt"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                    lineNumber: 131,
                                                    columnNumber: 62
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                lineNumber: 131,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        children: "Phone Number"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                        lineNumber: 135,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Sales Dept: +91-8448825572, +91-9268825571,+91-9599090411"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                        lineNumber: 137,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: [
                                                            "After-sales Service Dept: ",
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                href: "tel:+919311125574",
                                                                children: "+91 9311125574"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                lineNumber: 142,
                                                                columnNumber: 67
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                        lineNumber: 141,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                lineNumber: 133,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                        lineNumber: 129,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].infoBox,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].icon,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaEnvelope"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                    lineNumber: 156,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                lineNumber: 155,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        children: "Email Address"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                        lineNumber: 161,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "mailto:info@technomac.com",
                                                        children: "info@technomac.com"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                        lineNumber: 165,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                lineNumber: 159,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                        lineNumber: 153,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].infoBox,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].icon,
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaMapMarkerAlt"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                    lineNumber: 178,
                                                    columnNumber: 37
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                lineNumber: 177,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        children: "Office Address"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                        lineNumber: 183,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        children: "Plot no.-88, Pocket- L, Sector 1, Bawana Industrial Area, DSIIDC Sub-city, New Delhi-110039, India"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                        lineNumber: 187,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                lineNumber: 181,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                        lineNumber: 175,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                lineNumber: 112,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                            lineNumber: 110,
                            columnNumber: 21
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "col-lg-7",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formCard,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formHeader,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                children: "Send Inquiry"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                lineNumber: 206,
                                                columnNumber: 33
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("hr", {}, void 0, false, {
                                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                lineNumber: 207,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                        lineNumber: 205,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                        onSubmit: handleSubmit,
                                        noValidate: true,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "row",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-md-6",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    children: "Full Name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                    lineNumber: 214,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    name: "fullName",
                                                                    value: form.fullName,
                                                                    onChange: handleChange,
                                                                    placeholder: "Enter your name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                    lineNumber: 215,
                                                                    columnNumber: 45
                                                                }, this),
                                                                errors.fullName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].errorText,
                                                                    children: errors.fullName
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                    lineNumber: 216,
                                                                    columnNumber: 65
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                            lineNumber: 213,
                                                            columnNumber: 41
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                        lineNumber: 212,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-md-6",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    children: "Phone Number"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                    lineNumber: 222,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    name: "phoneNumber",
                                                                    value: form.phoneNumber,
                                                                    onChange: handleChange,
                                                                    placeholder: "Enter phone number"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                    lineNumber: 223,
                                                                    columnNumber: 45
                                                                }, this),
                                                                errors.phoneNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].errorText,
                                                                    children: errors.phoneNumber
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                    lineNumber: 224,
                                                                    columnNumber: 68
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                            lineNumber: 221,
                                                            columnNumber: 41
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                        lineNumber: 220,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-md-6",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    children: "Email Address"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                    lineNumber: 230,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "email",
                                                                    name: "email",
                                                                    value: form.email,
                                                                    onChange: handleChange,
                                                                    placeholder: "Enter email address"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                    lineNumber: 231,
                                                                    columnNumber: 45
                                                                }, this),
                                                                errors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].errorText,
                                                                    children: errors.email
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                    lineNumber: 232,
                                                                    columnNumber: 62
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                            lineNumber: 229,
                                                            columnNumber: 41
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                        lineNumber: 228,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-md-6",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    children: "Product Interest"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                    lineNumber: 238,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                    type: "text",
                                                                    name: "productInterest",
                                                                    value: form.productInterest,
                                                                    onChange: handleChange,
                                                                    placeholder: "Dental Chair"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                    lineNumber: 239,
                                                                    columnNumber: 45
                                                                }, this),
                                                                errors.productInterest && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].errorText,
                                                                    children: errors.productInterest
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                    lineNumber: 240,
                                                                    columnNumber: 72
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                            lineNumber: 237,
                                                            columnNumber: 41
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                        lineNumber: 235,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "col-12",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                    children: "Message"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                    lineNumber: 245,
                                                                    columnNumber: 45
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                    rows: "6",
                                                                    name: "message",
                                                                    value: form.message,
                                                                    onChange: handleChange,
                                                                    placeholder: "Write your message..."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                    lineNumber: 246,
                                                                    columnNumber: 45
                                                                }, this),
                                                                errors.message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].errorText,
                                                                    children: errors.message
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                    lineNumber: 247,
                                                                    columnNumber: 64
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                            lineNumber: 244,
                                                            columnNumber: 41
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                        lineNumber: 243,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                lineNumber: 211,
                                                columnNumber: 33
                                            }, this),
                                            errors.api && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].apiError,
                                                children: errors.api
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                lineNumber: 251,
                                                columnNumber: 48
                                            }, this),
                                            successMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].successMsg,
                                                children: successMsg
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                lineNumber: 254,
                                                columnNumber: 48
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].buttonGroup,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "submit",
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].submitBtn,
                                                        children: loading ? 'Send Inquiry...' : 'Send Inquiry'
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                        lineNumber: 258,
                                                        columnNumber: 37
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                        href: "https://wa.me/919999999999",
                                                        target: "_blank",
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].whatsappBtn,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaWhatsapp"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                                lineNumber: 260,
                                                                columnNumber: 41
                                                            }, this),
                                                            "WhatsApp"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                        lineNumber: 259,
                                                        columnNumber: 37
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                                lineNumber: 257,
                                                columnNumber: 33
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                        lineNumber: 209,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                                lineNumber: 204,
                                columnNumber: 25
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                            lineNumber: 203,
                            columnNumber: 21
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
                    lineNumber: 109,
                    columnNumber: 17
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
            lineNumber: 107,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/Component/contact/ContactPage/ContactPage.js",
        lineNumber: 106,
        columnNumber: 9
    }, this);
}
_s(ContactPage, "5yfIT4p5q+qJ9mr4nuxlpWlUJvk=");
_c = ContactPage;
var _c;
__turbopack_context__.k.register(_c, "ContactPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/Component/layout/Footer/Footer.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "footer": "Footer-module__2tDr4G__footer",
  "footerAbout": "Footer-module__2tDr4G__footerAbout",
  "footerBottom": "Footer-module__2tDr4G__footerBottom",
  "footerContact": "Footer-module__2tDr4G__footerContact",
  "footerLinks": "Footer-module__2tDr4G__footerLinks",
  "footerTop": "Footer-module__2tDr4G__footerTop",
  "inputGroup": "Footer-module__2tDr4G__inputGroup",
  "newsletterBox": "Footer-module__2tDr4G__newsletterBox",
  "newsletterForm": "Footer-module__2tDr4G__newsletterForm",
  "newsletterTag": "Footer-module__2tDr4G__newsletterTag",
  "queryBtn": "Footer-module__2tDr4G__queryBtn",
  "socialIcons": "Footer-module__2tDr4G__socialIcons",
});
}),
"[project]/Images/logo.png (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/logo.a1e679dc.png");}),
"[project]/Images/logo.png.mjs { IMAGE => \"[project]/Images/logo.png (static in ecmascript)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$logo$2e$png__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/Images/logo.png (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$logo$2e$png__$28$static__in__ecmascript$29$__["default"],
    width: 3375,
    height: 3375,
    blurWidth: 8,
    blurHeight: 8,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAXUlEQVR42rXKQQqAIBBAUd0laouISptlkIkkAyFYTOH9LxUdoFX04O8+Y59xzp/46+C9d0S055xTKYXONR6XqikJuUElLNNaK2PMAAAWEUOc3YIjBNf1UytVw/53AwTHCWXwVl5sAAAAAElFTkSuQmCC"
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/Component/layout/Footer/Footer.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/Component/layout/Footer/Footer.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Images$2f$logo$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/Images/logo.png.mjs { IMAGE => "[project]/Images/logo.png (static in ecmascript)" } [client] (structured image object with data url, ecmascript)');
;
;
;
;
;
;
function Footer() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("footer", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footer,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footerTop,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-lg-3 col-md-6 mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footerAbout,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            src: __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Images$2f$logo$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                                            alt: "DentalLoom Logo",
                                            width: 150,
                                            objectFit: "cover",
                                            height: 50
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 38,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Premium dental healthcare equipment supplier providing advanced clinic setup solutions and modern dental products for professionals."
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 40,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].socialIcons,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaFacebookF"], {}, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 50,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 49,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaInstagram"], {}, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 54,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 53,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaLinkedinIn"], {}, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 58,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 57,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaYoutube"], {}, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 62,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 61,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 47,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                    lineNumber: 33,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                lineNumber: 31,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-lg-2 col-md-6 mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footerLinks,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            children: "Quick Links"
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 77,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/",
                                                        children: "Home"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 84,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 83,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/about",
                                                        children: "About"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 90,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 89,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/updates",
                                                        children: "New Updates"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 96,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 95,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/blogs",
                                                        children: "Blog"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 102,
                                                        columnNumber: 19
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 101,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/products",
                                                        children: "Products"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 108,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 107,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/contact",
                                                        children: "Contact"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 114,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 113,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/privacy-policy",
                                                        children: "Privacy Policy"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 120,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 119,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 81,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                    lineNumber: 75,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                lineNumber: 73,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-lg-3 col-md-6 mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footerContact,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            children: "Contact Us"
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 136,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaPhoneAlt"], {}, void 0, false, {
                                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                            lineNumber: 141,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "tel:+919311125574",
                                                            children: "+91 9311125574"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                            lineNumber: 142,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 140,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaEnvelope"], {}, void 0, false, {
                                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                            lineNumber: 147,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                            href: "mailto:info@dentalloom.com",
                                                            children: "info@dentalloom.com"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                            lineNumber: 148,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 146,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaMapMarkerAlt"], {}, void 0, false, {
                                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                            lineNumber: 153,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: "Plot no.-88, Pocket- L, Sector 1, Bawana Industrial Area, DSIIDC Sub-city, New Delhi-110039, India"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                            lineNumber: 154,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 152,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 139,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                    lineNumber: 134,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                lineNumber: 132,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-lg-4 col-md-6 mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].newsletterBox,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            children: "Subscribe to Our Newsletter"
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 168,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Get latest dental equipment updates, offers and clinic setup innovations."
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 173,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].newsletterForm,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "email",
                                                        placeholder: "Enter your email",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 185,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "submit",
                                                        children: "Subscribe"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 191,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                lineNumber: 183,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 181,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("small", {
                                            children: "No spam. Only useful updates."
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 203,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                    lineNumber: 167,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                lineNumber: 165,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                        lineNumber: 27,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                    lineNumber: 25,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].footerBottom,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                        children: "© 2026 Technomac. All Rights Reserved."
                    }, void 0, false, {
                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                        lineNumber: 220,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                    lineNumber: 218,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/Component/layout/Footer/Footer.js",
            lineNumber: 21,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/Component/layout/Footer/Footer.js",
        lineNumber: 19,
        columnNumber: 5
    }, this);
}
_c = Footer;
var _c;
__turbopack_context__.k.register(_c, "Footer");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/Component/layout/Header/Header.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "active": "Header-module__tmD0sW__active",
  "activeCategory": "Header-module__tmD0sW__activeCategory",
  "alertPulse": "Header-module__tmD0sW__alertPulse",
  "arrowIcon": "Header-module__tmD0sW__arrowIcon",
  "categoryItem": "Header-module__tmD0sW__categoryItem",
  "categoryList": "Header-module__tmD0sW__categoryList",
  "closeBtn": "Header-module__tmD0sW__closeBtn",
  "header": "Header-module__tmD0sW__header",
  "logo": "Header-module__tmD0sW__logo",
  "mainNavbar": "Header-module__tmD0sW__mainNavbar",
  "megaMenu": "Header-module__tmD0sW__megaMenu",
  "megaMenuWrapper": "Header-module__tmD0sW__megaMenuWrapper",
  "menuTitle": "Header-module__tmD0sW__menuTitle",
  "mobileBtn": "Header-module__tmD0sW__mobileBtn",
  "navMenu": "Header-module__tmD0sW__navMenu",
  "navbar": "Header-module__tmD0sW__navbar",
  "overlay": "Header-module__tmD0sW__overlay",
  "productGrid": "Header-module__tmD0sW__productGrid",
  "productList": "Header-module__tmD0sW__productList",
  "pulseGlow": "Header-module__tmD0sW__pulseGlow",
  "quoteBtn": "Header-module__tmD0sW__quoteBtn",
  "rightSection": "Header-module__tmD0sW__rightSection",
  "shineMove": "Header-module__tmD0sW__shineMove",
  "sticky": "Header-module__tmD0sW__sticky",
  "topHeader": "Header-module__tmD0sW__topHeader",
  "topHeaderWrapper": "Header-module__tmD0sW__topHeaderWrapper",
  "topLeft": "Header-module__tmD0sW__topLeft",
  "topRight": "Header-module__tmD0sW__topRight",
  "warrantyBtn": "Header-module__tmD0sW__warrantyBtn",
});
}),
"[project]/Images/logo-chat.png (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/logo-chat.aa4deece.png");}),
"[project]/Images/logo-chat.png.mjs { IMAGE => \"[project]/Images/logo-chat.png (static in ecmascript)\" } [client] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$logo$2d$chat$2e$png__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/Images/logo-chat.png (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$logo$2d$chat$2e$png__$28$static__in__ecmascript$29$__["default"],
    width: 1536,
    height: 1024,
    blurWidth: 8,
    blurHeight: 5,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAYAAAB4ka1VAAAAXklEQVR42o3NMQqAIBSA4fceiaaGNhUNLjkpCl0oukRCt8hO3ObsP3/wA/SktaYYo0wpybCs0g9MCCRswDnH7lL2r9b8ntfxhOw3MQ4NICJwzsEYg7O1NCmFRNR1hx8YiAjyLulZMgAAAABJRU5ErkJggg=="
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/Component/layout/Header/Header.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import Link from "next/link";
// import { useState, useEffect } from "react";
// import {
//   FaBars,
//   FaTimes,
//   FaPhoneAlt,
//   FaEnvelope,
//   FaChevronDown,
//   FaFacebookF,
//   FaInstagram,
//   FaLinkedinIn,
//   FaYoutube,
// } from "react-icons/fa";
// import styles from "./Header.module.css";
// import logo from "../../../../Images/logo-chat.png";
// import Image from "next/image";
// // import menuData from "../../../Data/menuData";
// import menuData from "../../../../Data/menuData";
// export default function Header() {
//   const [mobileProductOpen, setMobileProductOpen] =
//     useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [sticky, setSticky] = useState(false);
//   const [activeCategory, setActiveCategory] = useState(menuData[0]);
//   const [category, setCategory] = useState([])
//    const [subCategory, setSubCategory] = useState([])
//   const [loading, setLoading] = useState(false)
//   const fetchAllCategory = async () => {
//     try {
//       // ✅ Remove leading slash — getData likely prepends serverURL + "/"
//       const response = await getData("category/");
//       console.log("categoryResponse=>", response)
//       if (response.success === true) {
//         // console.log("SSSS==>response", category)
//         // ✅ Map API response to the shape our UI expects
//         const mapped = response.data.map((item) => ({
//           image: item.imageUrl || item.image || item.category_image,
//           name: item.title || item.name || "",
//           desc: item.desc || item.description || item.subtitle || "",
//           isRemote: item.isActive || true, // flag to use <img> instead of next/image for remote URLs
//         }));
//         setActiveCategory(response.data[0])
//         setCategory(mapped);
//       }
//       // If empty or null → keep static fallback already in state
//     } catch (e) {
//       console.error("Category fetch failed, using static fallback:", e?.message);
//       // ✅ Static Category already set as default — nothing extra needed
//     } finally {
//       setLoading(false);
//     }
//   };
//     const fetchAllSubCategory = async () => {
//     try {
//       const response = await getData(`sub-category/by-category/${activeCategory}`);
//       console.log("categoryResponse=>", response)
//       if (response.success === true) {
//         // console.log("SSSS==>response", category)
//         // ✅ Map API response to the shape our UI expects
//         const mapped = response.data.map((item) => ({
//           image: item.imageUrl || item.image || item.category_image,
//           name: item.title || item.name || "",
//           desc: item.desc || item.description || item.subtitle || "",
//           isRemote: item.isActive || true, // flag to use <img> instead of next/image for remote URLs
//         }));
//         setSubCategory(mapped);
//       }
//       // If empty or null → keep static fallback already in state
//     } catch (e) {
//       console.error("Category fetch failed, using static fallback:", e?.message);
//       // ✅ Static Category already set as default — nothing extra needed
//     } finally {
//       setLoading(false);
//     }
//   };
//   // ✅ useEffect instead of useState
//   useEffect(() => {
//     fetchAllCategory();
//     fetchAllSubCategory()
//   }, [activeCategory]);
//   // console.log("SSSS==>response", category)
//   useEffect(() => {
//     const handleScroll = () => {
//       setSticky(window.scrollY > 20);
//     };
//     window.addEventListener("scroll", handleScroll);
//     return () =>
//       window.removeEventListener("scroll", handleScroll);
//   }, []);
//   return (
//     <>
//       <header
//         className={`${styles.header} ${sticky ? styles.sticky : ""
//           }`}
//       >
//         {/* TOP HEADER */}
//         <div className={styles.topHeader}>
//           <div className="container">
//             <div className={styles.topHeaderWrapper}>
//               {/* Left */}
//               <div className={styles.topLeft}>
//                 <a href="tel:+919311125574">
//                   <FaPhoneAlt />
//                   +91 9311125574
//                 </a>
//                 <a href="mailto:info@Technomac.com">
//                   <FaEnvelope />
//                   info@Technomac.com
//                 </a>
//               </div>
//               {/* Right */}
//               <div className={styles.topRight}>
//                 <a href="#" target="_blank">
//                   <FaFacebookF />
//                 </a>
//                 <a href="#" target="_blank">
//                   <FaInstagram />
//                 </a>
//                 <a href="#" target="_blank">
//                   <FaLinkedinIn />
//                 </a>
//                 <a href="#" target="_blank">
//                   <FaYoutube />
//                 </a>
//               </div>
//             </div>
//           </div>
//         </div>
//         {/* MAIN NAVBAR */}
//         <div className={styles.mainNavbar}>
//           <div className="container">
//             <div className={styles.navbar}>
//               {/* Logo */}
//               <div className={styles.logo}>
//                 <Link href="/">
//                   <Image src={logo} alt="TECHNOMAC Logo" height={50} width={150} />
//                 </Link>
//               </div>
//               {/* Menu */}
//               <nav
//                 className={`${styles.navMenu} ${menuOpen ? styles.active : ""
//                   }`}
//               >
//                 <Link href="/">Home</Link>
//                 {/* <Link href="/about">
//                   About
//                 </Link> */}
//                 <div className={styles.megaMenuWrapper}>
//                   <Link href="/products">
//                     <span className={styles.menuTitle}>
//                       Products
//                       <FaChevronDown className={styles.arrowIcon} />
//                     </span>
//                   </Link>
//                   {/* MEGA MENU */}
//                   <div className={styles.megaMenu}>
//                     {/* LEFT CATEGORY */}
//                     <div className={styles.categoryList}>
//                       {category.map((item, index) => (
//                         <div
//                           key={index}
//                           className={`${styles.categoryItem}
//                                     ${activeCategory.category._id === item._id
//                               ? styles.activeCategory
//                               : ""
//                             }`}
//                           onMouseEnter={() =>
//                             setActiveCategory(item)
//                           }
//                         >
//                           {item.name}
//                         </div>
//                       ))}
//                     </div>
//                     {/* RIGHT PRODUCTS */}
//                     <div className={styles.productList}>
//                       <h4>
//                         {activeCategory.category}
//                       </h4>
//                       <div className={styles.productGrid}>
//                         {activeCategory.products.map(
//                           (product, index) => (
//                             <Link href="/products"
//                               key={index}
//                             >
//                               {product}
//                             </Link>
//                           )
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//                 <Link href="/certificates">
//                   Certificates
//                 </Link>
//                 <Link href="/catalogue">
//                   Catalogue
//                 </Link>
//                 <Link href="/clinic-setup">
//                   Clinic Setup
//                 </Link>
//                 {/* <Link href="/blogs">
//                   Blogs
//                 </Link> */}
//                 <Link href="/updates">
//                   New Updates
//                 </Link>
//                 <Link href="/contact">
//                   Contact Us
//                 </Link>
//                 {/* <Link href="/e-library">
//                   e-Library
//                 </Link> */}
//                 <button
//                   className={styles.closeBtn}
//                   onClick={() => setMenuOpen(false)}
//                 >
//                   <FaTimes />
//                 </button>
//               </nav>
//               {/* Right Section */}
//               <div className={styles.rightSection}>
//                 <Link href="/warranty-registration">
//                   <button className={styles.warrantyBtn}>
//                     Extend Warranty
//                   </button>
//                 </Link>
//                 <button className={styles.quoteBtn}>
//                   Pay Now
//                 </button>
//                 <button
//                   className={styles.mobileBtn}
//                   onClick={() => setMenuOpen(true)}
//                 >
//                   <FaBars />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>
//       {/* Overlay */}
//       {menuOpen && (
//         <div
//           className={styles.overlay}
//           onClick={() => setMenuOpen(false)}
//         ></div>
//       )}
//     </>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>Header
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/Component/layout/Header/Header.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$logo$2d$chat$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Images$2f$logo$2d$chat$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/Images/logo-chat.png.mjs { IMAGE => "[project]/Images/logo-chat.png (static in ecmascript)" } [client] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$FetchNodeServices$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/FetchNodeServices.js [client] (ecmascript)"); // ✅ ADDED
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
;
;
function Header() {
    _s();
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [sticky, setSticky] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]); // all categories from API
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null); // currently hovered category object
    const [subCategories, setSubCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])([]); // subcategories of active category
    // ✅ Cache: { [categoryId]: [subCategory, ...] } — avoids re-fetching on re-hover
    const [subCategoryCache, setSubCategoryCache] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [loadingCategories, setLoadingCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [loadingSubCategories, setLoadingSubCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    // ─── 1. Fetch all categories once on mount ──────────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            const fetchAllCategory = {
                "Header.useEffect.fetchAllCategory": async ()=>{
                    try {
                        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$FetchNodeServices$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getData"])("category/");
                        console.log("categoryResponse=>", response);
                        if (response?.success === true && Array.isArray(response.data)) {
                            setCategories(response.data);
                            // Set first category as default active
                            if (response.data.length > 0) {
                                setActiveCategory(response.data[0]);
                            }
                        }
                    } catch (e) {
                        console.error("Category fetch failed:", e?.message);
                    } finally{
                        setLoadingCategories(false);
                    }
                }
            }["Header.useEffect.fetchAllCategory"];
            fetchAllCategory();
        }
    }["Header.useEffect"], []); // ✅ empty deps — runs once only
    // ─── 2. Fetch subcategories when activeCategory changes ────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            if (!activeCategory?._id) return;
            const categoryId = activeCategory._id;
            // ✅ Use cache if already fetched
            if (subCategoryCache[categoryId]) {
                setSubCategories(subCategoryCache[categoryId]);
                return;
            }
            const fetchSubCategories = {
                "Header.useEffect.fetchSubCategories": async ()=>{
                    setLoadingSubCategories(true);
                    try {
                        const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$FetchNodeServices$2e$js__$5b$client$5d$__$28$ecmascript$29$__["getData"])(`sub-category/by-category/${categoryId}`);
                        console.log("subCategoryResponse=>", response);
                        if (response?.success === true && Array.isArray(response.data)) {
                            setSubCategories(response.data);
                            // ✅ Save to cache
                            setSubCategoryCache({
                                "Header.useEffect.fetchSubCategories": (prev)=>({
                                        ...prev,
                                        [categoryId]: response.data
                                    })
                            }["Header.useEffect.fetchSubCategories"]);
                        } else {
                            setSubCategories([]);
                        }
                    } catch (e) {
                        console.error("SubCategory fetch failed:", e?.message);
                        setSubCategories([]);
                    } finally{
                        setLoadingSubCategories(false);
                    }
                }
            }["Header.useEffect.fetchSubCategories"];
            fetchSubCategories();
        }
    }["Header.useEffect"], [
        activeCategory?._id
    ]); // ✅ only re-runs when category ID changes
    // ─── 3. Sticky scroll ───────────────────────────────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Header.useEffect": ()=>{
            const handleScroll = {
                "Header.useEffect.handleScroll": ()=>setSticky(window.scrollY > 20)
            }["Header.useEffect.handleScroll"];
            window.addEventListener("scroll", handleScroll);
            return ({
                "Header.useEffect": ()=>window.removeEventListener("scroll", handleScroll)
            })["Header.useEffect"];
        }
    }["Header.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].header} ${sticky ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].sticky : ""}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].topHeader,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "container",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].topHeaderWrapper,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].topLeft,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "tel:+919311125574",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaPhoneAlt"], {}, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Header/Header.js",
                                                        lineNumber: 456,
                                                        columnNumber: 45
                                                    }, this),
                                                    " +91 9311125574"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 456,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "mailto:info@Technomac.com",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaEnvelope"], {}, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Header/Header.js",
                                                        lineNumber: 457,
                                                        columnNumber: 53
                                                    }, this),
                                                    " info@Technomac.com"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 457,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/Component/layout/Header/Header.js",
                                        lineNumber: 455,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].topRight,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#",
                                                target: "_blank",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaFacebookF"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Header/Header.js",
                                                    lineNumber: 460,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 460,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#",
                                                target: "_blank",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaInstagram"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Header/Header.js",
                                                    lineNumber: 461,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 461,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#",
                                                target: "_blank",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaLinkedinIn"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Header/Header.js",
                                                    lineNumber: 462,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 462,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#",
                                                target: "_blank",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaYoutube"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Header/Header.js",
                                                    lineNumber: 463,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 463,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/Component/layout/Header/Header.js",
                                        lineNumber: 459,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                lineNumber: 454,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/Component/layout/Header/Header.js",
                            lineNumber: 453,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/Component/layout/Header/Header.js",
                        lineNumber: 452,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mainNavbar,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "container",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navbar,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].logo,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                src: __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$logo$2d$chat$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Images$2f$logo$2d$chat$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$client$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                                                alt: "TECHNOMAC Logo",
                                                height: 50,
                                                width: 150
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 477,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/layout/Header/Header.js",
                                            lineNumber: 476,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/Component/layout/Header/Header.js",
                                        lineNumber: 475,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].navMenu} ${menuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].active : ""}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/",
                                                children: "Home"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 483,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].megaMenuWrapper,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/products",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].menuTitle,
                                                            children: [
                                                                "Products ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaChevronDown"], {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].arrowIcon
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                    lineNumber: 489,
                                                                    columnNumber: 32
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/Component/layout/Header/Header.js",
                                                            lineNumber: 488,
                                                            columnNumber: 21
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Header/Header.js",
                                                        lineNumber: 487,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].megaMenu,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categoryList,
                                                                children: loadingCategories ? Array.from({
                                                                    length: 5
                                                                }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categoryItemSkeleton
                                                                    }, i, false, {
                                                                        fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                        lineNumber: 499,
                                                                        columnNumber: 27
                                                                    }, this)) : categories.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].categoryItem} ${activeCategory?._id === item._id ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].activeCategory : ""}`,
                                                                        onMouseEnter: ()=>setActiveCategory(item),
                                                                        children: item.name || item.title || item.categoryName
                                                                    }, item._id, false, {
                                                                        fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                        lineNumber: 503,
                                                                        columnNumber: 27
                                                                    }, this))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                lineNumber: 496,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].productList,
                                                                children: [
                                                                    activeCategory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                        children: activeCategory.name || activeCategory.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                        lineNumber: 522,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].productGrid,
                                                                        children: loadingSubCategories ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].loadingText,
                                                                            children: "Loading..."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                            lineNumber: 527,
                                                                            columnNumber: 27
                                                                        }, this) : subCategories.length > 0 ? subCategories.map((sub)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                href: `/products?category=${activeCategory?._id}&sub=${sub._id}`,
                                                                                children: sub.name || sub.title || sub.subCategoryName
                                                                            }, sub._id, false, {
                                                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                                lineNumber: 530,
                                                                                columnNumber: 29
                                                                            }, this)) : !loadingSubCategories && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].noProducts,
                                                                            children: "No subcategories found"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                            lineNumber: 540,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                        lineNumber: 525,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                lineNumber: 520,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/layout/Header/Header.js",
                                                        lineNumber: 493,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 486,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/certificates",
                                                children: "Certificates"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 549,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/catalogue",
                                                children: "Catalogue"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 550,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/clinic-setup",
                                                children: "Clinic Setup"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 551,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/updates",
                                                children: "New Updates"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 552,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/contact",
                                                children: "Contact Us"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 553,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].closeBtn,
                                                onClick: ()=>setMenuOpen(false),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaTimes"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Header/Header.js",
                                                    lineNumber: 556,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 555,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/Component/layout/Header/Header.js",
                                        lineNumber: 482,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].rightSection,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/warranty-registration",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].warrantyBtn,
                                                    children: "Extend Warranty"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Header/Header.js",
                                                    lineNumber: 563,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 562,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quoteBtn,
                                                children: "Pay Now"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 565,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].mobileBtn,
                                                onClick: ()=>setMenuOpen(true),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaBars"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Header/Header.js",
                                                    lineNumber: 567,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 566,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/Component/layout/Header/Header.js",
                                        lineNumber: 561,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                lineNumber: 472,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/Component/layout/Header/Header.js",
                            lineNumber: 471,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/Component/layout/Header/Header.js",
                        lineNumber: 470,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/Component/layout/Header/Header.js",
                lineNumber: 449,
                columnNumber: 7
            }, this),
            menuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].overlay,
                onClick: ()=>setMenuOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/Component/layout/Header/Header.js",
                lineNumber: 578,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
_s(Header, "4DflimxUVxCYQH90D0T4VhYB7gM=");
_c = Header;
var _c;
__turbopack_context__.k.register(_c, "Header");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/Component/layout/Layout.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Layout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/layout/Footer/Footer.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/layout/Header/Header.js [client] (ecmascript)");
;
;
;
function Layout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/Component/layout/Layout.js",
                lineNumber: 7,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "mainContent",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/Component/layout/Layout.js",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/Component/layout/Layout.js",
                lineNumber: 13,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = Layout;
var _c;
__turbopack_context__.k.register(_c, "Layout");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/contact.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Contact
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$common$2f$Breadcrumb$2f$Breadcrumb$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/common/Breadcrumb/Breadcrumb.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/contact/ContactPage/ContactPage.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/layout/Layout.js [client] (ecmascript)");
;
;
;
;
function Contact() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$contact$2f$ContactPage$2f$ContactPage$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/pages/contact.js",
            lineNumber: 10,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/pages/contact.js",
        lineNumber: 9,
        columnNumber: 5
    }, this);
}
_c = Contact;
var _c;
__turbopack_context__.k.register(_c, "Contact");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/contact.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/contact";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/contact.js [client] (ecmascript)");
    }
]);
// @ts-expect-error module.hot exists
if (module.hot) {
    // @ts-expect-error module.hot exists
    module.hot.dispose(function() {
        window.__NEXT_P.push([
            PAGE_PATH
        ]);
    });
}
}),
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/contact\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/contact.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__89c1fd6c._.js.map