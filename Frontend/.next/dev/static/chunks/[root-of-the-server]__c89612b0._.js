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
"[project]/src/Component/warranty/WarrantyForm/WarrantyForm.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "apiError": "WarrantyForm-module__qrJxSW__apiError",
  "errorText": "WarrantyForm-module__qrJxSW__errorText",
  "fieldError": "WarrantyForm-module__qrJxSW__fieldError",
  "formCard": "WarrantyForm-module__qrJxSW__formCard",
  "formField": "WarrantyForm-module__qrJxSW__formField",
  "heading": "WarrantyForm-module__qrJxSW__heading",
  "imagePreview": "WarrantyForm-module__qrJxSW__imagePreview",
  "infoCard": "WarrantyForm-module__qrJxSW__infoCard",
  "inputGroup": "WarrantyForm-module__qrJxSW__inputGroup",
  "submitBtn": "WarrantyForm-module__qrJxSW__submitBtn",
  "successMsg": "WarrantyForm-module__qrJxSW__successMsg",
  "uploadBox": "WarrantyForm-module__qrJxSW__uploadBox",
  "warrantySection": "WarrantyForm-module__qrJxSW__warrantySection",
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
"[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
// import styles from "./WarrantyForm.module.css";
// import {
//   FaUser,
//   FaEnvelope,
//   FaPhoneAlt,
//   FaClinicMedical,
//   FaMapMarkerAlt,
//   FaCalendarAlt,
//   FaHashtag,
//   FaBuilding,
//   FaUpload,
//   FaShieldAlt,
//   FaCheckCircle,
// } from "react-icons/fa";
// export default function WarrantyForm() {
//   return (
//     <section className={styles.warrantySection}>
//       {/* BACKGROUND GLOW */}
//       <div className={styles.glow}></div>
//       <div className="container">
//         <Breadcrumb pageName="Extend Warranty" />
//         {/* TOP CONTENT */}
//         <div className={styles.heading}>
//           <span>
//             TECHNOMAC WARRANTY
//           </span>
//           <h1>
//             Warranty Registration Form
//           </h1>
//           <p>
//             Thank you for choosing our
//             product and registering your
//             warranty with TECHNOMAC.
//             Register your equipment to
//             receive fast support, warranty
//             service assistance and priority
//             technical support from our team.
//           </p>
//         </div>
//         {/* INFO CARDS */}
//         <div className="row mb-5">
//           <div className="col-lg-4 col-md-6 mb-4">
//             <div className={styles.infoCard}>
//               <FaShieldAlt />
//               <h4>
//                 Product Protection
//               </h4>
//               <p>
//                 Get official warranty
//                 protection for your
//                 TECHNOMAC products.
//               </p>
//             </div>
//           </div>
//           <div className="col-lg-4 col-md-6 mb-4">
//             <div className={styles.infoCard}>
//               <FaCheckCircle />
//               <h4>
//                 Fast Service Support
//               </h4>
//               <p>
//                 Receive quick technical
//                 support and faster
//                 service processing.
//               </p>
//             </div>
//           </div>
//           <div className="col-lg-4 col-md-6 mb-4">
//             <div className={styles.infoCard}>
//               <FaClinicMedical />
//               <h4>
//                 Trusted Healthcare
//               </h4>
//               <p>
//                 Supporting modern dental
//                 clinics with premium
//                 healthcare solutions.
//               </p>
//             </div>
//           </div>
//         </div>
//         {/* FORM CARD */}
//         <div className={styles.formCard}>
//         <form>
//   <div className="row">
//     {/* EMAIL */}
//     <div className="col-lg-6">
//       <div className={styles.formField}>
//         <label>
//           Email Address *
//         </label>
//         <div className={styles.inputGroup}>
//           <FaEnvelope />
//           <input
//             type="email"
//             placeholder="Enter Email Address"
//             required
//           />
//         </div>
//       </div>
//     </div>
//     {/* CUSTOMER NAME */}
//     <div className="col-lg-6">
//       <div className={styles.formField}>
//         <label>
//           Customer Name *
//         </label>
//         <div className={styles.inputGroup}>
//           <FaUser />
//           <input
//             type="text"
//             placeholder="Enter Customer Name"
//             required
//           />
//         </div>
//       </div>
//     </div>
//     {/* CLINIC NAME */}
//     <div className="col-lg-6">
//       <div className={styles.formField}>
//         <label>
//           Clinic Name *
//         </label>
//         <div className={styles.inputGroup}>
//           <FaClinicMedical />
//           <input
//             type="text"
//             placeholder="Enter Clinic Name"
//             required
//           />
//         </div>
//       </div>
//     </div>
//     {/* CONTACT */}
//     <div className="col-lg-6">
//       <div className={styles.formField}>
//         <label>
//           Customer Contact *
//         </label>
//         <div className={styles.inputGroup}>
//           <FaPhoneAlt />
//           <input
//             type="text"
//             placeholder="Enter Contact Number"
//             required
//           />
//         </div>
//       </div>
//     </div>
//     {/* ADDRESS */}
//     <div className="col-lg-12">
//       <div className={styles.formField}>
//         <label>
//           Clinic Address *
//         </label>
//         <div className={styles.inputGroup}>
//           <FaMapMarkerAlt />
//           <textarea
//             placeholder="Enter Clinic Address"
//             required
//           ></textarea>
//         </div>
//       </div>
//     </div>
//     {/* PURCHASE DATE */}
//     <div className="col-lg-6">
//       <div className={styles.formField}>
//         <label>
//           Purchase Date *
//         </label>
//         <div className={styles.inputGroup}>
//           <FaCalendarAlt />
//           <input
//             type="date"
//             required
//           />
//         </div>
//       </div>
//     </div>
//     {/* MODEL */}
//     <div className="col-lg-6">
//       <div className={styles.formField}>
//         <label>
//           Product Model *
//         </label>
//         <div className={styles.inputGroup}>
//           <FaBuilding />
//           <select required>
//             <option value="">
//               Select Product Model
//             </option>
//             <option>
//               MR-01/70 Wall Model
//             </option>
//             <option>
//               MR-01/60 Wall Model
//             </option>
//             <option>
//               MR-01 Floor Model
//             </option>
//             <option>
//               Cliq-X Portable X-Ray
//             </option>
//             <option>
//               Garuda Dental Chair
//             </option>
//             <option>
//               Garuda Plus Dental Chair
//             </option>
//             <option>
//               UV Cabinet
//             </option>
//             <option>
//               Auto Clave
//             </option>
//             <option>
//               RVG Sensor
//             </option>
//           </select>
//         </div>
//       </div>
//     </div>
//     {/* SERIAL NUMBER */}
//     <div className="col-lg-6">
//       <div className={styles.formField}>
//         <label>
//           Serial Number *
//         </label>
//         <div className={styles.inputGroup}>
//           <FaHashtag />
//           <input
//             type="text"
//             placeholder="Enter Serial Number"
//             required
//           />
//         </div>
//       </div>
//     </div>
//     {/* DEALER NAME */}
//     <div className="col-lg-6">
//       <div className={styles.formField}>
//         <label>
//           Dealer Name *
//         </label>
//         <div className={styles.inputGroup}>
//           <FaUser />
//           <input
//             type="text"
//             placeholder="Enter Dealer Name"
//             required
//           />
//         </div>
//       </div>
//     </div>
//     {/* DEALER COMPANY */}
//     <div className="col-lg-6">
//       <div className={styles.formField}>
//         <label>
//           Dealer Company *
//         </label>
//         <div className={styles.inputGroup}>
//           <FaBuilding />
//           <input
//             type="text"
//             placeholder="Enter Dealer Company"
//             required
//           />
//         </div>
//       </div>
//     </div>
//     {/* DEALER CONTACT */}
//     <div className="col-lg-6">
//       <div className={styles.formField}>
//         <label>
//           Dealer Contact *
//         </label>
//         <div className={styles.inputGroup}>
//           <FaPhoneAlt />
//           <input
//             type="text"
//             placeholder="Enter Dealer Contact"
//             required
//           />
//         </div>
//       </div>
//     </div>
//     {/* DEALER ADDRESS */}
//     <div className="col-lg-12">
//       <div className={styles.formField}>
//         <label>
//           Dealer Address *
//         </label>
//         <div className={styles.inputGroup}>
//           <FaMapMarkerAlt />
//           <textarea
//             placeholder="Enter Dealer Address"
//             required
//           ></textarea>
//         </div>
//       </div>
//     </div>
//     {/* FILE UPLOAD */}
//     <div className="col-lg-12">
//       <div className={styles.formField}>
//         <label>
//           Upload Installed Product Image *
//         </label>
//         <div className={styles.uploadBox}>
//           <FaUpload />
//           <h4>
//             Upload Product Image
//           </h4>
//           <p>
//             Upload image of installed
//             X-ray machine or product.
//           </p>
//           <input
//             type="file"
//             accept="image/*"
//           />
//         </div>
//       </div>
//     </div>
//   </div>
//   {/* BUTTON */}
//   <button
//     type="submit"
//     className={styles.submitBtn}
//   >
//     Submit Warranty Registration
//   </button>
// </form>
//         </div>
//       </div>
//     </section>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>WarrantyForm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$common$2f$Breadcrumb$2f$Breadcrumb$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/common/Breadcrumb/Breadcrumb.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/Component/warranty/WarrantyForm/WarrantyForm.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$FetchNodeServices$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/FetchNodeServices.js [client] (ecmascript)"); // ✅ ADDED
;
var _s = __turbopack_context__.k.signature();
;
;
;
;
;
const PRODUCT_MODELS = [
    "MR-01/70 Wall Model",
    "MR-01/60 Wall Model",
    "MR-01 Floor Model",
    "Cliq-X Portable X-Ray",
    "Garuda Dental Chair",
    "Garuda Plus Dental Chair",
    "UV Cabinet",
    "Auto Clave",
    "RVG Sensor"
];
function WarrantyForm() {
    _s();
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        email: "",
        customerName: "",
        clinicName: "",
        customerContact: "",
        clinicAddress: "",
        purchaseDate: "",
        productModel: "",
        serialNumber: "",
        dealerName: "",
        dealerCompany: "",
        dealerContact: "",
        dealerAddress: ""
    });
    const [image, setImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null); // ✅ file handled separately
    const [imagePreview, setImagePreview] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({});
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [successMsg, setSuccessMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    // ─── Handle Text/Select/Date Change ─────────────────────────────────────────
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setForm((prev)=>({
                ...prev,
                [name]: value
            }));
        if (errors[name]) setErrors((prev)=>({
                ...prev,
                [name]: ""
            }));
    };
    // ─── Handle File Upload ──────────────────────────────────────────────────────
    const handleFileChange = (e)=>{
        const file = e.target.files[0];
        if (!file) return;
        // ✅ Validate file type and size (max 5MB)
        if (!file.type.startsWith("image/")) {
            setErrors((prev)=>({
                    ...prev,
                    image: "Only image files are allowed"
                }));
            return;
        }
        if (file.size > 5 * 1024 * 1024) {
            setErrors((prev)=>({
                    ...prev,
                    image: "Image must be under 5MB"
                }));
            return;
        }
        setImage(file);
        setImagePreview(URL.createObjectURL(file));
        setErrors((prev)=>({
                ...prev,
                image: ""
            }));
    };
    // ─── Validation ──────────────────────────────────────────────────────────────
    const validate = ()=>{
        const e = {};
        const phoneRegex = /^[6-9]\d{9}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!form.email.trim()) e.email = "Email is required";
        else if (!emailRegex.test(form.email)) e.email = "Enter a valid email";
        if (!form.customerName.trim()) e.customerName = "Customer name is required";
        if (!form.clinicName.trim()) e.clinicName = "Clinic name is required";
        if (!form.customerContact.trim()) e.customerContact = "Contact number is required";
        else if (!phoneRegex.test(form.customerContact)) e.customerContact = "Enter a valid 10-digit number";
        if (!form.clinicAddress.trim()) e.clinicAddress = "Clinic address is required";
        if (!form.purchaseDate) e.purchaseDate = "Purchase date is required";
        if (!form.productModel) e.productModel = "Please select a product model";
        if (!form.serialNumber.trim()) e.serialNumber = "Serial number is required";
        if (!form.dealerName.trim()) e.dealerName = "Dealer name is required";
        if (!form.dealerCompany.trim()) e.dealerCompany = "Dealer company is required";
        if (!form.dealerContact.trim()) e.dealerContact = "Dealer contact is required";
        else if (!phoneRegex.test(form.dealerContact)) e.dealerContact = "Enter a valid 10-digit number";
        if (!form.dealerAddress.trim()) e.dealerAddress = "Dealer address is required";
        if (!image) e.image = "Product image is required";
        return e;
    };
    // ─── Handle Submit ────────────────────────────────────────────────────────────
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            // ✅ Scroll to first error
            window.scrollTo({
                top: 300,
                behavior: "smooth"
            });
            return;
        }
        // ✅ Use FormData — required for file upload
        const payload = new FormData();
        payload.append("email", form.email.trim());
        payload.append("customerName", form.customerName.trim());
        payload.append("clinicName", form.clinicName.trim());
        payload.append("customerContact", form.customerContact.trim());
        payload.append("clinicAddress", form.clinicAddress.trim());
        payload.append("purchaseDate", form.purchaseDate);
        payload.append("productModel", form.productModel);
        payload.append("serialNumber", form.serialNumber.trim());
        payload.append("dealerName", form.dealerName.trim());
        payload.append("dealerCompany", form.dealerCompany.trim());
        payload.append("dealerContact", form.dealerContact.trim());
        payload.append("dealerAddress", form.dealerAddress.trim());
        payload.append("productImage", image); // ✅ file appended
        console.log("Warranty Payload =>", Object.fromEntries(payload));
        setLoading(true);
        setSuccessMsg("");
        try {
            const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$FetchNodeServices$2e$js__$5b$client$5d$__$28$ecmascript$29$__["postData"])("warranty/register", payload);
            console.log("Warranty Response =>", response);
            if (response?.success === true) {
                setSuccessMsg("Warranty registered successfully! Our team will contact you soon.");
                // ✅ Reset all fields
                setForm({
                    email: "",
                    customerName: "",
                    clinicName: "",
                    customerContact: "",
                    clinicAddress: "",
                    purchaseDate: "",
                    productModel: "",
                    serialNumber: "",
                    dealerName: "",
                    dealerCompany: "",
                    dealerContact: "",
                    dealerAddress: ""
                });
                setImage(null);
                setImagePreview(null);
                setErrors({});
            } else {
                setErrors({
                    api: response?.message || "Something went wrong. Please try again."
                });
            }
        } catch (err) {
            console.error("Warranty submit failed:", err?.message);
            setErrors({
                api: "Server error. Please try again later."
            });
        } finally{
            setLoading(false);
        }
    };
    // ─── Reusable error span ──────────────────────────────────────────────────────
    const Err = ({ field })=>errors[field] ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].errorText,
            children: errors[field]
        }, void 0, false, {
            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
            lineNumber: 698,
            columnNumber: 21
        }, this) : null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].warrantySection,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].glow
            }, void 0, false, {
                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                lineNumber: 702,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "container",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$common$2f$Breadcrumb$2f$Breadcrumb$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                        pageName: "Extend Warranty"
                    }, void 0, false, {
                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                        lineNumber: 705,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].heading,
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "TECHNOMAC WARRANTY"
                            }, void 0, false, {
                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                lineNumber: 709,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                children: "Warranty Registration Form"
                            }, void 0, false, {
                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                lineNumber: 710,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                children: "Thank you for choosing our product and registering your warranty with TECHNOMAC. Register your equipment to receive fast support, warranty service assistance and priority technical support from our team."
                            }, void 0, false, {
                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                lineNumber: 711,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                        lineNumber: 708,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "row mb-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-lg-4 col-md-6 mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].infoCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaShieldAlt"], {}, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 722,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            children: "Product Protection"
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 723,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Get official warranty protection for your TECHNOMAC products."
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 724,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                    lineNumber: 721,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                lineNumber: 720,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-lg-4 col-md-6 mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].infoCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaCheckCircle"], {}, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 729,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            children: "Fast Service Support"
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 730,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Receive quick technical support and faster service processing."
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 731,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                    lineNumber: 728,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                lineNumber: 727,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "col-lg-4 col-md-6 mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].infoCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaClinicMedical"], {}, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 736,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                            children: "Trusted Healthcare"
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 737,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            children: "Supporting modern dental clinics with premium healthcare solutions."
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 738,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                    lineNumber: 735,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                lineNumber: 734,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                        lineNumber: 719,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formCard,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                            onSubmit: handleSubmit,
                            noValidate: true,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "row",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-lg-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formField} ${errors.email ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fieldError : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Email Address *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 751,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaEnvelope"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 753,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "email",
                                                                name: "email",
                                                                value: form.email,
                                                                onChange: handleChange,
                                                                placeholder: "Enter Email Address"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 754,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 752,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Err, {
                                                        field: "email"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 757,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                lineNumber: 750,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 749,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-lg-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formField} ${errors.customerName ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fieldError : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Customer Name *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 764,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaUser"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 766,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                name: "customerName",
                                                                value: form.customerName,
                                                                onChange: handleChange,
                                                                placeholder: "Enter Customer Name"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 767,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 765,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Err, {
                                                        field: "customerName"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 770,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                lineNumber: 763,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 762,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-lg-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formField} ${errors.clinicName ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fieldError : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Clinic Name *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 777,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaClinicMedical"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 779,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                name: "clinicName",
                                                                value: form.clinicName,
                                                                onChange: handleChange,
                                                                placeholder: "Enter Clinic Name"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 780,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 778,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Err, {
                                                        field: "clinicName"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 783,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                lineNumber: 776,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 775,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-lg-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formField} ${errors.customerContact ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fieldError : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Customer Contact *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 790,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaPhoneAlt"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 792,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                name: "customerContact",
                                                                value: form.customerContact,
                                                                onChange: handleChange,
                                                                placeholder: "Enter Contact Number",
                                                                maxLength: 10
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 793,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 791,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Err, {
                                                        field: "customerContact"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 796,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                lineNumber: 789,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 788,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-lg-12",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formField} ${errors.clinicAddress ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fieldError : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Clinic Address *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 803,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaMapMarkerAlt"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 805,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                name: "clinicAddress",
                                                                value: form.clinicAddress,
                                                                onChange: handleChange,
                                                                placeholder: "Enter Clinic Address"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 806,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 804,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Err, {
                                                        field: "clinicAddress"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 809,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                lineNumber: 802,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 801,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-lg-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formField} ${errors.purchaseDate ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fieldError : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Purchase Date *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 816,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaCalendarAlt"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 818,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "date",
                                                                name: "purchaseDate",
                                                                value: form.purchaseDate,
                                                                onChange: handleChange,
                                                                max: new Date().toISOString().split("T")[0]
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 819,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 817,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Err, {
                                                        field: "purchaseDate"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 824,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                lineNumber: 815,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 814,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-lg-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formField} ${errors.productModel ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fieldError : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Product Model *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 831,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaBuilding"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 833,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                name: "productModel",
                                                                value: form.productModel,
                                                                onChange: handleChange,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "Select Product Model"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                        lineNumber: 835,
                                                                        columnNumber: 23
                                                                    }, this),
                                                                    PRODUCT_MODELS.map((model)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                            value: model,
                                                                            children: model
                                                                        }, model, false, {
                                                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                            lineNumber: 837,
                                                                            columnNumber: 25
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 834,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 832,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Err, {
                                                        field: "productModel"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 841,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                lineNumber: 830,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 829,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-lg-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formField} ${errors.serialNumber ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fieldError : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Serial Number *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 848,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaHashtag"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 850,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                name: "serialNumber",
                                                                value: form.serialNumber,
                                                                onChange: handleChange,
                                                                placeholder: "Enter Serial Number"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 851,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 849,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Err, {
                                                        field: "serialNumber"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 854,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                lineNumber: 847,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 846,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-lg-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formField} ${errors.dealerName ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fieldError : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Dealer Name *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 861,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaUser"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 863,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                name: "dealerName",
                                                                value: form.dealerName,
                                                                onChange: handleChange,
                                                                placeholder: "Enter Dealer Name"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 864,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 862,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Err, {
                                                        field: "dealerName"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 867,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                lineNumber: 860,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 859,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-lg-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formField} ${errors.dealerCompany ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fieldError : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Dealer Company *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 874,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaBuilding"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 876,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                name: "dealerCompany",
                                                                value: form.dealerCompany,
                                                                onChange: handleChange,
                                                                placeholder: "Enter Dealer Company"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 877,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 875,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Err, {
                                                        field: "dealerCompany"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 880,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                lineNumber: 873,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 872,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-lg-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formField} ${errors.dealerContact ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fieldError : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Dealer Contact *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 887,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaPhoneAlt"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 889,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                name: "dealerContact",
                                                                value: form.dealerContact,
                                                                onChange: handleChange,
                                                                placeholder: "Enter Dealer Contact",
                                                                maxLength: 10
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 890,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 888,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Err, {
                                                        field: "dealerContact"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 893,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                lineNumber: 886,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 885,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-lg-12",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formField} ${errors.dealerAddress ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fieldError : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Dealer Address *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 900,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputGroup,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaMapMarkerAlt"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 902,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                name: "dealerAddress",
                                                                value: form.dealerAddress,
                                                                onChange: handleChange,
                                                                placeholder: "Enter Dealer Address"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 903,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 901,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Err, {
                                                        field: "dealerAddress"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 906,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                lineNumber: 899,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 898,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "col-lg-12",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].formField} ${errors.image ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].fieldError : ""}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        children: "Upload Installed Product Image *"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 913,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].uploadBox,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaUpload"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 915,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                children: "Upload Product Image"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 916,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                children: "Upload image of installed X-ray machine or product. (Max 5MB)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 917,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "file",
                                                                accept: "image/*",
                                                                onChange: handleFileChange
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 918,
                                                                columnNumber: 21
                                                            }, this),
                                                            imagePreview && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                                src: imagePreview,
                                                                alt: "Preview",
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].imagePreview
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                                lineNumber: 921,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 914,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Err, {
                                                        field: "image"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                        lineNumber: 928,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                                lineNumber: 912,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                            lineNumber: 911,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                    lineNumber: 746,
                                    columnNumber: 13
                                }, this),
                                errors.api && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].apiError,
                                    children: errors.api
                                }, void 0, false, {
                                    fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                    lineNumber: 935,
                                    columnNumber: 28
                                }, this),
                                successMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].successMsg,
                                    children: successMsg
                                }, void 0, false, {
                                    fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                    lineNumber: 938,
                                    columnNumber: 28
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].submitBtn,
                                    disabled: loading,
                                    children: loading ? "Submitting..." : "Submit Warranty Registration"
                                }, void 0, false, {
                                    fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                                    lineNumber: 941,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                            lineNumber: 745,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                        lineNumber: 744,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
                lineNumber: 704,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js",
        lineNumber: 701,
        columnNumber: 5
    }, this);
}
_s(WarrantyForm, "hSobhS6fzIk9GJr86MVuT/Q9cc4=");
_c = WarrantyForm;
var _c;
__turbopack_context__.k.register(_c, "WarrantyForm");
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
                                                                        lineNumber: 521,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].productGrid,
                                                                        children: loadingSubCategories ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].loadingText,
                                                                            children: "Loading..."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                            lineNumber: 526,
                                                                            columnNumber: 27
                                                                        }, this) : subCategories.length > 0 ? subCategories.map((sub)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                                                // category=${activeCategory?._id}&
                                                                                href: `/products?sub=${sub._id}`,
                                                                                children: sub.name || sub.title || sub.subCategoryName
                                                                            }, sub._id, false, {
                                                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                                lineNumber: 529,
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
                                                                        lineNumber: 524,
                                                                        columnNumber: 23
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                lineNumber: 519,
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/warranty-registration",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].quoteBtn,
                                                    children: "Pay Now"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Header/Header.js",
                                                    lineNumber: 566,
                                                    columnNumber: 19
                                                }, this)
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
                                                    lineNumber: 570,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 569,
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
                lineNumber: 581,
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
"[project]/src/pages/warranty-registration.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>WarrantyRegistrationPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/warranty/WarrantyForm/WarrantyForm.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/layout/Layout.js [client] (ecmascript)");
;
;
;
function WarrantyRegistrationPage() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Layout$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$warranty$2f$WarrantyForm$2f$WarrantyForm$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
            fileName: "[project]/src/pages/warranty-registration.js",
            lineNumber: 10,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/pages/warranty-registration.js",
        lineNumber: 8,
        columnNumber: 5
    }, this);
}
_c = WarrantyRegistrationPage;
var _c;
__turbopack_context__.k.register(_c, "WarrantyRegistrationPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/warranty-registration.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/warranty-registration";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/warranty-registration.js [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/warranty-registration\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/warranty-registration.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__c89612b0._.js.map