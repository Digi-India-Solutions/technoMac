// import { useEffect, useState } from "react";
// import styles from "./CataloguePage.module.css";
// import Image from "next/image";
// import { FaDownload, FaBookOpen, FaTimes, FaUser, FaEnvelope, FaPhoneAlt, FaBuilding, } from "react-icons/fa";
// import catalogue1 from "../../../../Images/certificate.jpg";
// import catalogue2 from "../../../../Images/certificate.jpg";
// import catalogue3 from "../../../../Images/certificate.jpg";
// import catalogue4 from "../../../../Images/certificate.jpg";
// import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
// import { getData } from "../../../services/FetchNodeServices";

// const catalogues = [

//     {
//         image: catalogue1,
//         title: "Dental Chair Catalogue",
//         desc:
//             "Premium dental chair collection brochure.",
//     },

//     {
//         image: catalogue2,
//         title: "Imaging Equipment Catalogue",
//         desc:
//             "Advanced dental imaging solutions brochure.",
//     },

//     {
//         image: catalogue3,
//         title: "Clinic Setup Catalogue",
//         desc:
//             "Modern dental clinic setup solutions.",
//     },

//     {
//         image: catalogue4,
//         title: "Complete Product Catalogue",
//         desc:
//             "Full TECHNOMAC product brochure.",
//     },

// ];

// export default function CataloguePage() {
//     const [openModal, setOpenModal] = useState(false);

//     const [catalogue, setCatalogue] = useState([])
//     const [loading, setLoading] = useState(false)

//     const fetchAllCatalogue = async () => {
//         try {
//             // ✅ Remove leading slash — getData likely prepends serverURL + "/"
//             const response = await getData("Catalogue/all");
//             console.log("Catalogue Response=>", response)
//             if (response.success === true) {

//                 setCatalogue(response.data);
//             }
//             // If empty or null → keep static fallback already in state
//         } catch (e) {
//             console.error("Catalogue fetch failed, using static fallback:", e?.message);
//             // ✅ Static Catalogue already set as default — nothing extra needed
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ✅ useEffect instead of useState
//     useEffect(() => {
//         fetchAllCatalogue();
//     }, []);
//     // console.log("SSSS==>response", category)

//     return (

//         <section className={styles.catalogueSection}>

//             {/* GLOW */}

//             <div className={styles.glow}></div>

//             <div className="container">


//                 <Breadcrumb pageName="Product Catalogues" />

//                 {/* HEADING */}

//                 <div className={styles.heading}>

//                     <span>
//                         TECHNOMAC BROCHURES
//                     </span>

//                     <h1>
//                         Product Catalogues
//                     </h1>

//                     <p>
//                         Download our latest dental
//                         equipment brochures, clinic
//                         setup catalogues and premium
//                         healthcare product details.
//                     </p>

//                 </div>

//                 {/* GRID */}

//                 <div className="row">

//                     {catalogue.map((item, index) => (

//                         <div
//                             className="col-lg-3 col-md-6 col-6 mb-4"
//                             key={index}
//                         >

//                             <div className={styles.catalogueCard}>

//                                 {/* IMAGE */}

//                                 <div className={styles.imageWrapper}>

//                                     <Image
//                                         src={item.image}
//                                         alt={item.title}
//                                         width={1000}
//                                         height={1000}
//                                         className={styles.catalogueImage}
//                                     />

//                                 </div>

//                                 {/* CONTENT */}

//                                 <div className={styles.cardContent}>

//                                     <div>

//                                         <h3>
//                                             {item.title}
//                                         </h3>

//                                         <p>
//                                             {item.description}
//                                         </p>

//                                     </div>

//                                     <button
//                                         onClick={() =>
//                                             setOpenModal(true)
//                                         }
//                                     >

//                                         <FaDownload />

//                                         Download

//                                     </button>

//                                 </div>

//                             </div>

//                         </div>

//                     ))}

//                 </div>

//             </div>

//             {/* MODAL */}

//             {openModal && (

//                 <div className={styles.modalOverlay}>

//                     <div className={styles.modalBox}>

//                         {/* CLOSE */}

//                         <button
//                             className={styles.closeBtn}
//                             onClick={() =>
//                                 setOpenModal(false)
//                             }
//                         >

//                             <FaTimes />

//                         </button>

//                         {/* TOP */}

//                         <div className={styles.modalHeading}>

//                             <span>
//                                 TECHNOMAC
//                             </span>

//                             <h2>
//                                 Download Brochure
//                             </h2>

