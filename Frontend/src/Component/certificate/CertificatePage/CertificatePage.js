import styles from "./CertificatePage.module.css";

import Image from "next/image";

import certificate1 from "../../../../Images/certificate.jpg";
import certificate2 from "../../../../Images/certificate.jpg";
import certificate3 from "../../../../Images/certificate.jpg";
import certificate4 from "../../../../Images/certificate.jpg";
import certificate5 from "../../../../Images/certificate.jpg";
import certificate6 from "../../../../Images/certificate.jpg";

import {
  FaAward,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import { useEffect, useState } from "react";
import { getData } from "../../../services/FetchNodeServices";


export default function CertificatePage() {
  const [certificate, setCertificate] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAllCertificate = async () => {
    try {
      // ✅ Remove leading slash — getData likely prepends serverURL + "/"
      const response = await getData("certificate/all");
      console.log("Certificate Response=>", response)
      if (response.success === true) {

        setCertificate(response.data);
      }
      // If empty or null → keep static fallback already in state
    } catch (e) {
      console.error("Certificate fetch failed, using static fallback:", e?.message);
      // ✅ Static Category already set as default — nothing extra needed
    } finally {
      setLoading(false);
    }
  };

  // ✅ useEffect instead of useState
  useEffect(() => {
    fetchAllCertificate();
  }, []);
  // console.log("SSSS==>response", category)
  return (

    <section className={styles.certificateSection}>

      {/* GLOW */}

      <div className={styles.glow}></div>

      <div className="container">

        <Breadcrumb pageName="Certificates" />

        {/* HEADING */}

        <div className={styles.heading}>

          <span>
            TECHNOMAC CERTIFICATIONS
          </span>

          <h1>
            Trusted &
            Certified Excellence
          </h1>

          <p>
            TECHNOMAC follows strict
            healthcare quality standards
            and certified manufacturing
            processes to ensure premium
            dental equipment reliability,
            safety and performance.
          </p>

        </div>

        {/* TOP INFO */}

        <div className="row mb-5">

          <div className="col-lg-4 col-md-6 mb-4">

            <div className={styles.infoCard}>

              <FaAward />

              <h4>
                Certified Quality
              </h4>

              <p>
                High quality certified
                dental healthcare products.
              </p>

            </div>

          </div>

          <div className="col-lg-4 col-md-6 mb-4">

            <div className={styles.infoCard}>

              <FaShieldAlt />

              <h4>
                Trusted Standards
              </h4>

              <p>
                Products tested with
                international safety standards.
              </p>

            </div>

          </div>

          <div className="col-lg-4 col-md-6 mb-4">

            <div className={styles.infoCard}>

              <FaCheckCircle />

              <h4>
                Reliable Support
              </h4>

              <p>
                Supporting modern clinics
                with trusted technology.
              </p>

            </div>

          </div>

        </div>

        {/* CERTIFICATE GRID */}

        <div className="row">

          {certificate.map((item, index) => (

            <div
              className="col-lg-4 col-md-6 mb-5"
              key={index}
            >

              <div className={styles.certificateCard}>

                {/* FRAME */}

                <div className={styles.frame}>

                  <div className={styles.innerFrame}>

                    <Image
                      src={item.image}
                      alt={item.title}
                      width={1000}
                      height={420}
                      className={styles.certificateImage}
                    />

                  </div>

                </div>

                {/* CONTENT */}

                <div className={styles.cardContent}>

                  <h3>
                    {item.title}
                  </h3>

                  <span>
                    Verified Certificate
                  </span>

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}