import { useState } from "react";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import styles from "./ContactPage.module.css";

import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaWhatsapp,
} from "react-icons/fa";
import { postData } from "../../../services/FetchNodeServices";

export default function ContactPage() {

    const [form, setForm] = useState({ fullName: '', phoneNumber: '', email: '', productInterest: '', message: '', });
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
    const handleSubmit = async (e) => {
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
            productInterest: form.productInterest.trim(),
        };

        console.log("Enquiry Payload =>", payload);

        setLoading(true);
        setSuccessMsg("");

        try {
            const response = await postData("contact/create", payload);
            console.log("Enquiry Response =>", response);

            if (response?.success === true) {
                setSuccessMsg("Thank you! We'll get back to you soon.");
                setForm({ fullName: '', phoneNumber: '', email: '', productInterest: '', message: '', }); // ✅ reset
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
        <section className={styles.contactSection}>
            <div className="container">
                <Breadcrumb pageName="Contact Us" />
                <div className="row">
                    <div className="col-lg-5 mb-4">

                        <div className={styles.contactInfo}>

                            <span className={styles.tag}>Get In Touch</span>

                            <h2>
                                Let's Build Your
                                Perfect Dental Clinic
                            </h2>
                            <p>
                                Connect with TECHNOMAC for
                                premium dental equipment,
                                clinic setup solutions and
                                healthcare support.
                            </p>

                            {/* BOX */}

                            <div className={styles.infoBox}>

                                <div className={styles.icon}><FaPhoneAlt /></div>

                                <div>

                                    <h4>Phone Number</h4>

                                    <p>
                                        Sales Dept: +91-8448825572,
                                        +91-9268825571,+91-9599090411
                                    </p>
                                    <p>
                                        After-sales Service Dept: <a href="tel:+919311125574">
                                            +91 9311125574
                                        </a>
                                    </p>

                                </div>

                            </div>

                            {/* BOX */}

                            <div className={styles.infoBox}>

                                <div className={styles.icon}>
                                    <FaEnvelope />
                                </div>

                                <div>

                                    <h4>
                                        Email Address
                                    </h4>

                                    <a href="mailto:info@technomac.com">
                                        info@technomac.com
                                    </a>

                                </div>

                            </div>

                            {/* BOX */}

                            <div className={styles.infoBox}>

                                <div className={styles.icon}>
                                    <FaMapMarkerAlt />
                                </div>

                                <div>

                                    <h4>
                                        Office Address
                                    </h4>

                                    <p>
                                        Plot no.-88, Pocket- L, Sector 1,
                                        Bawana Industrial Area, DSIIDC
                                        Sub-city, New Delhi-110039, India
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* RIGHT */}

                    <div className="col-lg-7">
                        <div className={styles.formCard}>
                            <div className={styles.formHeader}>
                                <h3>Send Inquiry</h3>
                                <hr />
                            </div>
                            <form onSubmit={handleSubmit} noValidate>

                                <div className="row">
                                    <div className="col-md-6">
                                        <div className={styles.inputGroup}>
                                            <label>Full Name</label>
                                            <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Enter your name" />
                                            {errors.fullName && <span className={styles.errorText}>{errors.fullName}</span>}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className={styles.inputGroup}>
                                            <label>Phone Number</label>
                                            <input type="text" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="Enter phone number" />
                                            {errors.phoneNumber && <span className={styles.errorText}>{errors.phoneNumber}</span>}
                                        </div>
                                    </div>

                                    <div className="col-md-6">
                                        <div className={styles.inputGroup}>
                                            <label>Email Address</label>
                                            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="Enter email address" />
                                            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">

                                        <div className={styles.inputGroup}>
                                            <label>Product Interest</label>
                                            <input type="text" name="productInterest" value={form.productInterest} onChange={handleChange} placeholder="Dental Chair" />
                                            {errors.productInterest && <span className={styles.errorText}>{errors.productInterest}</span>}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className={styles.inputGroup}>
                                            <label>Message</label>
                                            <textarea rows="4" name="message" value={form.message} onChange={handleChange} placeholder="Write your message..." ></textarea>
                                            {errors.message && <span className={styles.errorText}>{errors.message}</span>}
                                        </div>
                                    </div>
                                </div>
                                {errors.api && <p className={styles.apiError}>{errors.api}</p>}

                                {/* Success */}
                                {successMsg && <p className={styles.successMsg}>{successMsg}</p>}
                                {/* BUTTONS */}

                                <div className={styles.buttonGroup}>
                                    <button type="submit" className="quoteBtn" >{loading ? 'Send Inquiry...' : 'Send Inquiry'}</button>
                                    <a href="https://wa.me/919999999999" target="_blank" className={styles.whatsappBtn}>
                                        <FaWhatsapp />
                                        WhatsApp
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}   