//                             <p>
//                                 Fill your details to
//                                 download product brochure.
//                             </p>

//                         </div>

//                         {/* FORM */}

//                         <form>

//                             <div className="row">

//                                 {/* NAME */}

//                                 <div className="col-md-6">

//                                     <div className={styles.inputGroup}>

//                                         <FaUser />

//                                         <input
//                                             type="text"
//                                             placeholder="Customer Name"
//                                         />

//                                     </div>

//                                 </div>

//                                 {/* EMAIL */}

//                                 <div className="col-md-6">

//                                     <div className={styles.inputGroup}>

//                                         <FaEnvelope />

//                                         <input
//                                             type="email"
//                                             placeholder="Email Address"
//                                         />

//                                     </div>

//                                 </div>

//                                 {/* PHONE */}

//                                 <div className="col-md-6">

//                                     <div className={styles.inputGroup}>

//                                         <FaPhoneAlt />

//                                         <input
//                                             type="text"
//                                             placeholder="Phone Number"
//                                         />

//                                     </div>

//                                 </div>

//                                 {/* COMPANY */}

//                                 <div className="col-md-6">

//                                     <div className={styles.inputGroup}>

//                                         <FaBuilding />

//                                         <input
//                                             type="text"
//                                             placeholder="Clinic / Company"
//                                         />

//                                     </div>

//                                 </div>

//                             </div>

//                             {/* BUTTON */}

//                             <button
//                                 type="submit"
//                                 className={styles.submitBtn}
//                             >

//                                 Download Catalogue

//                             </button>

//                         </form>

//                     </div>

//                 </div>

//             )}

//         </section>
//     );
// }

"use client";
import { useEffect, useState, useCallback } from "react";
import styles from "./CataloguePage.module.css";
import Image from "next/image";
import {
  FaDownload, FaBookOpen, FaTimes, FaCheckCircle,
  FaUser, FaEnvelope, FaPhoneAlt, FaBuilding,
  FaFilePdf, FaExternalLinkAlt, FaSpinner,
} from "react-icons/fa";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import { getData, postData } from "../../../services/FetchNodeServices";
import catalogue1 from "../../../../Images/certificate.jpg";
import catalogue2 from "../../../../Images/certificate.jpg";
import catalogue3 from "../../../../Images/certificate.jpg";
import catalogue4 from "../../../../Images/certificate.jpg";

const STATIC_CATALOGUES = [
  { _id: "1", title: "Dental Chair Catalogue", description: "Premium dental chair collection brochure.", image: catalogue1, pdfFile: null },
  { _id: "2", title: "Imaging Equipment Catalogue", description: "Advanced dental imaging solutions brochure.", image: catalogue2, pdfFile: null },
  { _id: "3", title: "Clinic Setup Catalogue", description: "Modern dental clinic setup solutions.", image: catalogue3, pdfFile: null },
  { _id: "4", title: "Complete Product Catalogue", description: "Full TECHNOMAC product brochure.", image: catalogue4, pdfFile: null },
];

const EMPTY_FORM = { customerName: "", email: "", phoneNumber: "", clinic: "" };

