import styles from "./CTASection.module.css";

import {
  FaArrowRight,
} from "react-icons/fa";

export default function CTASection() {

  return (

    <section className={styles.ctaSection}>

      {/* OVERLAY */}

      <div className={styles.overlay}></div>

      <div className="container">

        <div className={styles.content}>

          <span>
            Premium Dental Solutions
          </span>

          <h2>
            Start your journey to
            better health and care now
          </h2>

          <p>
            Advanced dental equipment,
            modern clinic setup and trusted
            healthcare solutions for every dentist.
          </p>

          <button className={styles.ctaBtn}>

            Book For Visit Now

            <FaArrowRight />

          </button>

        </div>

      </div>

    </section>
  );
}