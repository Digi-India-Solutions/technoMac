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


import { useState } from "react";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import styles from "./WarrantyForm.module.css";
import {
  FaUser, FaEnvelope, FaPhoneAlt, FaClinicMedical,
  FaMapMarkerAlt, FaCalendarAlt, FaHashtag, FaBuilding,
  FaUpload, FaShieldAlt, FaCheckCircle,
} from "react-icons/fa";
import { postData } from "../../../services/FetchNodeServices"; // ✅ ADDED

const PRODUCT_MODELS = [
  "MR-01/70 Wall Model",
  "MR-01/60 Wall Model",
  "MR-01 Floor Model",
  "Cliq-X Portable X-Ray",
  "Garuda Dental Chair",
  "Garuda Plus Dental Chair",
  "UV Cabinet",
  "Auto Clave",
  "RVG Sensor",
];

export default function WarrantyForm() {

  const [form, setForm] = useState({
    email:          "",
    customerName:   "",
    clinicName:     "",
    customerContact:"",
    clinicAddress:  "",
    purchaseDate:   "",
    productModel:   "",
    serialNumber:   "",
    dealerName:     "",
    dealerCompany:  "",
    dealerContact:  "",
    dealerAddress:  "",
  });

  const [image, setImage]       = useState(null);   // ✅ file handled separately
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors]     = useState({});
  const [loading, setLoading]   = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // ─── Handle Text/Select/Date Change ─────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // ─── Handle File Upload ──────────────────────────────────────────────────────
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // ✅ Validate file type and size (max 5MB)
    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({ ...prev, image: "Only image files are allowed" }));
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, image: "Image must be under 5MB" }));
      return;
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  // ─── Validation ──────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    const phoneRegex = /^[6-9]\d{9}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!form.email.trim())             e.email           = "Email is required";
    else if (!emailRegex.test(form.email)) e.email        = "Enter a valid email";

    if (!form.customerName.trim())      e.customerName    = "Customer name is required";
    if (!form.clinicName.trim())        e.clinicName      = "Clinic name is required";

    if (!form.customerContact.trim())   e.customerContact = "Contact number is required";
    else if (!phoneRegex.test(form.customerContact)) e.customerContact = "Enter a valid 10-digit number";

    if (!form.clinicAddress.trim())     e.clinicAddress   = "Clinic address is required";
    if (!form.purchaseDate)             e.purchaseDate    = "Purchase date is required";
    if (!form.productModel)             e.productModel    = "Please select a product model";
    if (!form.serialNumber.trim())      e.serialNumber    = "Serial number is required";
    if (!form.dealerName.trim())        e.dealerName      = "Dealer name is required";
    if (!form.dealerCompany.trim())     e.dealerCompany   = "Dealer company is required";

    if (!form.dealerContact.trim())     e.dealerContact   = "Dealer contact is required";
    else if (!phoneRegex.test(form.dealerContact)) e.dealerContact = "Enter a valid 10-digit number";

    if (!form.dealerAddress.trim())     e.dealerAddress   = "Dealer address is required";
    if (!image)                         e.image           = "Product image is required";

    return e;
  };

  // ─── Handle Submit ────────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // ✅ Scroll to first error
      window.scrollTo({ top: 300, behavior: "smooth" });
      return;
    }

    // ✅ Use FormData — required for file upload
    const payload = new FormData();
    payload.append("email",           form.email.trim());
    payload.append("customerName",    form.customerName.trim());
    payload.append("clinicName",      form.clinicName.trim());
    payload.append("customerContact", form.customerContact.trim());
    payload.append("clinicAddress",   form.clinicAddress.trim());
    payload.append("purchaseDate",    form.purchaseDate);
    payload.append("productModel",    form.productModel);
    payload.append("serialNumber",    form.serialNumber.trim());
    payload.append("dealerName",      form.dealerName.trim());
    payload.append("dealerCompany",   form.dealerCompany.trim());
    payload.append("dealerContact",   form.dealerContact.trim());
    payload.append("dealerAddress",   form.dealerAddress.trim());
    payload.append("productImage",    image); // ✅ file appended

    console.log("Warranty Payload =>", Object.fromEntries(payload));

    setLoading(true);
    setSuccessMsg("");

    try {
      const response = await postData("warranty/register", payload);
      console.log("Warranty Response =>", response);

      if (response?.success === true) {
        setSuccessMsg("Warranty registered successfully! Our team will contact you soon.");
        // ✅ Reset all fields
        setForm({
          email: "", customerName: "", clinicName: "", customerContact: "",
          clinicAddress: "", purchaseDate: "", productModel: "", serialNumber: "",
          dealerName: "", dealerCompany: "", dealerContact: "", dealerAddress: "",
        });
        setImage(null);
        setImagePreview(null);
        setErrors({});
      } else {
        setErrors({ api: response?.message || "Something went wrong. Please try again." });
      }
    } catch (err) {
      console.error("Warranty submit failed:", err?.message);
      setErrors({ api: "Server error. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  // ─── Reusable error span ──────────────────────────────────────────────────────
  const Err = ({ field }) =>
    errors[field] ? <span className={styles.errorText}>{errors[field]}</span> : null;

  return (
    <section className={styles.warrantySection}>
      <div className={styles.glow}></div>

      <div className="container">
        <Breadcrumb pageName="Extend Warranty" />

        {/* HEADING */}
        <div className={styles.heading}>
          <span>TECHNOMAC WARRANTY</span>
          <h1>Warranty Registration Form</h1>
          <p>
            Thank you for choosing our product and registering your warranty with TECHNOMAC.
            Register your equipment to receive fast support, warranty service assistance
            and priority technical support from our team.
          </p>
        </div>

        {/* INFO CARDS */}
        <div className="row mb-5">
          <div className="col-lg-4 col-md-6 mb-4">
            <div className={styles.infoCard}>
              <FaShieldAlt />
              <h4>Product Protection</h4>
              <p>Get official warranty protection for your TECHNOMAC products.</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className={styles.infoCard}>
              <FaCheckCircle />
              <h4>Fast Service Support</h4>
              <p>Receive quick technical support and faster service processing.</p>
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-4">
            <div className={styles.infoCard}>
              <FaClinicMedical />
              <h4>Trusted Healthcare</h4>
              <p>Supporting modern dental clinics with premium healthcare solutions.</p>
            </div>
          </div>
        </div>

        {/* FORM CARD */}
        <div className={styles.formCard}>
          <form onSubmit={handleSubmit} noValidate>
            <div className="row">

              {/* EMAIL */}
              <div className="col-lg-6">
                <div className={`${styles.formField} ${errors.email ? styles.fieldError : ""}`}>
                  <label>Email Address *</label>
                  <div className={styles.inputGroup}>
                    <FaEnvelope />
                    <input type="email" name="email" value={form.email}
                      onChange={handleChange} placeholder="Enter Email Address" />
                  </div>
                  <Err field="email" />
                </div>
              </div>

              {/* CUSTOMER NAME */}
              <div className="col-lg-6">
                <div className={`${styles.formField} ${errors.customerName ? styles.fieldError : ""}`}>
                  <label>Customer Name *</label>
                  <div className={styles.inputGroup}>
                    <FaUser />
                    <input type="text" name="customerName" value={form.customerName}
                      onChange={handleChange} placeholder="Enter Customer Name" />
                  </div>
                  <Err field="customerName" />
                </div>
              </div>

              {/* CLINIC NAME */}
              <div className="col-lg-6">
                <div className={`${styles.formField} ${errors.clinicName ? styles.fieldError : ""}`}>
                  <label>Clinic Name *</label>
                  <div className={styles.inputGroup}>
                    <FaClinicMedical />
                    <input type="text" name="clinicName" value={form.clinicName}
                      onChange={handleChange} placeholder="Enter Clinic Name" />
                  </div>
                  <Err field="clinicName" />
                </div>
              </div>

              {/* CUSTOMER CONTACT */}
              <div className="col-lg-6">
                <div className={`${styles.formField} ${errors.customerContact ? styles.fieldError : ""}`}>
                  <label>Customer Contact *</label>
                  <div className={styles.inputGroup}>
                    <FaPhoneAlt />
                    <input type="text" name="customerContact" value={form.customerContact}
                      onChange={handleChange} placeholder="Enter Contact Number" maxLength={10} />
                  </div>
                  <Err field="customerContact" />
                </div>
              </div>

              {/* CLINIC ADDRESS */}
              <div className="col-lg-12">
                <div className={`${styles.formField} ${errors.clinicAddress ? styles.fieldError : ""}`}>
                  <label>Clinic Address *</label>
                  <div className={styles.inputGroup}>
                    <FaMapMarkerAlt />
                    <textarea name="clinicAddress" value={form.clinicAddress}
                      onChange={handleChange} placeholder="Enter Clinic Address" />
                  </div>
                  <Err field="clinicAddress" />
                </div>
              </div>

              {/* PURCHASE DATE */}
              <div className="col-lg-6">
                <div className={`${styles.formField} ${errors.purchaseDate ? styles.fieldError : ""}`}>
                  <label>Purchase Date *</label>
                  <div className={styles.inputGroup}>
                    <FaCalendarAlt />
                    <input type="date" name="purchaseDate" value={form.purchaseDate}
                      onChange={handleChange}
                      max={new Date().toISOString().split("T")[0]} // ✅ no future dates
                    />
                  </div>
                  <Err field="purchaseDate" />
                </div>
              </div>

              {/* PRODUCT MODEL */}
              <div className="col-lg-6">
                <div className={`${styles.formField} ${errors.productModel ? styles.fieldError : ""}`}>
                  <label>Product Model *</label>
                  <div className={styles.inputGroup}>
                    <FaBuilding />
                    <select name="productModel" value={form.productModel} onChange={handleChange}>
                      <option value="">Select Product Model</option>
                      {PRODUCT_MODELS.map((model) => (
                        <option key={model} value={model}>{model}</option>
                      ))}
                    </select>
                  </div>
                  <Err field="productModel" />
                </div>
              </div>

              {/* SERIAL NUMBER */}
              <div className="col-lg-6">
                <div className={`${styles.formField} ${errors.serialNumber ? styles.fieldError : ""}`}>
                  <label>Serial Number *</label>
                  <div className={styles.inputGroup}>
                    <FaHashtag />
                    <input type="text" name="serialNumber" value={form.serialNumber}
                      onChange={handleChange} placeholder="Enter Serial Number" />
                  </div>
                  <Err field="serialNumber" />
                </div>
              </div>

              {/* DEALER NAME */}
              <div className="col-lg-6">
                <div className={`${styles.formField} ${errors.dealerName ? styles.fieldError : ""}`}>
                  <label>Dealer Name *</label>
                  <div className={styles.inputGroup}>
                    <FaUser />
                    <input type="text" name="dealerName" value={form.dealerName}
                      onChange={handleChange} placeholder="Enter Dealer Name" />
                  </div>
                  <Err field="dealerName" />
                </div>
              </div>

              {/* DEALER COMPANY */}
              <div className="col-lg-6">
                <div className={`${styles.formField} ${errors.dealerCompany ? styles.fieldError : ""}`}>
                  <label>Dealer Company *</label>
                  <div className={styles.inputGroup}>
                    <FaBuilding />
                    <input type="text" name="dealerCompany" value={form.dealerCompany}
                      onChange={handleChange} placeholder="Enter Dealer Company" />
                  </div>
                  <Err field="dealerCompany" />
                </div>
              </div>

              {/* DEALER CONTACT */}
              <div className="col-lg-6">
                <div className={`${styles.formField} ${errors.dealerContact ? styles.fieldError : ""}`}>
                  <label>Dealer Contact *</label>
                  <div className={styles.inputGroup}>
                    <FaPhoneAlt />
                    <input type="text" name="dealerContact" value={form.dealerContact}
                      onChange={handleChange} placeholder="Enter Dealer Contact" maxLength={10} />
                  </div>
                  <Err field="dealerContact" />
                </div>
              </div>

              {/* DEALER ADDRESS */}
              <div className="col-lg-12">
                <div className={`${styles.formField} ${errors.dealerAddress ? styles.fieldError : ""}`}>
                  <label>Dealer Address *</label>
                  <div className={styles.inputGroup}>
                    <FaMapMarkerAlt />
                    <textarea name="dealerAddress" value={form.dealerAddress}
                      onChange={handleChange} placeholder="Enter Dealer Address" />
                  </div>
                  <Err field="dealerAddress" />
                </div>
              </div>

              {/* FILE UPLOAD */}
              <div className="col-lg-12">
                <div className={`${styles.formField} ${errors.image ? styles.fieldError : ""}`}>
                  <label>Upload Installed Product Image *</label>
                  <div className={styles.uploadBox}>
                    <FaUpload />
                    <h4>Upload Product Image</h4>
                    <p>Upload image of installed X-ray machine or product. (Max 5MB)</p>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {/* ✅ Preview */}
                    {imagePreview && (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className={styles.imagePreview}
                      />
                    )}
                  </div>
                  <Err field="image" />
                </div>
              </div>

            </div>

            {/* API Error */}
            {errors.api && <p className={styles.apiError}>{errors.api}</p>}

            {/* Success */}
            {successMsg && <p className={styles.successMsg}>{successMsg}</p>}

            {/* SUBMIT */}
            <button type="submit" className={styles.submitBtn} disabled={loading}>
              {loading ? "Submitting..." : "Submit Warranty Registration"}
            </button>

          </form>
        </div>

      </div>
    </section>
  );
}