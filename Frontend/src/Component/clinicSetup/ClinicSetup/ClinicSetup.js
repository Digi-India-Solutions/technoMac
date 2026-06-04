"use client";
import styles from "./ClinicSetup.module.css";
import Image from "next/image";
import { FaCheckCircle, FaArrowRight, } from "react-icons/fa";
import setupImage from "../../../../Images/about-image.png";
import { useState } from "react";
import Link from "next/link";
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

const chairOptions = [

  {
    name: "Basic Dental Chair",
    price: 120000,
  },

  {
    name: "Planet Chair",
    price: 145000,
  },

  {
    name: "Unicorn Flare Dental Chair",
    price: 135000,
  },

  {
    name: "Anthos A3",
    price: 1050000,
  },

  {
    name: "S500 Chair",
    price: 560000,
  },

  {
    name: "Premium Smart Chair",
    price: 850000,
  },

];



export default function ClinicSetup() {
  const [patients, setPatients] = useState(10);

  const [avgRevenue, setAvgRevenue] = useState(1500);

  const [workingDays, setWorkingDays] = useState(22);

  /* CALCULATIONS */

  const dailyRevenue =
    patients * avgRevenue;

  const monthlyRevenue =
    dailyRevenue * workingDays;

  const monthlyPatients =
    patients * workingDays;

  const targetBudget =
    monthlyRevenue * 3;

  /* FIND CLOSEST CHAIRS */

  const suggestedChairs =
    [...chairOptions]
      .sort((a, b) => {

        return (
          Math.abs(
            a.price - targetBudget
          ) -

          Math.abs(
            b.price - targetBudget
          )
        );
      })
      .filter(
        (chair) =>
          chair.price <= targetBudget * 1.5
      )

      .slice(0, 2);

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
            <Link className="text-white text-decoration-none" href="/contact">Book Consultation</Link>
            </button>

          </div>

        </div>

        {/* ROI CALCULATOR */}

        <div className={styles.calculatorSection}>

          <div className={styles.sectionHeading}>
            <h2>
              Dental Chair ROI
              Calculator
            </h2>

            <p>
              stimate monthly revenue and see two <b> closest chair options </b> for a budget of <b> 3× monthly revenue.</b>
            </p>

          </div>

          {/* TOP CONTROLS */}

          <div className="row">

            {/* PATIENTS */}

            <div className="col-lg-4 col-6 mb-4">

              <div className={styles.calcCard}>

                <h4>
                  Patients Treated Per Day
                </h4>

                <div className={styles.rangeTop}>

                  <span>
                    Range: 1-30
                  </span>

                  <input
                    type="number"
                    value={patients}
                    onChange={(e) =>
                      setPatients(
                        Number(e.target.value)
                      )
                    }
                  />

                </div>

                <input
                  type="range"
                  min="1"
                  max="30"
                  value={patients}
                  onChange={(e) =>
                    setPatients(
                      Number(e.target.value)
                    )
                  }
                  className={styles.rangeInput}
                />

              </div>

            </div>

            {/* REVENUE */}

            <div className="col-lg-4 col-6 mb-4">

              <div className={styles.calcCard}>

                <h4>
                  Avg Revenue Per Patient
                </h4>

                <div className={styles.rangeTop}>

                  <span>
                    ₹500 - ₹20,000
                  </span>

                  <input
                    type="number"
                    value={avgRevenue}
                    onChange={(e) =>
                      setAvgRevenue(
                        Number(e.target.value)
                      )
                    }
                  />

                </div>

                <input
                  type="range"
                  min="500"
                  max="20000"
                  step="500"
                  value={avgRevenue}
                  onChange={(e) =>
                    setAvgRevenue(
                      Number(e.target.value)
                    )
                  }
                  className={styles.rangeInput}
                />

              </div>

            </div>

            {/* DAYS */}

            <div className="col-lg-4 col-6 mb-4">

              <div className={styles.calcCard}>

                <h4>
                  Working Days Per Month
                </h4>

                <div className={styles.rangeTop}>

                  <span>
                    Range: 15-30
                  </span>

                  <input
                    type="number"
                    value={workingDays}
                    onChange={(e) =>
                      setWorkingDays(
                        Number(e.target.value)
                      )
                    }
                  />

                </div>

                <input
                  type="range"
                  min="15"
                  max="30"
                  value={workingDays}
                  onChange={(e) =>
                    setWorkingDays(
                      Number(e.target.value)
                    )
                  }
                  className={styles.rangeInput}
                />

              </div>

            </div>

          </div>

          {/* RESULT */}

          <div className={styles.resultCard}>

            <div className={styles.resultTop}>

              <div>

                <span>
                  Estimated Monthly Revenue
                </span>

                <h2>
                  ₹
                  {monthlyRevenue.toLocaleString("en-IN")}
                </h2>

                <p>
                  {patients} patients/day × ₹
                  {avgRevenue} × {workingDays}
                  days
                </p>

              </div>

            </div>

            {/* STATS */}

            <div className="row">

              <div className="col-md-4 col-6 mb-3">

                <div className={styles.statsCard}>

                  <span>
                    Daily Revenue
                  </span>

                  <h4>
                    ₹
                    {dailyRevenue.toLocaleString("en-IN")}
                  </h4>

                </div>

              </div>

              <div className="col-md-4 col-6 mb-3">

                <div className={styles.statsCard}>

                  <span>
                    Patients / Month
                  </span>

                  <h4>
                    {monthlyPatients}
                  </h4>

                </div>

              </div>

              <div className="col-md-4 col-6 mb-3">

                <div className={styles.statsCard}>

                  <span>
                    Avg Ticket
                  </span>

                  <h4>
                    ₹
                    {avgRevenue}
                  </h4>

                </div>

              </div>

            </div>

            {/* BUDGET */}

            <div className="row mt-4">

              <div className="col-lg-4 mb-4">

                <div className={styles.budgetCard}>

                  <span>
                    3× Monthly Revenue
                  </span>

                  <h3>
                    ₹
                    {targetBudget.toLocaleString("en-IN")}
                  </h3>

                </div>

              </div>

              {suggestedChairs.map(
                (chair, index) => (

                  <div
                    className="col-lg-4 mb-4"
                    key={index}
                  >

                    <div className={styles.suggestCard}>

                      <span>
                        Suggested Chair
                      </span>

                      <h4>
                        {chair.name}
                      </h4>

                      <p>

                        Price: ₹
                        {chair.price.toLocaleString("en-IN")}

                      </p>

                      <small>

                        Difference to budget:
                        ₹
                        {Math.abs(
                          targetBudget - chair.price
                        ).toLocaleString("en-IN")}

                      </small>

                    </div>

                  </div>

                )
              )}

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}