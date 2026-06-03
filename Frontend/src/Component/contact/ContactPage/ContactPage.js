import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import styles from "./ContactPage.module.css";

import {
    FaPhoneAlt,
    FaEnvelope,
    FaMapMarkerAlt,
    FaWhatsapp,
} from "react-icons/fa";

export default function ContactPage() {

    return (

        <section className="allSections">

            <div className="container">

                <Breadcrumb pageName="Contact Us" />

                <div className="row">

                    {/* LEFT */}

                    <div className="col-lg-5 mb-4">

                        <div className={styles.contactInfo}>

                            <span className={styles.tag}>
                                Get In Touch
                            </span>

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

                                <div className={styles.icon}>
                                    <FaPhoneAlt />
                                </div>

                                <div>

                                    <h4>
                                        Phone Number
                                    </h4>

                                    
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

                                <span>
                                    Contact Form
                                </span>

                                <h3>
                                    Send Inquiry
                                </h3>

                            </div>

                            <form>

                                <div className="row">

                                    <div className="col-md-6">

                                        <div className={styles.inputGroup}>

                                            <label>
                                                Full Name
                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Enter your name"
                                            />

                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <div className={styles.inputGroup}>

                                            <label>
                                                Phone Number
                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Enter phone number"
                                            />

                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <div className={styles.inputGroup}>

                                            <label>
                                                Email Address
                                            </label>

                                            <input
                                                type="email"
                                                placeholder="Enter email address"
                                            />

                                        </div>

                                    </div>

                                    <div className="col-md-6">

                                        <div className={styles.inputGroup}>

                                            <label>
                                                Product Interest
                                            </label>

                                            <input
                                                type="text"
                                                placeholder="Dental Chair"
                                            />

                                        </div>

                                    </div>

                                    <div className="col-12">

                                        <div className={styles.inputGroup}>

                                            <label>
                                                Message
                                            </label>

                                            <textarea
                                                rows="6"
                                                placeholder="Write your message..."
                                            ></textarea>

                                        </div>

                                    </div>

                                </div>

                                {/* BUTTONS */}

                                <div className={styles.buttonGroup}>

                                    <button
                                        type="submit"
                                        className={styles.submitBtn}
                                    >

                                        Send Inquiry

                                    </button>

                                    <a
                                        href="https://wa.me/919999999999"
                                        target="_blank"
                                        className={styles.whatsappBtn}
                                    >

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