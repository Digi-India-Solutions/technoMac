import styles from "./ClinicSetup.module.css";

import Image from "next/image";

import {
  FaCheckCircle,
  FaArrowRight,
} from "react-icons/fa";

import setupImage from "../../../../Images/about-image.png";

const services = [

  "Complete Dental Clinic Planning",
  "Single Chair & Multi Chair Setup",
  "Equipment Selection Guidance",
  "Modern Interior Layout Design",
  "Installation & Training Support",
  "After Sales Service & AMC",

];

const process = [

  {
    title: "Consultation",
    desc:
      "We understand your clinic requirements and goals.",
  },

  {
    title: "Planning",
    desc:
      "Our experts design optimized clinic layouts and equipment planning.",
  },

  {
    title: "Installation",
    desc:
      "Professional installation with testing and setup support.",
  },

  {
    title: "Training",
    desc:
      "Hands-on guidance for smooth clinic operations.",
  },

];

export default function ClinicSetup() {

  return (

    <section className={styles.setupSection}>

      {/* GLOW */}

      <div className={styles.glow}></div>

      <div className="container">

        {/* HERO */}

        <div className={styles.heroWrapper}>

          <div className="row align-items-center">

            {/* LEFT */}

            <div className="col-lg-6">

              <div className={styles.content}>

                <span>
                  TECHNOMAC CLINIC SETUP
                </span>

                <h1>
                  Complete Dental
                  Clinic Setup
                  Solutions
                </h1>

                <p>
                  TECHNOMAC helps dentists
                  build world-class clinics
                  with advanced dental
                  equipment, smart layouts,
                  modern technology and
                  reliable service support.
                  From single-chair setups
                  to premium multi-specialty
                  clinics, we provide complete
                  end-to-end solutions.
                </p>

                {/* FEATURES */}

                <div className={styles.featureList}>

                  {services.map((item, index) => (

                    <div
                      className={styles.featureItem}
                      key={index}
                    >

                      <FaCheckCircle />

                      <span>
                        {item}
                      </span>

                    </div>

                  ))}

                </div>

                {/* BUTTONS */}

                <div className={styles.buttonGroup}>

                  <button
                    className={styles.primaryBtn}
                  >

                    Request Consultation

                    <FaArrowRight />

                  </button>

                  <button
                    className={styles.secondaryBtn}
                  >

                    Download Brochure

                  </button>

                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="col-lg-6">

              <div className={styles.imageWrapper}>

                <Image
                  src={setupImage}
                  alt="Clinic Setup"
                  className={styles.setupImage}
                />

                {/* FLOAT CARD */}

                <div className={styles.floatingCard}>

                  <h4>
                    20,000+
                  </h4>

                  <p>
                    Clinics Trusted
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* SOLUTION SECTION */}

        <div className={styles.solutionSection}>

          <div className={styles.sectionHeading}>

            <span>
              COMPLETE SOLUTIONS
            </span>

            <h2>
              End-To-End Clinic
              Setup Services
            </h2>

            <p>
              TECHNOMAC provides complete
              dental clinic setup solutions
              including planning, equipment,
              interior concepts, installation
              and after-sales support.
            </p>

          </div>

          <div className="row">

            <div className="col-lg-4 col-md-6 col-6 mb-4">

              <div className={styles.solutionCard}>

                <h3>
                  Single Chair Clinics
                </h3>

                <p>
                  Perfect setup solutions for
                  small modern clinics with
                  optimized equipment and space.
                </p>

              </div>

            </div>

            <div className="col-lg-4 col-md-6 col-6 mb-4">

              <div className={styles.solutionCard}>

                <h3>
                  Multi Chair Clinics
                </h3>

                <p>
                  Advanced clinic setup for
                  multi-specialty practices
                  and high patient flow.
                </p>

              </div>

            </div>

            <div className="col-lg-4 col-md-6 col-6 mb-4">

              <div className={styles.solutionCard}>

                <h3>
                  Premium Dental Studios
                </h3>

                <p>
                  Luxury dental clinic concepts
                  with smart technology and
                  modern aesthetics.
                </p>

              </div>

            </div>

          </div>

        </div>

        {/* WHAT INCLUDED */}

        <div className={styles.includeSection}>

          <div className="row align-items-center">

            <div className="col-lg-6">

              <div className={styles.includeImage}>

                <Image
                  src={setupImage}
                  alt="Clinic Design"
                />

              </div>

            </div>

            <div className="col-lg-6">

              <div className={styles.includeContent}>

                <span>
                  WHAT'S INCLUDED
                </span>

                <h2>
                  Everything Needed
                  To Start Your Clinic
                </h2>

                <p>
                  We help dentists setup
                  efficient, modern and
                  patient-friendly clinics
                  with complete equipment
                  and infrastructure support.
                </p>

                <div className={styles.includeList}>

                  <div>
                    ✓ Dental Chair Units
                  </div>

                  <div>
                    ✓ RVG & X-Ray Systems
                  </div>

                  <div>
                    ✓ Air Compressors
                  </div>

                  <div>
                    ✓ Suction Systems
                  </div>

                  <div>
                    ✓ Autoclaves
                  </div>

                  <div>
                    ✓ Interior Planning
                  </div>

                  <div>
                    ✓ Installation Support
                  </div>

                  <div>
                    ✓ Doctor Training
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* PROCESS */}

        <div className={styles.processSection}>

          <div className={styles.sectionHeading}>

            <span>
              WORK PROCESS
            </span>

            <h2>
              How We Setup
              Your Clinic
            </h2>

          </div>

          <div className="row">

            {process.map((item, index) => (

              <div
                className="col-lg-3 col-md-6 col-6 mb-4"
                key={index}
              >

                <div className={styles.processCard}>

                  <div className={styles.number}>

                    0{index + 1}

                  </div>

                  <h4>
                    {item.title}
                  </h4>

                  <p>
                    {item.desc}
                  </p>

                </div>

              </div>

            ))}

          </div>

        </div>

        {/* EQUIPMENT */}

        <div className={styles.equipmentSection}>

          <div className={styles.sectionHeading}>

            <span>
              OUR EQUIPMENT
            </span>

            <h2>
              Advanced Dental
              Technologies
            </h2>

          </div>

          <div className="row">

            <div className="col-lg-3 col-md-6 col-6 mb-4">

              <div className={styles.equipmentCard}>

                <h4>
                  Dental Chairs
                </h4>

              </div>

            </div>

            <div className="col-lg-3 col-md-6 col-6 mb-4">

              <div className={styles.equipmentCard}>

                <h4>
                  RVG Sensors
                </h4>

              </div>

            </div>

            <div className="col-lg-3 col-md-6 col-6 mb-4">

              <div className={styles.equipmentCard}>

                <h4>
                  DC X-Ray Units
                </h4>

              </div>

            </div>

            <div className="col-lg-3 col-md-6 col-6 mb-4">

              <div className={styles.equipmentCard}>

                <h4>
                  Autoclaves
                </h4>

              </div>

            </div>

          </div>

        </div>

        {/* CTA */}

        <div className={styles.ctaSection}>

          <div className={styles.ctaCard}>

            <span>
              FREE CONSULTATION
            </span>

            <h2>
              Ready To Build Your
              Dream Dental Clinic?
            </h2>

            <p>
              Our experts will help you
              choose the right equipment,
              optimize clinic layout and
              setup a modern dental space.
            </p>

            <button>

              Book Consultation

            </button>

          </div>

        </div>

      </div>

    </section>
  );
}