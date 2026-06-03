import styles from "./EnquirySection.module.css";

import {
  FaPhoneAlt,
  FaEnvelope,
  FaPaperPlane,
  FaUser,
} from "react-icons/fa";

export default function EnquirySection() {

  return (

    <section className={styles.enquirySection}>

      <div className="container">

        <div className={styles.enquiryCard}>

          {/* LEFT */}

          <div className={styles.content}>

            <span>
              QUICK SUPPORT
            </span>

            <h2>
              Stay Connected
              With TECHNOMAC
            </h2>

            <p>
              Get product updates, dental
              equipment offers and latest
              healthcare innovations.
            </p>

          </div>

          {/* RIGHT */}

          <div className={styles.formWrapper}>

            <form className={styles.form}>

              <div className="row">

                {/* NAME */}

                <div className="col-md-6">

                  <div className={styles.inputGroup}>

                    <FaUser />

                    <input
                      type="text"
                      placeholder="Name*"
                    />

                  </div>

                </div>

                {/* EMAIL */}

                <div className="col-md-6">

                  <div className={styles.inputGroup}>

                    <FaEnvelope />

                    <input
                      type="email"
                      placeholder="Email*"
                    />

                  </div>

                </div>

                {/* PHONE */}

                <div className="col-md-6">

                  <div className={styles.inputGroup}>

                    <FaPhoneAlt />

                    <input
                      type="text"
                      placeholder="Phone*"
                    />

                  </div>

                </div>

                {/* MESSAGE */}

                <div className="col-md-6">

                  <div className={styles.inputGroup}>

                    <FaPaperPlane />

                    <input
                      type="text"
                      placeholder="Message"
                    />

                  </div>

                </div>

              </div>

              {/* BUTTON */}

              <button
                type="submit"
                className={styles.submitBtn}
              >

                Submit Enquiry →

              </button>

            </form>

          </div>

        </div>

      </div>

    </section>
  );
}