// ─── Cloudinary PDF Download Helper ─────────────────────────────────────────
// Cloudinary raw URLs don't download directly — we fetch as blob then trigger download
const downloadPdfFromCloudinary = async (pdfUrl, filename = "catalogue.pdf") => {
  try {
    // ✅ Add fl_attachment to Cloudinary URL to force download
    // Cloudinary raw upload URL pattern: .../raw/upload/v.../folder/filename
    // Add fl_attachment flag after /upload/
    const downloadUrl = pdfUrl.includes("/upload/")
      ? pdfUrl.replace("/upload/", "/upload/fl_attachment/")
      : pdfUrl;

    // ✅ Fetch as blob to trigger real browser download
    const response = await fetch(downloadUrl);
    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    const blobUrl = URL.createObjectURL(blob);

    // ✅ Create hidden anchor and click it
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = `${filename}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // ✅ Cleanup blob URL
    setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
    return true;
  } catch (err) {
    console.error("PDF download failed:", err?.message);
    // ✅ Fallback — open in new tab if blob download fails
    window.open(pdfUrl, "_blank");
    return false;
  }
};

export default function CataloguePage() {
  const [catalogues, setCatalogues] = useState(STATIC_CATALOGUES);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState({});
  const [formLoading, setFormLoading] = useState(false);
  const [downloading, setDownloading] = useState(false); // ✅ download progress
  const [successMsg, setSuccessMsg] = useState("");

  // ─── Fetch Catalogues ──────────────────────────────────────────────────────
  useEffect(() => { fetchAllCatalogues(); }, []);

  const fetchAllCatalogues = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getData("catalogue/all");
      console.log("Catalogue Response =>", response);
      if (response?.success === true && Array.isArray(response.data) && response.data.length > 0) {
        setCatalogues(response.data);
      }
    } catch (e) {
      console.error("Catalogue fetch failed:", e?.message);
      setError("Failed to load catalogues. Showing default catalogues.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Modal Open/Close ──────────────────────────────────────────────────────
  const handleDownloadClick = (item) => {
    setSelectedItem(item);
    setOpenModal(true);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setSuccessMsg("");
  };

  const handleClose = useCallback(() => {
    setOpenModal(false);
    setSelectedItem(null);
    setSuccessMsg("");
    setDownloading(false);
  }, []);

  // Escape key
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleClose]);

  // ─── Form ──────────────────────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (!form.phoneNumber.trim()) e.phoneNumber = "Phone is required";
    else if (!/^[6-9]\d{9}$/.test(form.phoneNumber)) e.phoneNumber = "Enter valid 10-digit number";
    if (!form.clinic.trim()) e.clinic = "Clinic / Company is required";
    return e;
  };

  // ─── Submit + Download ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    const payload = {
      customerName: form.customerName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phoneNumber.trim(),
      companyName: form.clinic.trim(),
      catalogueId: selectedItem?._id || "",
      catalogueName: selectedItem?.title || "",
    };

    console.log("Catalogue Payload =>", payload);
    setFormLoading(true);

    try {
      // ✅ Save lead to backend
      const response = await postData("catalogueDownload/create", payload);
      console.log("response===>", response)
      if (response.success === true) {
        // ✅ Trigger actual PDF download
        if (selectedItem?.pdfFile) {
          setDownloading(true);
          setSuccessMsg("Preparing your download...");

          const filename = selectedItem.title?.replace(/\s+/g, "_") || "TECHNOMAC_Catalogue";
          await downloadPdfFromCloudinary(selectedItem.pdfFile, filename);

          setDownloading(false);
          setSuccessMsg("Download started successfully!");
        } else {
          setSuccessMsg("Thank you! Our team will share the catalogue shortly.");
        }
      }
    } catch (err) {
      console.warn("Lead save failed (continuing with download):", err?.message);
      // ✅ Don't block download if API fails
    } finally {
      setFormLoading(false);
    }



    // Auto close after 3s
    setTimeout(() => handleClose(), 3000);
  };

  // ─── Direct Preview (no form needed) ──────────────────────────────────────
  const handlePreview = (pdfUrl) => {
    window.open(pdfUrl, "_blank", "noreferrer");
  };

  return (
    <section className={styles.catalogueSection}>
      <div className={styles.glow}></div>
      <div className="container">

        <Breadcrumb pageName="Product Catalogues" />

        {/* HEADING */}
        <div className={styles.heading}>
          <span className="hero-tag">TECHNOMAC BROCHURES</span>
          <h1>Product Catalogues</h1>
          <p>Download our latest dental equipment brochures, clinic setup catalogues and premium healthcare product details.</p>
        </div>

        {/* SKELETON */}
        {loading && (
          <div className="row">
            {Array.from({ length: 4 }).map((_, i) => (
              <div className="col-lg-3 col-md-6 col-6 mb-4" key={i}>
                <div className={styles.skeletonCard}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonLine} />
                  <div className={styles.skeletonLineShort} />
                  <div className={styles.skeletonBtn} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}
        {!loading && error && (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button onClick={fetchAllCatalogues} className={styles.retryBtn}>Retry</button>
          </div>
        )}

        {/* EMPTY */}
        {!loading && !error && catalogues.length === 0 && (
          <div className={styles.emptyState}>
            <FaBookOpen />
            <p>No catalogues available at the moment.</p>
          </div>
        )}

        {/* GRID */}
        {!loading && catalogues.length > 0 && (
          <div className="row">
            {catalogues.map((item, index) => (
              <div className="col-lg-3 col-md-6 col-6 mb-4" key={item._id || index}>
                <div className={styles.catalogueCard}>

                  {/* IMAGE */}
                  <div className={styles.imageWrapper}>
                    <Image
                      src={item.image || item.imageUrl}
                      alt={item.title || "Catalogue"}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className={styles.catalogueImage}
                    />
                    {item.pdfFile && (
                      <div className={styles.pdfBadge}>
                        <FaFilePdf /> PDF
                      </div>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className={styles.cardContent}>
                    <div>
                      <h3>{item.title}</h3>
                      <p>{item.description || item.desc}</p>
                    </div>
                    <div className={styles.cardButtons}>
                      <button
                        className={styles.downloadBtn}
                        onClick={() => handleDownloadClick(item)}
                      >
                        <FaDownload /> Download
                      </button>
                      {/* {item.pdfFile && (
                        <button
                          className={styles.previewBtn}
                          onClick={() => handlePreview(item.pdfFile)}
                          title="Preview PDF"
                        >
                          <FaExternalLinkAlt />
                        </button>
                      )} */}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* MODAL */}
      {openModal && (
        <div className={styles.modalOverlay} onClick={handleClose}>
          <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>

            <button className={styles.closeBtn} onClick={handleClose}>
              <FaTimes />
            </button>

            {/* SUCCESS STATE */}
            {successMsg ? (
              <div className={styles.successState}>
                {downloading ? (
                  <FaSpinner className={styles.spinnerIcon} />
                ) : (
                  <FaCheckCircle className={styles.successIcon} />
                )}
                <h3>{downloading ? "Downloading..." : "Download Started!"}</h3>
                <p>{successMsg}</p>
                {!downloading && (
                  <p className={styles.successHint}>
                    Check your Downloads folder for{" "}
                    <strong>{selectedItem?.title}</strong>
                  </p>
                )}
                {/* ✅ Manual fallback link if browser blocked download */}
                {!downloading && selectedItem?.pdfFile && (
                  <a
                    href={selectedItem.pdfFile}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.fallbackLink}
                  >
                    Click here if download didn't start →
                  </a>
                )}
              </div>
            ) : (
              <>
                {/* MODAL HEADER */}
                <div className={styles.modalHeading} style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                  <span>TECHNOMAC</span>
                  <h3 style={{ fontWeight: 'bold' }}>Download Catalogue</h3>
                  {selectedItem && (
                    <div className={styles.selectedBadge}>
                      <FaFilePdf /> {selectedItem.title}
                    </div>
                  )}
                  <p>Fill your details to download the product catalogue.</p>
                </div>

                {/* FORM */}
                <form onSubmit={handleSubmit} noValidate>
                  <div className="row">

                    {/* NAME */}
                    <div className="col-md-6">
                      <div className={`${styles.inputGroup} ${formErrors.customerName ? styles.inputError : ""}`}>
                        <FaUser />
                        <input
                          type="text"
                          name="customerName"
                          value={form.customerName}
                          onChange={handleChange}
                          placeholder="Customer Name *"
                        />
                      </div>
                      {formErrors.customerName && <span className={styles.errorText}>{formErrors.customerName}</span>}
                    </div>

                    {/* EMAIL */}
                    <div className="col-md-6">
                      <div className={`${styles.inputGroup} ${formErrors.email ? styles.inputError : ""}`}>
                        <FaEnvelope />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Email Address *"
                        />
                      </div>
                      {formErrors.email && <span className={styles.errorText}>{formErrors.email}</span>}
                    </div>

                    {/* PHONE */}
                    <div className="col-md-6">
                      <div className={`${styles.inputGroup} ${formErrors.phoneNumber ? styles.inputError : ""}`}>
                        <FaPhoneAlt />
                        <input
                          type="text"
                          name="phoneNumber"
                          value={form.phoneNumber}
                          onChange={handleChange}
                          placeholder="Phone Number *"
                          maxLength={10}
                        />
                      </div>
                      {formErrors.phoneNumber && <span className={styles.errorText}>{formErrors.phoneNumber}</span>}
                    </div>

                    {/* CLINIC */}
                    <div className="col-md-6">
                      <div className={`${styles.inputGroup} ${formErrors.clinic ? styles.inputError : ""}`}>
                        <FaBuilding />
                        <input
                          type="text"
                          name="clinic"
                          value={form.clinic}
                          onChange={handleChange}
                          placeholder="Clinic / Company *"
                        />
                      </div>
                      {formErrors.clinic && <span className={styles.errorText}>{formErrors.clinic}</span>}
                    </div>

                  </div>

                  {formErrors.api && <p className={styles.apiError}>{formErrors.api}</p>}

                  <button
                    type="submit"
                    className={styles.submitBtn}
                    disabled={formLoading}
                  >
                    {formLoading
                      ? <><FaSpinner className={styles.btnSpinner} /> Processing...</>
                      : <><FaDownload /> Download Catalogue</>
                    }
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      )}

    </section>
  );
}