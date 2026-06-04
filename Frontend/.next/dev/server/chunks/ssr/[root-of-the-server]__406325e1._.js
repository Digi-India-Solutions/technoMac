module.exports = [
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/zlib [external] (zlib, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("zlib", () => require("zlib"));

module.exports = mod;
}),
"[externals]/react-dom [external] (react-dom, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("react-dom", () => require("react-dom"));

module.exports = mod;
}),
"[project]/src/Component/layout/Footer/Footer.module.css [ssr] (css module)", ((__turbopack_context__) => {

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
"[project]/Images/logo.png.mjs { IMAGE => \"[project]/Images/logo.png (static in ecmascript)\" } [ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
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
}),
"[project]/src/Component/layout/Footer/Footer.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Footer
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/Component/layout/Footer/Footer.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Images$2f$logo$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/Images/logo.png.mjs { IMAGE => "[project]/Images/logo.png (static in ecmascript)" } [ssr] (structured image object with data url, ecmascript)');
;
;
;
;
;
;
function Footer() {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footer,
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerTop,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "row",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "col-lg-3 col-md-6 mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerAbout,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            src: __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$logo$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Images$2f$logo$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
                                            alt: "DentalLoom Logo",
                                            width: 150,
                                            objectFit: "cover",
                                            height: 50
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 38,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: "Premium dental healthcare equipment supplier providing advanced clinic setup solutions and modern dental products for professionals."
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 40,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].socialIcons,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaFacebookF"], {}, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 50,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 49,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaInstagram"], {}, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 54,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 53,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaLinkedinIn"], {}, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 58,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                    lineNumber: 57,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                                    href: "#",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaYoutube"], {}, void 0, false, {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "col-lg-2 col-md-6 mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerLinks,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                            children: "Quick Links"
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 77,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "col-lg-3 col-md-6 mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerContact,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                            children: "Contact Us"
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 136,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaPhoneAlt"], {}, void 0, false, {
                                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                            lineNumber: 141,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaEnvelope"], {}, void 0, false, {
                                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                            lineNumber: 147,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
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
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaMapMarkerAlt"], {}, void 0, false, {
                                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                            lineNumber: 153,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
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
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "col-lg-4 col-md-6 mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].newsletterBox,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                            children: "Subscribe to Our Newsletter"
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 168,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: "Get latest dental equipment updates, offers and clinic setup innovations."
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                            lineNumber: 173,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].newsletterForm,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].inputGroup,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        type: "email",
                                                        placeholder: "Enter your email",
                                                        required: true
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/layout/Footer/Footer.js",
                                                        lineNumber: 185,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
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
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("small", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].footerBottom,
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
}),
"[project]/src/Component/layout/Header/Header.module.css [ssr] (css module)", ((__turbopack_context__) => {

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
"[project]/Images/logo-chat.png.mjs { IMAGE => \"[project]/Images/logo-chat.png (static in ecmascript)\" } [ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
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
}),
"[externals]/axios [external] (axios, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("axios");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/services/FetchNodeServices.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/axios [external] (axios, esm_import)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
const serverURL = 'http://localhost:8000/api';
const getToken = ()=>{
    const admin = JSON.parse(sessionStorage.getItem('Admin'));
    return admin?.token;
};
const postData = async (url, body)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].post(`${serverURL}/${url}`, body, {
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
        const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].get(`${serverURL}/${url}`);
        return response.data;
    } catch (e) {
        console.log(e);
        return null;
    }
};
const patchData = async (url, body)=>{
    try {
        const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].put(`${serverURL}/${url}`, body, {
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
        const response = await __TURBOPACK__imported__module__$5b$externals$5d2f$axios__$5b$external$5d$__$28$axios$2c$__esm_import$29$__["default"].delete(`${serverURL}/${url}`, {
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
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/Component/layout/Header/Header.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

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
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/Component/layout/Header/Header.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$logo$2d$chat$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Images$2f$logo$2d$chat$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/Images/logo-chat.png.mjs { IMAGE => "[project]/Images/logo-chat.png (static in ecmascript)" } [ssr] (structured image object with data url, ecmascript)');
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$FetchNodeServices$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/services/FetchNodeServices.js [ssr] (ecmascript)"); // ✅ ADDED
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$FetchNodeServices$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$FetchNodeServices$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
function Header() {
    const [menuOpen, setMenuOpen] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [sticky, setSticky] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]); // all categories from API
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null); // currently hovered category object
    const [subCategories, setSubCategories] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]); // subcategories of active category
    // ✅ Cache: { [categoryId]: [subCategory, ...] } — avoids re-fetching on re-hover
    const [subCategoryCache, setSubCategoryCache] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const [loadingCategories, setLoadingCategories] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [loadingSubCategories, setLoadingSubCategories] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // ─── 1. Fetch all categories once on mount ──────────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchAllCategory = async ()=>{
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$FetchNodeServices$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getData"])("category/");
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
        };
        fetchAllCategory();
    }, []); // ✅ empty deps — runs once only
    // ─── 2. Fetch subcategories when activeCategory changes ────────────────────
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!activeCategory?._id) return;
        const categoryId = activeCategory._id;
        // ✅ Use cache if already fetched
        if (subCategoryCache[categoryId]) {
            setSubCategories(subCategoryCache[categoryId]);
            return;
        }
        const fetchSubCategories = async ()=>{
            setLoadingSubCategories(true);
            try {
                const response = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$services$2f$FetchNodeServices$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["getData"])(`sub-category/by-category/${categoryId}`);
                console.log("subCategoryResponse=>", response);
                if (response?.success === true && Array.isArray(response.data)) {
                    setSubCategories(response.data);
                    // ✅ Save to cache
                    setSubCategoryCache((prev)=>({
                            ...prev,
                            [categoryId]: response.data
                        }));
                } else {
                    setSubCategories([]);
                }
            } catch (e) {
                console.error("SubCategory fetch failed:", e?.message);
                setSubCategories([]);
            } finally{
                setLoadingSubCategories(false);
            }
        };
        fetchSubCategories();
    }, [
        activeCategory?._id
    ]); // ✅ only re-runs when category ID changes
    // ─── 3. Sticky scroll ───────────────────────────────────────────────────────
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const handleScroll = ()=>setSticky(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return ()=>window.removeEventListener("scroll", handleScroll);
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].header} ${sticky ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sticky : ""}`,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].topHeader,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "container",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].topHeaderWrapper,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].topLeft,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                                href: "tel:+919311125574",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaPhoneAlt"], {}, void 0, false, {
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                                href: "mailto:info@Technomac.com",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaEnvelope"], {}, void 0, false, {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].topRight,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                                href: "#",
                                                target: "_blank",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaFacebookF"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Header/Header.js",
                                                    lineNumber: 460,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 460,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                                href: "#",
                                                target: "_blank",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaInstagram"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Header/Header.js",
                                                    lineNumber: 461,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 461,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                                href: "#",
                                                target: "_blank",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaLinkedinIn"], {}, void 0, false, {
                                                    fileName: "[project]/src/Component/layout/Header/Header.js",
                                                    lineNumber: 462,
                                                    columnNumber: 45
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 462,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                                href: "#",
                                                target: "_blank",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaYoutube"], {}, void 0, false, {
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
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mainNavbar,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "container",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].navbar,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].logo,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            href: "/",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                src: __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$logo$2d$chat$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Images$2f$logo$2d$chat$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("nav", {
                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].navMenu} ${menuOpen ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].active : ""}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/",
                                                children: "Home"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 483,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].megaMenuWrapper,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        href: "/products",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].menuTitle,
                                                            children: [
                                                                "Products ",
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaChevronDown"], {
                                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].arrowIcon
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
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].megaMenu,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].categoryList,
                                                                children: loadingCategories ? Array.from({
                                                                    length: 5
                                                                }).map((_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].categoryItemSkeleton
                                                                    }, i, false, {
                                                                        fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                        lineNumber: 499,
                                                                        columnNumber: 27
                                                                    }, this)) : categories.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].categoryItem} ${activeCategory?._id === item._id ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].activeCategory : ""}`,
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
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].productList,
                                                                children: [
                                                                    activeCategory && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                        children: activeCategory.name || activeCategory.title
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                        lineNumber: 522,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].productGrid,
                                                                        children: loadingSubCategories ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].loadingText,
                                                                            children: "Loading..."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                            lineNumber: 527,
                                                                            columnNumber: 27
                                                                        }, this) : subCategories.length > 0 ? subCategories.map((sub)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                href: `/products?category=${activeCategory?._id}&sub=${sub._id}`,
                                                                                children: sub.name || sub.title || sub.subCategoryName
                                                                            }, sub._id, false, {
                                                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                                                lineNumber: 530,
                                                                                columnNumber: 29
                                                                            }, this)) : !loadingSubCategories && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].noProducts,
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/certificates",
                                                children: "Certificates"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 549,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/catalogue",
                                                children: "Catalogue"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 550,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/clinic-setup",
                                                children: "Clinic Setup"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 551,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/updates",
                                                children: "New Updates"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 552,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/contact",
                                                children: "Contact Us"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 553,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].closeBtn,
                                                onClick: ()=>setMenuOpen(false),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaTimes"], {}, void 0, false, {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].rightSection,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                href: "/warranty-registration",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].warrantyBtn,
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
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].quoteBtn,
                                                children: "Pay Now"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/layout/Header/Header.js",
                                                lineNumber: 565,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mobileBtn,
                                                onClick: ()=>setMenuOpen(true),
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaBars"], {}, void 0, false, {
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
            menuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].overlay,
                onClick: ()=>setMenuOpen(false)
            }, void 0, false, {
                fileName: "[project]/src/Component/layout/Header/Header.js",
                lineNumber: 578,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/Component/layout/Layout.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Layout
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/layout/Footer/Footer.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/layout/Header/Header.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function Layout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Header$2f$Header$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/Component/layout/Layout.js",
                lineNumber: 7,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                className: "mainContent",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/Component/layout/Layout.js",
                lineNumber: 9,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Footer$2f$Footer$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                fileName: "[project]/src/Component/layout/Layout.js",
                lineNumber: 13,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/Images/about-image.png (static in ecmascript)", ((__turbopack_context__) => {

__turbopack_context__.v("/_next/static/media/about-image.e771fdc7.png");}),
"[project]/Images/about-image.png.mjs { IMAGE => \"[project]/Images/about-image.png (static in ecmascript)\" } [ssr] (structured image object with data url, ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$about$2d$image$2e$png__$28$static__in__ecmascript$29$__ = __turbopack_context__.i("[project]/Images/about-image.png (static in ecmascript)");
;
const __TURBOPACK__default__export__ = {
    src: __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$about$2d$image$2e$png__$28$static__in__ecmascript$29$__["default"],
    width: 1536,
    height: 1024,
    blurWidth: 8,
    blurHeight: 5,
    blurDataURL: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAFCAIAAAD38zoCAAAAiElEQVR42gF9AIL/AMCuocW1q8S5s6qin726usXHy8XN1b7J1QCtqqy2s7S6urx8dXC3t7rc4uje6fLQ3ukAtqukwLy6ra6xenRyuLm/ys/VssHJfZeVAJ6WkKShoKmlpHV4fpOcp7C0u6myuo2boACWg3WVhXmdjoSOiIabnKGtsrvFztq3ws+IglF/9TVmLwAAAABJRU5ErkJggg=="
};
}),
"[project]/Data/products.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// import productImage from "../../../../Images/about-image.png";
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$about$2d$image$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Images$2f$about$2d$image$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__ = __turbopack_context__.i('[project]/Images/about-image.png.mjs { IMAGE => "[project]/Images/about-image.png (static in ecmascript)" } [ssr] (structured image object with data url, ecmascript)');
;
const products = [
    {
        id: 1,
        slug: "dental-chair-x1",
        name: "Dental Chair X1",
        category: "Dental Chairs",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$about$2d$image$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Images$2f$about$2d$image$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
        description: "Premium fully motorised dental chair for advanced clinics."
    },
    {
        id: 2,
        slug: "portable-xray",
        name: "Portable X-Ray",
        category: "Dental X-Ray",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$about$2d$image$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Images$2f$about$2d$image$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
        description: "Advanced portable dental X-ray machine."
    },
    {
        id: 3,
        slug: "dental-autoclave",
        name: "Dental Autoclave",
        category: "Sterilization",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$about$2d$image$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Images$2f$about$2d$image$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
        description: "High performance sterilization autoclave."
    },
    {
        id: 4,
        slug: "intraoral-camera",
        name: "Intraoral Camera",
        category: "Imaging",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$about$2d$image$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Images$2f$about$2d$image$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
        description: "Wireless intraoral camera system."
    },
    {
        id: 5,
        slug: "air-compressor",
        name: "Air Compressor",
        category: "Compressor",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$about$2d$image$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Images$2f$about$2d$image$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
        description: "Silent dental air compressor machine."
    },
    {
        id: 6,
        slug: "uv-cabinet",
        name: "UV-C Cabinet",
        category: "Storage",
        image: __TURBOPACK__imported__module__$5b$project$5d2f$Images$2f$about$2d$image$2e$png$2e$mjs__$7b$__IMAGE__$3d3e$__$225b$project$5d2f$Images$2f$about$2d$image$2e$png__$28$static__in__ecmascript$2922$__$7d$__$5b$ssr$5d$__$28$structured__image__object__with__data__url$2c$__ecmascript$29$__["default"],
        description: "UV-C sterilization storage cabinet."
    }
];
const __TURBOPACK__default__export__ = products;
}),
"[externals]/swiper/react [external] (swiper/react, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("swiper/react");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/swiper/modules [external] (swiper/modules, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("swiper/modules");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[project]/src/Component/products/ProductDetails/ProductDetails.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "ProductDetails-module__rZav8a__description": "ProductDetails-module__rZav8a__ProductDetails-module__rZav8a__description",
  "activeThumb": "ProductDetails-module__rZav8a__activeThumb",
  "buttonGroup": "ProductDetails-module__rZav8a__buttonGroup",
  "category": "ProductDetails-module__rZav8a__category",
  "content": "ProductDetails-module__rZav8a__content",
  "description": "ProductDetails-module__rZav8a__description",
  "detailsPage": "ProductDetails-module__rZav8a__detailsPage",
  "fadeZoom": "ProductDetails-module__rZav8a__fadeZoom",
  "gallery": "ProductDetails-module__rZav8a__gallery",
  "galleryWrapper": "ProductDetails-module__rZav8a__galleryWrapper",
  "imageWrapper": "ProductDetails-module__rZav8a__imageWrapper",
  "mainImage": "ProductDetails-module__rZav8a__mainImage",
  "mainProductImage": "ProductDetails-module__rZav8a__mainProductImage",
  "primaryBtn": "ProductDetails-module__rZav8a__primaryBtn",
  "relatedCard": "ProductDetails-module__rZav8a__relatedCard",
  "relatedContent": "ProductDetails-module__rZav8a__relatedContent",
  "relatedImage": "ProductDetails-module__rZav8a__relatedImage",
  "relatedProductImage": "ProductDetails-module__rZav8a__relatedProductImage",
  "relatedSection": "ProductDetails-module__rZav8a__relatedSection",
  "secondaryBtn": "ProductDetails-module__rZav8a__secondaryBtn",
  "sectionBox": "ProductDetails-module__rZav8a__sectionBox",
  "specGrid": "ProductDetails-module__rZav8a__specGrid",
  "swiper": "ProductDetails-module__rZav8a__swiper",
  "swiper-slide": "ProductDetails-module__rZav8a__swiper-slide",
  "thumbBox": "ProductDetails-module__rZav8a__thumbBox",
  "thumbImage": "ProductDetails-module__rZav8a__thumbImage",
});
}),
"[project]/src/Component/common/Breadcrumb/Breadcrumb.module.css [ssr] (css module)", ((__turbopack_context__) => {

__turbopack_context__.v({
  "breadcrumb": "Breadcrumb-module__f5-L5G__breadcrumb",
});
}),
"[project]/src/Component/common/Breadcrumb/Breadcrumb.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>Breadcrumb
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$common$2f$Breadcrumb$2f$Breadcrumb$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/Component/common/Breadcrumb/Breadcrumb.module.css [ssr] (css module)");
;
;
;
function Breadcrumb({ pageName }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$common$2f$Breadcrumb$2f$Breadcrumb$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].breadcrumb,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                href: "/",
                children: "Home"
            }, void 0, false, {
                fileName: "[project]/src/Component/common/Breadcrumb/Breadcrumb.js",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                children: "/"
            }, void 0, false, {
                fileName: "[project]/src/Component/common/Breadcrumb/Breadcrumb.js",
                lineNumber: 17,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
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
}),
"[project]/src/Component/products/ProductDetails/ProductDetails.js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>ProductDetails
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/link.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react-icons/fa/index.mjs [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$swiper$2f$react__$5b$external$5d$__$28$swiper$2f$react$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/swiper/react [external] (swiper/react, esm_import)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$swiper$2f$modules__$5b$external$5d$__$28$swiper$2f$modules$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/swiper/modules [external] (swiper/modules, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Data$2f$products$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Data/products.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__ = __turbopack_context__.i("[project]/src/Component/products/ProductDetails/ProductDetails.module.css [ssr] (css module)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/image.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$common$2f$Breadcrumb$2f$Breadcrumb$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/common/Breadcrumb/Breadcrumb.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$swiper$2f$react__$5b$external$5d$__$28$swiper$2f$react$2c$__esm_import$29$__,
    __TURBOPACK__imported__module__$5b$externals$5d2f$swiper$2f$modules__$5b$external$5d$__$28$swiper$2f$modules$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$swiper$2f$react__$5b$external$5d$__$28$swiper$2f$react$2c$__esm_import$29$__, __TURBOPACK__imported__module__$5b$externals$5d2f$swiper$2f$modules__$5b$external$5d$__$28$swiper$2f$modules$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
;
function ProductDetails({ product }) {
    const relatedProducts = __TURBOPACK__imported__module__$5b$project$5d2f$Data$2f$products$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].filter((item)=>item.slug !== product.slug);
    const galleryImages = product.images || [
        product.image,
        product.image,
        product.image,
        product.image,
        product.image,
        product.image
    ];
    const [activeImage, setActiveImage] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(galleryImages[0]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("section", {
        className: "allSections",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "container",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$common$2f$Breadcrumb$2f$Breadcrumb$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    pageName: product.name
                }, void 0, false, {
                    fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                    lineNumber: 32,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "row",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "col-lg-5",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].imageWrapper,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mainImage,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                            src: activeImage,
                                            alt: product.name,
                                            width: 600,
                                            height: 500,
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].mainProductImage
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                            lineNumber: 38,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                        lineNumber: 37,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].galleryWrapper,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].gallery,
                                            children: galleryImages.map((img, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    type: "button",
                                                    className: `${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].thumbBox}
                        ${activeImage === img ? __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].activeThumb : ""}`,
                                                    onClick: ()=>setActiveImage(img),
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                        src: img,
                                                        alt: `thumb-${index}`,
                                                        width: 100,
                                                        height: 100,
                                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].thumbImage
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                        lineNumber: 61,
                                                        columnNumber: 23
                                                    }, this)
                                                }, index, false, {
                                                    fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                    lineNumber: 49,
                                                    columnNumber: 21
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                            lineNumber: 47,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                        lineNumber: 46,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                lineNumber: 36,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                            lineNumber: 35,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "col-lg-7",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].content,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].category,
                                        children: product.category
                                    }, void 0, false, {
                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                        lineNumber: 76,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                        children: product.name
                                    }, void 0, false, {
                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                        lineNumber: 79,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].description,
                                        children: product.description
                                    }, void 0, false, {
                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                        lineNumber: 82,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sectionBox,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                children: "Salient Features"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                lineNumber: 86,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaCheckCircle"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                                lineNumber: 91,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Fully Automatic System"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                        lineNumber: 90,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaCheckCircle"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                                lineNumber: 95,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Advanced Sterilization"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                        lineNumber: 94,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaCheckCircle"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                                lineNumber: 99,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Compact Modern Design"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                        lineNumber: 98,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaCheckCircle"], {}, void 0, false, {
                                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                                lineNumber: 103,
                                                                columnNumber: 21
                                                            }, this),
                                                            "Dentist Recommended"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                        lineNumber: 102,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                lineNumber: 89,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                        lineNumber: 85,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].sectionBox,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                children: "Technical Specifications"
                                            }, void 0, false, {
                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                lineNumber: 109,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].specGrid,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                children: "Capacity"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                                lineNumber: 114,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                children: "12-15 Liters"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                                lineNumber: 115,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                        lineNumber: 113,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                children: "Voltage"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                                lineNumber: 118,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                children: "230V"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                                lineNumber: 119,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                        lineNumber: 117,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                children: "Power"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                                lineNumber: 122,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                children: "1000W"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                                lineNumber: 123,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                        lineNumber: 121,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                children: "Material"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                                lineNumber: 126,
                                                                columnNumber: 21
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                children: "Stainless Steel"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                                lineNumber: 127,
                                                                columnNumber: 21
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                        lineNumber: 125,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                lineNumber: 112,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                        lineNumber: 108,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].buttonGroup,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].primaryBtn,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaWhatsapp"], {}, void 0, false, {
                                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                        lineNumber: 133,
                                                        columnNumber: 19
                                                    }, this),
                                                    "WhatsApp Inquiry"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                lineNumber: 132,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].secondaryBtn,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2d$icons$2f$fa$2f$index$2e$mjs__$5b$ssr$5d$__$28$ecmascript$29$__["FaFilePdf"], {}, void 0, false, {
                                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                        lineNumber: 137,
                                                        columnNumber: 19
                                                    }, this),
                                                    "Download Brochure"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                lineNumber: 136,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                        lineNumber: 131,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                lineNumber: 75,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                            lineNumber: 74,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                    lineNumber: 34,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].relatedSection,
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].relatedHeading,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    children: "Related Products"
                                }, void 0, false, {
                                    fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                    lineNumber: 146,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    children: "Explore More Equipment"
                                }, void 0, false, {
                                    fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                    lineNumber: 149,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                            lineNumber: 145,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$swiper$2f$react__$5b$external$5d$__$28$swiper$2f$react$2c$__esm_import$29$__["Swiper"], {
                            slidesPerView: 3,
                            spaceBetween: 24,
                            navigation: true,
                            modules: [
                                __TURBOPACK__imported__module__$5b$externals$5d2f$swiper$2f$modules__$5b$external$5d$__$28$swiper$2f$modules$2c$__esm_import$29$__["Navigation"]
                            ],
                            breakpoints: {
                                0: {
                                    slidesPerView: 1
                                },
                                768: {
                                    slidesPerView: 2
                                },
                                1200: {
                                    slidesPerView: 3
                                }
                            },
                            children: relatedProducts.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$swiper$2f$react__$5b$external$5d$__$28$swiper$2f$react$2c$__esm_import$29$__["SwiperSlide"], {
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$module$2e$css__$5b$ssr$5d$__$28$css__module$29$__["default"].relatedCard,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "globalProductCard",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$image$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    src: item.image,
                                                    alt: item.name,
                                                    width: 250,
                                                    height: 200
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                    lineNumber: 174,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    children: item.category
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                    lineNumber: 180,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    children: item.name
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                    lineNumber: 183,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    children: item.description
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                    lineNumber: 186,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$link$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                    href: `/product/${item.slug}`,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        children: "View Details"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                        lineNumber: 190,
                                                        columnNumber: 23
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                                    lineNumber: 189,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                            lineNumber: 173,
                                            columnNumber: 19
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                        lineNumber: 172,
                                        columnNumber: 17
                                    }, this)
                                }, item.id, false, {
                                    fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                                    lineNumber: 171,
                                    columnNumber: 15
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                            lineNumber: 153,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
                    lineNumber: 144,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
            lineNumber: 31,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/Component/products/ProductDetails/ProductDetails.js",
        lineNumber: 30,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/src/pages/product/[slug].js [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>ProductDetailPage
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/layout/Layout.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Data$2f$products$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Data/products.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Component/products/ProductDetails/ProductDetails.js [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
function ProductDetailPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { slug } = router.query;
    const product = __TURBOPACK__imported__module__$5b$project$5d2f$Data$2f$products$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"].find((item)=>item.slug === slug);
    if (!product) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$layout$2f$Layout$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Component$2f$products$2f$ProductDetails$2f$ProductDetails$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
            product: product
        }, void 0, false, {
            fileName: "[project]/src/pages/product/[slug].js",
            lineNumber: 20,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/pages/product/[slug].js",
        lineNumber: 18,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__406325e1._.js.map