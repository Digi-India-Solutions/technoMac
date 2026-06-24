import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
import styles from "./PrivacyPolicy.module.css";

export default function PrivacyPolicy() {

  return (

    <section className={styles.privacySection}>

      {/* GLOW */}

      <div className={styles.glow}></div>

      <div className="container">

        <Breadcrumb pageName="Privacy Policy" />

        <div className={styles.heading}>

          <span className="hero-tag">
            TECHNOMAC POLICY
          </span>

          <h1>
            Privacy Policy
          </h1>

          <p>
            Your privacy is important to us.
            TECHNOMAC Medical Systems Pvt. Ltd.
            is committed to protecting your
            personal information and ensuring
            transparency in how we collect,
            use and protect your data.
          </p>

        </div>

        {/* CONTENT */}

        <div className={styles.policyWrapper}>

          {/* ITEM */}

          <div className={styles.policyCard}>

            <h3>
              1. Information We Collect
            </h3>

            <p>
              We may collect personal details
              such as your name, email address,
              phone number, company information,
              clinic details and enquiry data
              when you contact us or submit forms
              through our website.
            </p>

          </div>

          {/* ITEM */}

          <div className={styles.policyCard}>

            <h3>
              2. How We Use Your Information
            </h3>

            <p>
              Your information helps us provide
              product support, respond to
              enquiries, improve services,
              share updates about dental
              equipment and deliver a better
              customer experience.
            </p>

          </div>

          {/* ITEM */}

          <div className={styles.policyCard}>

            <h3>
              3. Data Protection
            </h3>

            <p>
              TECHNOMAC follows industry-standard
              security measures to protect your
              personal information against
              unauthorized access, disclosure
              or misuse.
            </p>

          </div>

          {/* ITEM */}

          <div className={styles.policyCard}>

            <h3>
              4. Cookies & Analytics
            </h3>

            <p>
              Our website may use cookies and
              analytics tools to improve user
              experience, monitor website
              performance and understand visitor
              behavior.
            </p>

          </div>

          {/* ITEM */}

          <div className={styles.policyCard}>

            <h3>
              5. Third-Party Services
            </h3>

            <p>
              We may use trusted third-party
              services for hosting, analytics,
              communication and support. These
              services are required to maintain
              website functionality and customer
              assistance.
            </p>

          </div>

          {/* ITEM */}

          <div className={styles.policyCard}>

            <h3>
              6. Contact Information
            </h3>

            <p>
              If you have questions regarding
              our privacy policy or your data,
              please contact TECHNOMAC Medical
              Systems Pvt. Ltd. through our
              official support channels.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}