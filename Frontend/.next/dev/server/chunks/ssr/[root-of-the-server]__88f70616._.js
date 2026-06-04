module.exports = [
"[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react/jsx-dev-runtime", () => require("react/jsx-dev-runtime"));

module.exports = mod;
}),
"[externals]/react [external] (react, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react", () => require("react"));

module.exports = mod;
}),
"[project]/src/Component/GlobalPopup/EnquiryPopup.module.css [ssr] (css module)", ((__turbopack_context__) => {

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
"[project]/src/Component/GlobalPopup/EnquiryPopup.js [ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/Component/GlobalPopup/EnquiryPopup.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [ssr] (ecmascript)");
"use client";
;
;
;
;
function EnquiryPopup() {
    const [show, setShow] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [successMsg, setSuccessMsg] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    // ✅ Removed productInterest — not in this form
    const [form, setForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        fullName: "",
        email: "",
        phoneNumber: "",
        message: ""
    });
    // ─── Show popup after 5s (only if not submitted before) ───────────────────
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
        const submitted = localStorage.getItem("enquirySubmitted");
        if (!submitted) {
            const timer = setTimeout(()=>setShow(true), 5000);
            return ()=>clearTimeout(timer);
        }
    }, []);
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].overlay,
        onClick: handleClose,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].popup,
            onClick: (e)=>e.stopPropagation(),
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].closeBtn,
                    onClick: handleClose,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaTimes"], {}, void 0, false, {
                        fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                        lineNumber: 423,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                    lineNumber: 422,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].tag,
                    children: "TECHNOMAC"
                }, void 0, false, {
                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                    lineNumber: 427,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    children: "Quick Enquiry"
                }, void 0, false, {
                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                    lineNumber: 428,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    children: "Get free consultation for dental clinic setup and equipment solutions."
                }, void 0, false, {
                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                    lineNumber: 429,
                    columnNumber: 9
                }, this),
                successMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].successMsg,
                    children: successMsg
                }, void 0, false, {
                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                    lineNumber: 433,
                    columnNumber: 11
                }, this),
                !successMsg && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                    onSubmit: handleSubmit,
                    noValidate: true,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "row",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "col-md-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputBox} ${errors.fullName ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputError : ""}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaUser"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                                    lineNumber: 446,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                        errors.fullName && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].errorText,
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "col-md-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputBox} ${errors.email ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputError : ""}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaEnvelope"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                                    lineNumber: 463,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                        errors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].errorText,
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "col-md-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputBox} ${errors.phoneNumber ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputError : ""}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaPhoneAlt"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                                    lineNumber: 480,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
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
                                        errors.phoneNumber && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].errorText,
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
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "col-md-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputBox} ${errors.message ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputError : ""}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaCommentDots"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                                                    lineNumber: 498,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
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
                                        errors.message && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].errorText,
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
                        errors.api && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].apiError,
                            children: errors.api
                        }, void 0, false, {
                            fileName: "[project]/src/Component/GlobalPopup/EnquiryPopup.js",
                            lineNumber: 516,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].submitBtn,
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
}),
"[project]/src/pages/_app.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>App
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/GlobalPopup/EnquiryPopup.js [ssr] (ecmascript)");
;
;
;
;
;
;
;
function App({ Component, pageProps }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(Component, {
                ...pageProps
            }, void 0, false, {
                fileName: "[project]/src/pages/_app.js",
                lineNumber: 19,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$GlobalPopup$2f$EnquiryPopup$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/pages/_app.js",
                lineNumber: 23,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__88f70616._.js.map