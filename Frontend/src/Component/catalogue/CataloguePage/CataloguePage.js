import { useState } from "react";

import styles from "./CataloguePage.module.css";

import Image from "next/image";

import {
    FaDownload,
    FaBookOpen,
    FaTimes,
    FaUser,
    FaEnvelope,
    FaPhoneAlt,
    FaBuilding,
} from "react-icons/fa";

import catalogue1 from "../../../../Images/certificate.jpg";
import catalogue2 from "../../../../Images/certificate.jpg";
import catalogue3 from "../../../../Images/certificate.jpg";
import catalogue4 from "../../../../Images/certificate.jpg";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";

const catalogues = [

    {
        image: catalogue1,
        title: "Dental Chair Catalogue",
        desc:
            "Premium dental chair collection brochure.",
    },

    {
        image: catalogue2,
        title: "Imaging Equipment Catalogue",
        desc:
            "Advanced dental imaging solutions brochure.",
    },

    {
        image: catalogue3,
        title: "Clinic Setup Catalogue",
        desc:
            "Modern dental clinic setup solutions.",
    },

    {
        image: catalogue4,
        title: "Complete Product Catalogue",
        desc:
            "Full TECHNOMAC product brochure.",
    },

];

export default function CataloguePage() {

    const [openModal, setOpenModal] =
        useState(false);

    return (

        <section className={styles.catalogueSection}>

            {/* GLOW */}

            <div className={styles.glow}></div>

            <div className="container">
                

                <Breadcrumb pageName="Product Catalogues" />

                {/* HEADING */}

                <div className={styles.heading}>

                    <span>
                        TECHNOMAC BROCHURES
                    </span>

                    <h1>
                        Product Catalogues
                    </h1>

                    <p>
                        Download our latest dental
                        equipment brochures, clinic
                        setup catalogues and premium
                        healthcare product details.
                    </p>

                </div>

                {/* GRID */}

                <div className="row">

                    {catalogues.map((item, index) => (

                        <div
                            className="col-lg-3 col-md-6 col-6 mb-4"
                            key={index}
                        >

                            <div className={styles.catalogueCard}>

                                {/* IMAGE */}

                                <div className={styles.imageWrapper}>

                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        className={styles.catalogueImage}
                                    />

                                </div>

                                {/* CONTENT */}

                                <div className={styles.cardContent}>

                                    <div>

                                        <h3>
                                            {item.title}
                                        </h3>

                                        <p>
                                            {item.desc}
                                        </p>

                                    </div>

                                    <button
                                        onClick={() =>
                                            setOpenModal(true)
                                        }
                                    >

                                        <FaDownload />

                                        Download

                                    </button>

                                </div>

                            </div>

                        </div>

                    ))}

                </div>

            </div>

            {/* MODAL */}

            {openModal && (

                <div className={styles.modalOverlay}>

                    <div className={styles.modalBox}>

                        {/* CLOSE */}

                        <button
                            className={styles.closeBtn}
                            onClick={() =>
                                setOpenModal(false)
                            }
                        >

                            <FaTimes />

                        </button>

                        {/* TOP */}

                        <div className={styles.modalHeading}>

                            <span>
                                TECHNOMAC
                            </span>

                            <h2>
                                Download Brochure
                            </h2>

                            <p>
                                Fill your details to
                                download product brochure.
                            </p>

                        </div>

                        {/* FORM */}

                        <form>

                            <div className="row">

                                {/* NAME */}

                                <div className="col-md-6">

                                    <div className={styles.inputGroup}>

                                        <FaUser />

                                        <input
                                            type="text"
                                            placeholder="Customer Name"
                                        />

                                    </div>

                                </div>

                                {/* EMAIL */}

                                <div className="col-md-6">

                                    <div className={styles.inputGroup}>

                                        <FaEnvelope />

                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                        />

                                    </div>

                                </div>

                                {/* PHONE */}

                                <div className="col-md-6">

                                    <div className={styles.inputGroup}>

                                        <FaPhoneAlt />

                                        <input
                                            type="text"
                                            placeholder="Phone Number"
                                        />

                                    </div>

                                </div>

                                {/* COMPANY */}

                                <div className="col-md-6">

                                    <div className={styles.inputGroup}>

                                        <FaBuilding />

                                        <input
                                            type="text"
                                            placeholder="Clinic / Company"
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* BUTTON */}

                            <button
                                type="submit"
                                className={styles.submitBtn}
                            >

                                Download Catalogue

                            </button>

                        </form>

                    </div>

                </div>

            )}

        </section>
    );
}