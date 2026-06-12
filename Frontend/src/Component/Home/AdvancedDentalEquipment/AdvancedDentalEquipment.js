import React, { useState } from 'react'
import Headerimage from "../../../../Images/headerImage.png";
import Image from "next/image";
import styles from "./Advanceddentalequipment.module.css";
import { FaPhoneAlt, FaTimes, FaCheckCircle } from "react-icons/fa";
import { postData } from "../../../services/FetchNodeServices";

// ── Indian States ────────────────────────────────────────────────
const INDIAN_STATES = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
    "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
    "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
    "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
    "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
    "Delhi", "Jammu & Kashmir", "Ladakh", "Chandigarh", "Puducherry",
];

const TIME_SLOTS = [
    "09:00 AM – 10:00 AM", "10:00 AM – 11:00 AM", "11:00 AM – 12:00 PM",
    "12:00 PM – 01:00 PM", "02:00 PM – 03:00 PM", "03:00 PM – 04:00 PM",
    "04:00 PM – 05:00 PM", "05:00 PM – 06:00 PM",
];

const INITIAL_FORM = {
    name: "", country: "IN - India", state: "",
    mobile: "", email: "", date: "", time: "", description: "",
};

// ── Modal Form ───────────────────────────────────────────────────
function CallBackModal({ onClose, productName = "TECHNOMAC Dental Equipment" }) {
    const [form, setForm] = useState(INITIAL_FORM);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const set = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = () => {
        const e = {};
        if (!form.name.trim()) e.name = "Name is required";
        if (!form.state) e.state = "Please select a state";
        if (!form.mobile.trim() || !/^\d{10}$/.test(form.mobile.trim()))
            e.mobile = "Enter a valid 10-digit mobile number";
        if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
            e.email = "Enter a valid email address";
        if (!form.date) e.date = "Please select a date";
        if (!form.time) e.time = "Please select a time slot";
        return e;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errs = validate();
        if (Object.keys(errs).length) { setErrors(errs); return; }

        setLoading(true);
        try {
            // ── Payload ──────────────────────────────────────────────
            const payload = {
                productName,
                name: form.name.trim(),
                country: form.country,
                state: form.state,
                mobileNumber: form.mobile.trim(),
                email: form.email.trim(),
                date: form.date,
                time: form.time,
                description: form.description.trim(),
            };
            // ─────────────────────────────────────────────────────────

            const res = await postData("callback", payload);
            if (res?.success) {
                setSubmitted(true);
            } else {
                setErrors({ submit: res?.message || "Submission failed. Please try again." });
            }
        } catch (err) {
            setErrors({ submit: "Something went wrong. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    // ── Today's date for min date ──
    const today = new Date().toISOString().split("T")[0];

    const inputCls = (field) =>
        `${styles.input} ${errors[field] ? styles.inputError : ""}`;

    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>

                {/* Header */}
                <div className={styles.modalHeader}>
                    <div>
                        <h2 className={styles.modalTitle}>Get a Call Back</h2>
                        <p className={styles.modalSubtitle}>
                            We&apos;re committed to providing you with the best possible dental
                            equipment and support. Our team will get back to you within 24 hours.
                        </p>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <FaTimes />
                    </button>
                </div>

                {/* Product Tag */}
                <div className={styles.productTag}>{productName}</div>

                {/* Success State */}
                {submitted ? (
                    <div className={styles.successBox}>
                        <FaCheckCircle className={styles.successIcon} />
                        <h3>Request Submitted!</h3>
                        <p>Thank you, <strong>{form.name}</strong>. Our team will call you back within 24 hours.</p>
                        <button className={styles.submitBtn} onClick={onClose}>Close</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className={styles.form} noValidate>

                        {/* Row 1 — Name + Country */}
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label className={styles.label}>Name <span className={styles.req}>*</span></label>
                                <input
                                    type="text"
                                    className={inputCls("name")}
                                    placeholder="Enter your name"
                                    value={form.name}
                                    onChange={(e) => set("name", e.target.value)}
                                />
                                {errors.name && <span className={styles.error}>{errors.name}</span>}
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Country</label>
                                <select
                                    className={styles.input}
                                    value={form.country}
                                    onChange={(e) => set("country", e.target.value)}
                                >
                                    <option value="IN - India">IN - India</option>
                                    {/* <option value="US - United States">US - United States</option>
                                    <option value="GB - United Kingdom">GB - United Kingdom</option>
                                    <option value="AE - UAE">AE - UAE</option>
                                    <option value="SG - Singapore">SG - Singapore</option>
                                    <option value="AU - Australia">AU - Australia</option>
                                    <option value="CA - Canada">CA - Canada</option> */}
                                </select>
                            </div>
                        </div>

                        {/* Row 2 — State + Mobile */}
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label className={styles.label}>State <span className={styles.req}>*</span></label>
                                <select
                                    className={inputCls("state")}
                                    value={form.state}
                                    onChange={(e) => set("state", e.target.value)}
                                >
                                    <option value="">Select State</option>
                                    {INDIAN_STATES.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                                {errors.state && <span className={styles.error}>{errors.state}</span>}
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Mobile Number <span className={styles.req}>*</span></label>
                                <input
                                    type="tel"
                                    className={inputCls("mobile")}
                                    placeholder="Enter your 10-digit number"
                                    value={form.mobile}
                                    maxLength={10}
                                    onChange={(e) => set("mobile", e.target.value.replace(/\D/g, ""))}
                                />
                                {errors.mobile && <span className={styles.error}>{errors.mobile}</span>}
                            </div>
                        </div>

                        {/* Row 3 — Email + Date */}
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label className={styles.label}>Email Address <span className={styles.req}>*</span></label>
                                <input
                                    type="email"
                                    className={inputCls("email")}
                                    placeholder="Enter your email ID"
                                    value={form.email}
                                    onChange={(e) => set("email", e.target.value)}
                                />
                                {errors.email && <span className={styles.error}>{errors.email}</span>}
                            </div>

                            <div className={styles.field}>
                                <label className={styles.label}>Date <span className={styles.req}>*</span></label>
                                <input
                                    type="date"
                                    className={inputCls("date")}
                                    value={form.date}
                                    min={today}
                                    onChange={(e) => set("date", e.target.value)}
                                />
                                {errors.date && <span className={styles.error}>{errors.date}</span>}
                            </div>
                        </div>

                        {/* Row 4 — Time */}
                        <div className={styles.row}>
                            <div className={styles.field}>
                                <label className={styles.label}>Time <span className={styles.req}>*</span></label>
                                <select
                                    className={inputCls("time")}
                                    value={form.time}
                                    onChange={(e) => set("time", e.target.value)}
                                >
                                    <option value="">Select Start Time</option>
                                    {TIME_SLOTS.map((t) => (
                                        <option key={t} value={t}>{t}</option>
                                    ))}
                                </select>
                                {errors.time && <span className={styles.error}>{errors.time}</span>}
                            </div>
                            <div className={styles.field} /> {/* spacer */}
                        </div>

                        {/* Description */}
                        <div className={styles.field}>
                            <label className={styles.label}>Description</label>
                            <textarea
                                className={`${styles.input} ${styles.textarea}`}
                                placeholder="Enter Description (optional)"
                                value={form.description}
                                rows={4}
                                onChange={(e) => set("description", e.target.value)}
                            />
                        </div>

                        {/* Submit Error */}
                        {errors.submit && (
                            <div className={styles.submitError}>{errors.submit}</div>
                        )}

                        {/* Buttons */}
                        <div className={styles.btnRow}>
                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={loading}
                            >
                                {loading ? "Submitting..." : "Submit"}
                            </button>
                            <button
                                type="button"
                                className={styles.cancelBtn}
                                onClick={onClose}
                            >
                                Cancel
                            </button>
                        </div>

                    </form>
                )}
            </div>
        </div>
    );
}

function AdvancedDentalEquipment({ productName = 'TECHNOMAC Dental Equipment' }) {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <section className="hero-section">
                <div className="container">
                    <div className="row align-items-center">
                        {/* Left */}
                        <div className="col-lg-6">
                            <div className="hero-content">
                                <span className="hero-tag">
                                    Advanced Dental Equipment
                                </span>
                                <h1>
                                    Make your perfect smile even better
                                </h1>
                                <p>
                                    Premium dental healthcare products
                                    and advanced clinic setup solutions
                                    designed for modern dental professionals.
                                </p>
                                <button className="hero-btn" onClick={() => setShowModal(true)}>
                                    Request a Call
                                </button>
                            </div>
                        </div>

                        {/* Right */}
                        <div className="col-lg-6">
                            <div className="hero-image">
                                <Image
                                    src={Headerimage}
                                    alt="Dental Equipment"
                                    priority
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {showModal && (
                <CallBackModal
                    productName={productName}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    )
}

export default AdvancedDentalEquipment
