import { useState, useEffect, useRef } from "react";
import styles from "./ContactPage.module.css";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
  FaChevronDown,
  FaSearch,
} from "react-icons/fa";
import { postData, getData } from "../../../services/FetchNodeServices";

export default function ContactPage() {
  const [form, setForm] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    productInterest: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  const [contactInfo, setContactInfo] = useState({
    salesPhone: "",
    servicePhone: "",
    email: "",
    address: "",
    whatsappPhone: "",
  });

  // ─── Products & Searchable Dropdown State ────────────────────────────────
  const [productsList, setProductsList] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchContactInfo = async () => {
      try {
        const res = await getData("contact-info");
        if (res?.success && res?.data) {
          setContactInfo({
            salesPhone: res.data.salesPhone,
            servicePhone: res.data.servicePhone,
            email: res.data.email,
            address: res.data.address,
            whatsappPhone: res.data.whatsappPhone,
          });
        }
      } catch (err) {
        console.error("fetchContactInfo error:", err);
      }
    };
    fetchContactInfo();
  }, []);

  // ─── Fetch All Products For Dropdown ─────────────────────────────────────
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getData("product");
        let list = [];
        if (res?.success && Array.isArray(res?.data) && res.data.length > 0) {
          list = res.data
            .map((item) => item.name?.trim())
            .filter(Boolean);
        }

        const defaultOptions = [
          "Dental Chair",
          "Autoclave",
          "X-Ray Machine",
          "Suction Machine",
          "Full Clinic Setup",
        ];

        const combined = Array.from(new Set([...list, ...defaultOptions]));
        setProductsList(combined);
      } catch (err) {
        console.error("fetchProducts error:", err);
        setProductsList([
          "Dental Chair",
          "Autoclave",
          "X-Ray Machine",
          "Suction Machine",
          "Full Clinic Setup",
        ]);
      }
    };
    fetchProducts();
  }, []);

  // ─── Click Outside & Escape to Close Dropdown ────────────────────────────
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (isDropdownOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 60);
    } else {
      setSearchQuery("");
    }
  }, [isDropdownOpen]);

  // ─── Handle Input Change ───────────────────────────────────────────────────
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectProduct = (productName) => {
    setForm((prev) => ({ ...prev, productInterest: productName }));
    setIsDropdownOpen(false);
    setSearchQuery("");
    if (errors.productInterest) {
      setErrors((prev) => ({ ...prev, productInterest: "" }));
    }
  };

  const filteredProducts = productsList.filter((prod) =>
    prod.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  // ─── Validation ────────────────────────────────────────────────────────────
  const validate = () => {
    const newErrors = {};

    if (!form.fullName.trim()) {
      newErrors.fullName = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.phoneNumber.trim()) {
      newErrors.phoneNumber = "Phone number is required";
    } else if (!/^\+?[\d\s-]{8,15}$/.test(form.phoneNumber.trim())) {
      newErrors.phoneNumber = "Enter a valid phone number";
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ─── Form Submit ───────────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setLoading(true);
    setSuccessMsg("");

    try {
      const res = await postData("contact/create", form);

      if (res?.success) {
        setSuccessMsg(
          "Thank you! Your inquiry has been submitted successfully. We will get back to you shortly."
        );

        setForm({
          fullName: "",
          phoneNumber: "",
          email: "",
          productInterest: "",
          message: "",
        });
      } else {
        setSuccessMsg(res?.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Contact Form Submit Error:", error);
      setSuccessMsg("Failed to submit form. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.contactSection}>
      <div className="container">
        <div className={styles.contactBox} style={{ marginBottom: '20px' }}>
          <div className="row g-10">
            {/* LEFT COLUMN - INFO */}
            <div className="col-lg-5 col-12">
              <div className={styles.contactInfo}>
                <span className={styles.tag}>Get In Touch</span>

                <h2>Let's Build Better Healthcare Together</h2>
                <p>
                  Connect with TECHNOMAC for premium equipment’s, clinic & hospital
                  setup solutions and healthcare support.
                </p>

                {/* PHONE BOX */}
                <div className={styles.infoBox}>
                  <div className={styles.icon}>
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <h4>Phone Number</h4>
                    <p>Sales Dept: {contactInfo.salesPhone}</p>
                    <p>
                      After-sales Service Dept:{" "}
                      <a href={`tel:${contactInfo.servicePhone.replace(/\s+/g, "")}`}>
                        {contactInfo.servicePhone}
                      </a>
                    </p>
                  </div>
                </div>

                {/* EMAIL BOX */}
                <div className={styles.infoBox}>
                  <div className={styles.icon}>
                    <FaEnvelope />
                  </div>
                  <div>
                    <h4>Email Address</h4>
                    <a href={`mailto:${contactInfo.email}`}>{contactInfo.email}</a>
                  </div>
                </div>

                {/* ADDRESS BOX */}
                <div className={styles.infoBox}>
                  <div className={styles.icon}>
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4>Office Address</h4>
                    <p>{contactInfo.address}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN - FORM */}
            <div className="col-lg-7 col-12" >
              <div className={styles.formCard}>
                <h3>Send Inquiry</h3>

                {/* SUCCESS MESSAGE */}
                {successMsg && (
                  <div
                    className={`alert ${successMsg.includes("Thank you")
                      ? "alert-success"
                      : "alert-danger"
                      } mb-3`}
                    style={{ fontSize: "14px", borderRadius: "8px" }}
                  >
                    {successMsg}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className="row">
                    {/* FULL NAME */}
                    <div className="col-md-6 col-12 mb-3">
                      <div className={styles.inputGroup}>
                        <label>Full Name</label>
                        <input
                          type="text"
                          name="fullName"
                          value={form.fullName}
                          onChange={handleChange}
                          placeholder="Enter your name"
                          className={errors.fullName ? styles.inputError : ""}
                        />
                        {errors.fullName && (
                          <span className={styles.errorText}>
                            {errors.fullName}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* PHONE */}
                    <div className="col-md-6 col-12 mb-3">
                      <div className={styles.inputGroup}>
                        <label>Phone Number</label>
                        <input
                          type="text"
                          name="phoneNumber"
                          value={form.phoneNumber}
                          onChange={handleChange}
                          placeholder="Enter phone number"
                          className={errors.phoneNumber ? styles.inputError : ""}
                        />
                        {errors.phoneNumber && (
                          <span className={styles.errorText}>
                            {errors.phoneNumber}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* EMAIL */}
                    <div className="col-md-6 col-12 mb-3">
                      <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="Enter email address"
                          className={errors.email ? styles.inputError : ""}
                        />
                        {errors.email && (
                          <span className={styles.errorText}>
                            {errors.email}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* PRODUCT INTEREST */}
                    <div className="col-md-6 col-12 mb-3">
                      <div className={styles.inputGroup} ref={dropdownRef}>
                        <label>Product Interest</label>
                        <div className={styles.customSelectWrapper}>
                          <div
                            className={`${styles.customSelectTrigger} ${
                              errors.productInterest ? styles.inputError : ""
                            } ${isDropdownOpen ? styles.selectActive : ""}`}
                            onClick={() => setIsDropdownOpen((prev) => !prev)}
                            tabIndex={0}
                            role="button"
                            aria-expanded={isDropdownOpen}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ") {
                                e.preventDefault();
                                setIsDropdownOpen((prev) => !prev);
                              }
                            }}
                          >
                            <span
                              className={
                                form.productInterest
                                  ? styles.selectedText
                                  : styles.placeholderText
                              }
                            >
                              {form.productInterest || "Select Product"}
                            </span>
                            <div className={styles.selectIcons}>
                              {form.productInterest && (
                                <span
                                  className={styles.clearBtn}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSelectProduct("");
                                  }}
                                  title="Clear selection"
                                >
                                  ×
                                </span>
                              )}
                              <FaChevronDown
                                className={`${styles.dropdownArrow} ${
                                  isDropdownOpen ? styles.arrowOpen : ""
                                }`}
                              />
                            </div>
                          </div>

                          {isDropdownOpen && (
                            <div className={styles.dropdownMenu}>
                              <div className={styles.searchBox}>
                                <FaSearch className={styles.searchIcon} />
                                <input
                                  ref={searchInputRef}
                                  type="text"
                                  placeholder="Search product..."
                                  value={searchQuery}
                                  onChange={(e) => setSearchQuery(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className={styles.dropdownSearchInput}
                                />
                                {searchQuery && (
                                  <span
                                    className={styles.clearSearchBtn}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSearchQuery("");
                                      searchInputRef.current?.focus();
                                    }}
                                  >
                                    ×
                                  </span>
                                )}
                              </div>

                              <ul className={styles.optionsList}>
                                <li
                                  className={`${styles.optionItem} ${
                                    !form.productInterest
                                      ? styles.activeOption
                                      : ""
                                  }`}
                                  onClick={() => handleSelectProduct("")}
                                >
                                  Select Product
                                </li>
                                {filteredProducts.length > 0 ? (
                                  filteredProducts.map((prodName, idx) => (
                                    <li
                                      key={idx}
                                      className={`${styles.optionItem} ${
                                        form.productInterest === prodName
                                          ? styles.activeOption
                                          : ""
                                      }`}
                                      onClick={() => handleSelectProduct(prodName)}
                                      title={prodName}
                                    >
                                      {prodName}
                                    </li>
                                  ))
                                ) : (
                                  <li className={styles.noResults}>
                                    No products found
                                  </li>
                                )}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* MESSAGE */}
                    <div className="col-12 mb-4">
                      <div className={styles.inputGroup}>
                        <label>Message</label>
                        <textarea
                          rows="4"
                          name="message"
                          value={form.message}
                          onChange={handleChange}
                          placeholder="Write your message..."
                          className={errors.message ? styles.inputError : ""}
                        ></textarea>
                        {errors.message && (
                          <span className={styles.errorText}>
                            {errors.message}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* SUBMIT BUTTON */}
                    <div className="col-12">
                      <div className={styles.buttonGroup}>
                        <button
                          type="submit"
                          disabled={loading}
                          className={styles.submitBtn}
                        >
                          {loading ? "Submitting..." : "Send Inquiry"}
                        </button>

                        <a
                          href={`https://wa.me/${contactInfo.whatsappPhone.replace(
                            /[^\d]/g,
                            ""
                          )}?text=Hello%20TECHNOMAC,%20I%20have%20an%20inquiry.`}
                          target="_blank"
                          rel="noreferrer"
                          className={styles.whatsappBtn}
                        >
                          <FaWhatsapp /> WhatsApp
                        </a>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}