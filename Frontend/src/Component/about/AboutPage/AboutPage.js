import { FaCheckCircle, FaTools, FaUserMd, FaShieldAlt } from "react-icons/fa";
import styles from "./AboutPage.module.css";
import aboutImage from "../../../../Images/about-image.png";
import Image from "next/image";
import { FaTruckMedical } from "react-icons/fa6";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";
export default function AboutPage() {

  return (
    <section className={styles.aboutSection}>
      <div className="container">
        <Breadcrumb pageName="About Us" />

          <div className={styles.aboutHero}>
        <div className={styles.heroContent}>
          <h1>
            Engineering Smiles.
            Empowering Dentists.
          </h1>

          <p>
            Made in India, Trusted Nationwide.
          </p>

        </div>
        </div>


      </div>
      {/* INTRO */}

      <div className={styles.aboutIntro}>

        <div className="container">

          <div className="row align-items-center">

            {/* Left */}

            <div className="col-lg-6">

              <div className={styles.introContent}>

                <h2>
                  Built For Modern Dental Clinics
                </h2>

                <p>
                  At TECHNOMAC Medical Systems Pvt. Ltd.,
                  we build dental equipment that puts
                  dentists and patients first.
                </p>

                <p>
                  Since 1998, we’ve been designing,
                  manufacturing, and servicing premium
                  dental equipment from our Delhi NCR
                  facility.
                </p>

                <p>
                  Today, 20,000+ clinics across
                  15 states trust TECHNOMAC to deliver
                  comfort, compliance, and clinical
                  performance every single day.
                </p>

              </div>

            </div>

            {/* Right */}

            <div className="col-lg-6">

              <div className={styles.introImage}>

                <Image src={aboutImage} alt="About TECHNOMAC" height={300} width={600} />

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* WHY CHOOSE */}

      <div className={styles.whySection}>

        <div className="container">

          <div className={styles.sectionHeading}>
            <h2>
              Trusted Across India
            </h2>

          </div>

          <div className="row">

            {/* CARD */}

            <div className="col-lg-3 col-6 mb-4">

              <div className={styles.featureCard}>

                <div className={styles.iconBox}>
                  <FaTools />
                </div>

                <h3>
                  Made In India
                </h3>

                <p>
                  Our equipment is engineered for Indian power conditions, clinic spaces, and high OPD loads. Every product is ISO, CE, BIS, AERB and CDSCO approved, so you clear audits without stress.
                </p>

              </div>

            </div>

            {/* CARD */}

            <div className="col-lg-3 col-6 mb-4">

              <div className={styles.featureCard}>

                <div className={styles.iconBox}>
                  <FaUserMd />
                </div>

                <h3>
                  Dentist Tested
                </h3>

                <p>
                Before launch, every chair, autoclave, and X-ray unit is tested by practicing MDS doctors. We solve real problems: back pain from old chairs, blurry apex in RCTs, formalin fumes in sterilization, and low case acceptance.
                </p>

              </div>

            </div>

            {/* CARD */}

            <div className="col-lg-3 col-6 mb-4">

              <div className={styles.featureCard}>

                <div className={styles.iconBox}>
                  <FaShieldAlt />
                </div>

                <h3>
                  Certified Quality
                </h3>

                <p>
                  We use imported motors in our fully motorised chairs, 0.4mm focal spot tubes in our DC X-rays, and high-vacuum pumps for suctions. 85% indigenous components with global critical parts — no rebadged imports.
                </p>

              </div>

            </div>

            {/* CARD */}

            <div className="col-lg-3 col-6 mb-4">

              <div className={styles.featureCard}>

                <div className={styles.iconBox}>
                  <FaTruckMedical />
                </div>

                <h3>
                  Fast Service Support
                </h3>

                <p>
                Headquartered in Delhi NCR, we provide 1-year onsite warranty, same-day demos, and hands-on training. When you call, you talk to an engineer, not a call center. Spare parts reach you in 48 hours, not 4 weeks.
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* PRODUCTS */}

      <div className={styles.productSection}>

        <div className="container">

          <div className={styles.sectionHeading}>
            <h2>
              Complete Dental Equipment Range
            </h2>

          </div>

          <div className={styles.productGrid}>

            {[
              "DC Portable X-ray Units",
              "Fully Motorised Dental Chairs",
              "Autoclaves",
              "AC X-Ray Floor Mount Units",
              "Wireless Intraoral Cameras",
              "UV-C Instrument Storage Cabinets",
              "RVG Sensor",
              "Motorised Suction",
              "Doctor Stool",
              "Patient Stool",
              "Air Compressor",
            ].map((item, index) => (

              <div
                className={styles.productItem}
                key={index}
              >

                <FaCheckCircle />

                <span>{item}</span>

              </div>

            ))}

          </div>

        </div>

      </div> 

      {/* COMMITMENT */}

      <div className={styles.commitmentSection}>

        <div className="container">

          <div className={styles.commitmentBox}>

            <span>
              Our Commitment
            </span>

            <h2>
              Powering Clinics That
              Refuse To Compromise
            </h2>

            <p>
              We don’t just manufacture machines.
              We reduce downtime, increase patient
              trust, and help dentists build clinics
              they’re proud of.
            </p>

            <p>
              from a new single-chair setup in Ghaziabad to a 10-chair multi-specialty center in South Delhi, TECHNOMAC powers practices that refuse to compromise.
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}