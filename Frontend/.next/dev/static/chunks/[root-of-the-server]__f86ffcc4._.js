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
"[project]/src/Component/GlobalPopup/EnquiryPopup.module.css [client] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "apiError": "EnquiryPopup-module__zregZa__apiError",
  "closeBtn": "EnquiryPopup-module__zregZa__closeBtn",
  "errorText": "EnquiryPopup-module__zregZa__errorText",
  "fadeIn": "EnquiryPopup-module__zregZa__fadeIn",
  "inputBox": "EnquiryPopup-module__zregZa__inputBox",
  "inputError": "EnquiryPopup-module__zregZa__inputError",
  "overlay": "EnquiryPopup-module__zregZa__overlay",
  "popup": "EnquiryPopup-module__zregZa__popup",
  "popupShow": "EnquiryPopup-module__zregZa__popupShow",
  "submitBtn": "EnquiryPopup-module__zregZa__submitBtn",
  "successMsg": "EnquiryPopup-module__zregZa__successMsg",
  "tag": "EnquiryPopup-module__zregZa__tag",
});
}),
"[project]/src/Component/GlobalPopup/EnquiryPopup.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// "use client";
// import { useEffect, useState } from "react";
// import styles from "./EnquiryPopup.module.css";
// import {
//   FaTimes,
//   FaUser,
//   FaEnvelope,
//   FaPhoneAlt,
//   FaCommentDots,
// } from "react-icons/fa";
// export default function EnquiryPopup() {
//   const [show, setShow] = useState(false);
//   const [mounted, setMounted] = useState(false);
//   const [form, setForm] = useState({ fullName: '', phoneNumber: '', email: '', message: '', });
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [successMsg, setSuccessMsg] = useState("");
//   /* POPUP SHOW */
//   useEffect(() => {
//     setMounted(true);
//     if (
//       typeof window !== "undefined"
//     ) {
//       const submitted =
//         localStorage.getItem(
//           "enquirySubmitted"
//         );
//       if (!submitted) {
//         const timer =
//           setTimeout(() => {
//             setShow(true);
//           }, 5000);
//         return () =>
//           clearTimeout(timer);
//       }
//     }
//   }, []);
//   /* INPUT CHANGE */
//   // ─── Handle Input Change ───────────────────────────────────────────────────
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm((prev) => ({ ...prev, [name]: value }));
//     // ✅ Clear error on type
//     if (errors[name]) {
//       setErrors((prev) => ({ ...prev, [name]: "" }));
//     }
//   };
//   // ─── Validation ────────────────────────────────────────────────────────────
//   const validate = () => {
//     const newErrors = {};
//     if (!form.fullName.trim()) {
//       newErrors.fullName = "Name is required";
//     }
//     if (!form.email.trim()) {
//       newErrors.email = "Email is required";
//     } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
//       newErrors.email = "Enter a valid email";
//     }
//     if (!form.phoneNumber.trim()) {
//       newErrors.phoneNumber = "Phone is required";
//     } else if (!/^[6-9]\d{9}$/.test(form.phoneNumber)) {
//       newErrors.phoneNumber = "Enter a valid 10-digit phone number";
//     }
//     if (!form.message.trim()) {
//       newErrors.message = "Message is required";
//     }
//     if (!form.productInterest.trim()) {
//       newErrors.productInterest = "Message is required";
//     }
//     return newErrors;
//   };
//   // ─── Handle Submit ─────────────────────────────────────────────────────────
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const validationErrors = validate();
//     if (Object.keys(validationErrors).length > 0) {
//       setErrors(validationErrors);
//       return;
//     }
//     // ✅ Payload
//     const payload = {
//       fullName: form.fullName.trim(),
//       email: form.email.trim(),
//       phoneNumber: form.phoneNumber.trim(),
//       message: form.message.trim(),
//       productInterest: form.productInterest.trim(),
//     };
//     console.log("Enquiry Payload =>", payload);
//     setLoading(true);
//     setSuccessMsg("");
//     try {
//       const response = await postData("contact/create", payload);
//       console.log("Enquiry Response =>", response);
//       if (response?.success === true) {
//         setSuccessMsg("Thank you! We'll get back to you soon.");
//         setForm({ fullName: '', phoneNumber: '', email: '', productInterest: '', message: '', }); // ✅ reset
//         setErrors({});
//       } else {
//         setErrors({ api: response?.message || "Something went wrong. Please try again." });
//       }
//     } catch (e) {
//       console.error("Enquiry submit failed:", e?.message);
//       setErrors({ api: "Server error. Please try again later." });
//     } finally {
//       setLoading(false);
//     }
//   };
//   /* SSR FIX */
//   if (!mounted) return null;
//   /* HIDE POPUP */
//   if (!show) return null;
//   return (
//     <div className={styles.overlay}>
//       <div className={styles.popup}>
//         {/* CLOSE */}
//         <button
//           className={styles.closeBtn}
//           onClick={() =>
//             setShow(false)
//           }
//         >
//           <FaTimes />
//         </button>
//         {/* TOP */}
//         <span className={styles.tag}>
//           TECHNOMAC
//         </span>
//         <h2>
//           Quick Enquiry
//         </h2>
//         <p>
//           Get free consultation for
//           dental clinic setup and
//           equipment solutions.
//         </p>
//         {/* FORM */}
//         <form
//           onSubmit={handleSubmit}
//         >
//           <div className="row">
//             {/* NAME */}
//             <div className="col-md-6">
//               <div className={styles.inputBox}>
//                 <FaUser />
//                 <input
//                   type="text"
//                   name="name"
//                   placeholder="Your Name"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             {/* EMAIL */}
//             <div className="col-md-6">
//               <div className={styles.inputBox}>
//                 <FaEnvelope />
//                 <input
//                   type="email"
//                   name="email"
//                   placeholder="Email"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             {/* MOBILE */}
//             <div className="col-md-6">
//               <div className={styles.inputBox}>
//                 <FaPhoneAlt />
//                 <input
//                   type="text"
//                   name="mobile"
//                   placeholder="Mobile"
//                   required
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//             {/* QUERY */}
//             <div className="col-md-6">
//               <div className={styles.inputBox}>
//                 <FaCommentDots />
//                 <textarea
//                   name="query"
//                   placeholder="Your Query"
//                   rows="1"
//                   required
//                   onChange={handleChange}
//                 ></textarea>
//               </div>
//             </div>
//           </div>
//           {/* BUTTON */}
//           <button
//             type="submit"
//             className={styles.submitBtn}
//           >
//             Submit Enquiry
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
__turbopack_context__.s([
    "default",
    ()=>EnquiryPopup
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/Component/GlobalPopup/EnquiryPopup.module.css [client] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function EnquiryPopup() {
    _s();
    const [show, setShow] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [successMsg, setSuccessMsg] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({});
    // ✅ Removed productInterest — not in this form
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useState"])({
        fullName: "",
        email: "",
        phoneNumber: "",
        message: ""
    });
    // ─── Show popup after 5s (only if not submitted before) ───────────────────
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "EnquiryPopup.useEffect": ()=>{
            setMounted(true);
            const submitted = localStorage.getItem("enquirySubmitted");
            if (!submitted) {
                const timer = setTimeout({
                    "EnquiryPopup.useEffect.timer": ()=>setShow(true)
                }["EnquiryPopup.useEffect.timer"], 5000);
                return ({
                    "EnquiryPopup.useEffect": ()=>clearTimeout(timer)
                })["EnquiryPopup.useEffect"];
            }
        }
    }["EnquiryPopup.useEffect"], []);
    // ─── Handle Change ─────────────────────────────────────────────────────────
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
    // ─── Validation ────────────────────────────────────────────────────────────
    const validate = ()=>{
        const e = {};
        if (!form.fullName.trim()) e.fullName = "Name is required";
        if (!form.email.trim()) e.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
        if (!form.phoneNumber.trim()) e.phoneNumber = "Phone is required";
        else if (!/^[6-9]\d{9}$/.test(form.phoneNumber)) e.phoneNumber = "Enter valid 10-digit number";
        if (!form.message.trim()) e.message = "Message is required";
        return e;
    };
    // ─── Handle Submit ──────────────────────────────────────────────────────────
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        const payload = {
            fullName: form.fullName.trim(),
            email: form.email.trim(),
            phoneNumber: form.phoneNumber.trim(),
            message: form.message.trim()
        };
        console.log("Enquiry Payload =>", payload);
        setLoading(true);
        setSuccessMsg("");
        try {
            const response = await postData("enquiry/add", payload);
            console.log("Enquiry Response =>", response);
            if (response?.success === true) {
                setSuccessMsg("Thank you! We'll get back to you soon.");
                setForm({
                    fullName: "",
                    email: "",
                    phoneNumber: "",
                    message: ""
                });
                setErrors({});
                // ✅ Save to localStorage so popup doesn't show again
                localStorage.setItem("enquirySubmitted", "true");
                // ✅ Auto close popup after 3 seconds
                setTimeout(()=>setShow(false), 3000);
            } else {
                setErrors({
                    api: response?.message || "Something went wrong."
                });
            }
        } catch (err) {
            console.error("Enquiry submit failed:", err?.message);
            setErrors({
                api: "Server error. Please try again later."
            });
        } finally{
            setLoading(false);
        }
    };
    // ─── Close handler ──────────────────────────────────────────────────────────
    const handleClose = ()=>setShow(false);
    // ─── SSR guard ─────────────────────────────────────────────────────────────
    if (!mounted || !show) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].overlay,
        onClick: handleClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].popup,
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].closeBtn,
                    onClick: handleClose,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaTimes"], {}, void 0, false, {
                        fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                        lineNumber: 423,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                    lineNumber: 422,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].tag,
                    children: "TECHNOMAC"
                }, void 0, false, {
                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                    lineNumber: 427,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                    children: "Quick Enquiry"
                }, void 0, false, {
                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                    lineNumber: 428,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    children: "Get free consultation for dental clinic setup and equipment solutions."
                }, void 0, false, {
                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                    lineNumber: 429,
                    columnNumber: 9
                }, this),
                successMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].successMsg,
                    children: successMsg
                }, void 0, false, {
                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                    lineNumber: 433,
                    columnNumber: 11
                }, this),
                !successMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    noValidate: true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-md-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputBox} ${errors.fullName ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputError : ""}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaUser"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                                    lineNumber: 446,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    name: "fullName",
                                                    value: form.fullName,
                                                    placeholder: "Your Name",
                                                    onChange: handleChange
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                                    lineNumber: 447,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                            lineNumber: 445,
                                            columnNumber: 17
                                        }, this),
                                        errors.fullName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].errorText,
                                            children: errors.fullName
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                            lineNumber: 456,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                    lineNumber: 444,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-md-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputBox} ${errors.email ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputError : ""}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaEnvelope"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                                    lineNumber: 463,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "email",
                                                    name: "email",
                                                    value: form.email,
                                                    placeholder: "Email",
                                                    onChange: handleChange
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                                    lineNumber: 464,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                            lineNumber: 462,
                                            columnNumber: 17
                                        }, this),
                                        errors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].errorText,
                                            children: errors.email
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                            lineNumber: 473,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                    lineNumber: 461,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-md-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputBox} ${errors.phoneNumber ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputError : ""}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaPhoneAlt"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                                    lineNumber: 480,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                    type: "text",
                                                    name: "phoneNumber",
                                                    value: form.phoneNumber,
                                                    placeholder: "Mobile Number",
                                                    onChange: handleChange,
                                                    maxLength: 10
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                                    lineNumber: 481,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                            lineNumber: 479,
                                            columnNumber: 17
                                        }, this),
                                        errors.phoneNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].errorText,
                                            children: errors.phoneNumber
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                            lineNumber: 491,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                    lineNumber: 478,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "col-md-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputBox} ${errors.message ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].inputError : ""}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$client$5d$__$28$ecmascript$29$__["FaCommentDots"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                                    lineNumber: 498,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                    name: "message",
                                                    value: form.message,
                                                    placeholder: "Your Query",
                                                    rows: "1",
                                                    onChange: handleChange
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                                    lineNumber: 499,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                            lineNumber: 497,
                                            columnNumber: 17
                                        }, this),
                                        errors.message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].errorText,
                                            children: errors.message
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                            lineNumber: 508,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                    lineNumber: 496,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                            lineNumber: 441,
                            columnNumber: 13
                        }, this),
                        errors.api && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].apiError,
                            children: errors.api
                        }, void 0, false, {
                            fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                            lineNumber: 516,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$client$5d$__$28$css__module$29$__["default"].submitBtn,
                            disabled: loading,
                            children: loading ? "Submitting..." : "Submit Enquiry"
                        }, void 0, false, {
                            fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                            lineNumber: 520,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                    lineNumber: 440,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
            lineNumber: 419,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
        lineNumber: 416,
        columnNumber: 5
    }, this);
}
_s(EnquiryPopup, "RszhTgLj6h+GP8Wwa6VbxxAj4OU=");
_c = EnquiryPopup;
var _c;
__turbopack_context__.k.register(_c, "EnquiryPopup");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/pages/_app.js [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>App
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/GlobalPopup/EnquiryPopup.js [client] (ecmascript)");
;
;
;
;
;
;
;
function App({ Component, pageProps }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(Component, {
                ...pageProps
            }, void 0, false, {
                fileName: "[project]/src/pages/_app.js",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/_app.js",
                lineNumber: 23,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
_c = App;
var _c;
__turbopack_context__.k.register(_c, "App");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/_app.js [client] (ecmascript)\" } [client] (ecmascript)", ((__turbopack_context__, module, exports) => {

const PAGE_PATH = "/_app";
(window.__NEXT_P = window.__NEXT_P || []).push([
    PAGE_PATH,
    ()=>{
        return __turbopack_context__.r("[project]/src/pages/_app.js [client] (ecmascript)");
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
"[hmr-entry]/hmr-entry.js { ENTRY => \"[project]/src/pages/_app\" }", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.r("[next]/entry/page-loader.ts { PAGE => \"[project]/src/pages/_app.js [client] (ecmascript)\" } [client] (ecmascript)");
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__f86ffcc4._.js.map