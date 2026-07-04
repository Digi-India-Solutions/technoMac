import { useState } from "react";
import styles from "./EnquirySection.module.css";
import { FaPhoneAlt, FaEnvelope, FaPaperPlane, FaUser } from "react-icons/fa";
import { postData } from "../../../services/FetchNodeServices";
import image from "./1.jpg"
import Image from "next/image";

export default function EnquirySection() {
  const [form, setForm] = useState({ name: "", message: "", email: "", phone: "", });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // ─── Handle Input Change ───────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    // ✅ Clear error on type
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // ─── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email";
    }

    if (!form.phone.trim()) {
      newErrors.phone = "Phone is required";
    } else if (!/^[6-9]\d{9}$/.test(form.phone)) {
      newErrors.phone = "Enter a valid 10-digit phone number";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    }

    return newErrors;
  };

  // ─── Handle Submit ─────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // ✅ Payload
    const payload = {
      fullName: form.name.trim(),
      email: form.email.trim(),
      phoneNumber: form.phone.trim(),
      message: form.message.trim(),
    };

    console.log("Enquiry Payload =>", payload);

    setLoading(true);
    setSuccessMsg("");

    try {
      const response = await postData("contact/create", payload);
      console.log("Enquiry Response =>", response);

      if (response?.success === true) {
        setSuccessMsg("Thank you! We'll get back to you soon.");
        setForm({ name: "", email: "", phone: "", message: "" }); // ✅ reset
        setErrors({});
      } else {
        setErrors({ api: response?.message || "Something went wrong. Please try again." });
      }
    } catch (e) {
      console.error("Enquiry submit failed:", e?.message);
      setErrors({ api: "Server error. Please try again later." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.enquirySection}>
      <div className="container">
        <div className={styles.enquiryCard}>

          {/* LEFT */}
          <div className={styles.ImageQnquiry}>
            <Image src={image} alt="Enquiry" />
          </div>

          {/* RIGHT */}
          <div className={styles.formWrapper}>
            <h2>Stay Connected with Technomac</h2>
            <p>
              Be the first to discover new products, exclusive offers,
              and advancements in medical and dental technology.
            </p>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className="row">

                {/* NAME */}
                <div className="col-md-6">
                  <div className={`${styles.inputGroup} ${errors.name ? styles.inputError : ""}`}>
                    <FaUser />
                    <input
                      type="text"
                      name="name"
                      placeholder="Name*"
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.name && (
                    <span className={styles.errorText}>{errors.name}</span>
                  )}
                </div>

                {/* EMAIL */}
                <div className="col-md-6">
                  <div className={`${styles.inputGroup} ${errors.email ? styles.inputError : ""}`}>
                    <FaEnvelope />
                    <input
                      type="email"
                      name="email"
                      placeholder="Email*"
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && (
                    <span className={styles.errorText}>{errors.email}</span>
                  )}
                </div>

                {/* PHONE */}
                <div className="col-md-6">
                  <div className={`${styles.inputGroup} ${errors.phone ? styles.inputError : ""}`}>
                    <FaPhoneAlt />
                    <input
                      type="text"
                      name="phone"
                      placeholder="Phone*"
                      value={form.phone}
                      onChange={handleChange}
                      maxLength={10}
                    />
                  </div>
                  {errors.phone && (
                    <span className={styles.errorText}>{errors.phone}</span>
                  )}
                </div>

                {/* MESSAGE */}
                <div className="col-md-6">
                  <div className={`${styles.inputGroup} ${errors.message ? styles.inputError : ""}`}>
                    <FaPaperPlane />
                    <input
                      type="text"
                      name="message"
                      placeholder="Message*"
                      value={form.message}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.message && (
                    <span className={styles.errorText}>{errors.message}</span>
                  )}
                </div>

              </div>

              {/* API Error */}
              {errors.api && (
                <p className={styles.apiError}>{errors.api}</p>
              )}

              {/* Success Message */}
              {successMsg && (
                <p className={styles.successMsg}>{successMsg}</p>
              )}

              {/* BUTTON */}
              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Enquiry →"}
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
}