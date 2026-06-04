"use client";

import { useEffect, useState } from "react";

import styles from "./EnquiryPopup.module.css";

import {
  FaTimes,
  FaUser,
  FaEnvelope,
  FaPhoneAlt,
  FaCommentDots,
} from "react-icons/fa";

export default function EnquiryPopup() {

  const [show, setShow] =
    useState(false);

  const [mounted, setMounted] =
    useState(false);

  const [formData, setFormData] =
    useState({

      name: "",
      email: "",
      mobile: "",
      query: "",
    });

  /* POPUP SHOW */

  useEffect(() => {

    setMounted(true);

    if (
      typeof window !== "undefined"
    ) {

      const submitted =
        localStorage.getItem(
          "enquirySubmitted"
        );

      if (!submitted) {

        const timer =
          setTimeout(() => {

            setShow(true);

          }, 5000);

        return () =>
          clearTimeout(timer);
      }
    }

  }, []);

  /* INPUT CHANGE */

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value,
    });
  };

  /* SUBMIT */

  const handleSubmit = (e) => {

    e.preventDefault();

    localStorage.setItem(
      "enquirySubmitted",
      "true"
    );

    setShow(false);

    alert(
      "Enquiry Submitted Successfully"
    );
  };

  /* SSR FIX */

  if (!mounted) return null;

  /* HIDE POPUP */

  if (!show) return null;

  return (

    <div className={styles.overlay}>

      <div className={styles.popup}>

        {/* CLOSE */}

        <button
          className={styles.closeBtn}
          onClick={() =>
            setShow(false)
          }
        >

          <FaTimes />

        </button>

        {/* TOP */}

        <span className={styles.tag}>
          TECHNOMAC
        </span>

        <h2>
          Quick Enquiry
        </h2>

        <p>
          Get free consultation for
          dental clinic setup and
          equipment solutions.
        </p>

        {/* FORM */}
<form
  onSubmit={handleSubmit}
>

  <div className="row">

    {/* NAME */}

    <div className="col-md-6">

      <div className={styles.inputBox}>

        <FaUser />

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          onChange={handleChange}
        />

      </div>

    </div>

    {/* EMAIL */}

    <div className="col-md-6">

      <div className={styles.inputBox}>

        <FaEnvelope />

        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          onChange={handleChange}
        />

      </div>

    </div>

    {/* MOBILE */}

    <div className="col-md-6">

      <div className={styles.inputBox}>

        <FaPhoneAlt />

        <input
          type="text"
          name="mobile"
          placeholder="Mobile"
          required
          onChange={handleChange}
        />

      </div>

    </div>

    {/* QUERY */}

    <div className="col-md-6">

      <div className={styles.inputBox}>

        <FaCommentDots />

        <textarea
          name="query"
          placeholder="Your Query"
          rows="1"
          required
          onChange={handleChange}
        ></textarea>

      </div>

    </div>

  </div>

  {/* BUTTON */}

  <button
    type="submit"
    className={styles.submitBtn}
  >

    Submit Enquiry

  </button>

</form>

      </div>

    </div>
  );
}