// "use client";
// import styles from "./ClinicSetup.module.css";
// import Image from "next/image";
// import { FaCheckCircle, FaArrowRight, } from "react-icons/fa";
// import setupImage from "../../../../Images/about-image.png";
// import { useState } from "react";
// import Link from "next/link";
// const services = [
//   "Complete Dental Clinic Planning",
//   "Single Chair & Multi Chair Setup",
//   "Equipment Selection Guidance",
//   "Modern Interior Layout Design",
//   "Installation & Training Support",
//   "After Sales Service & AMC",

// ];

// const process = [

//   {
//     title: "Consultation",
//     desc:
//       "We understand your clinic requirements and goals.",
//   },

//   {
//     title: "Planning",
//     desc:
//       "Our experts design optimized clinic layouts and equipment planning.",
//   },

//   {
//     title: "Installation",
//     desc:
//       "Professional installation with testing and setup support.",
//   },

//   {
//     title: "Training",
//     desc:
//       "Hands-on guidance for smooth clinic operations.",
//   },

// ];

// const chairOption = [

//   {
//     name: "Basic Dental Chair",
//     price: 120000,
//   },

//   {
//     name: "Planet Chair",
//     price: 145000,
//   },

//   {
//     name: "Unicorn Flare Dental Chair",
//     price: 135000,
//   },

//   {
//     name: "Anthos A3",
//     price: 1050000,
//   },

//   {
//     name: "S500 Chair",
//     price: 560000,
//   },

//   {
//     name: "Premium Smart Chair",
//     price: 850000,
//   },

// ];



// export default function ClinicSetup() {
//   const [patients, setPatients] = useState(10);

//   const [avgRevenue, setAvgRevenue] = useState(1500);

//   const [workingDays, setWorkingDays] = useState(22);

//   /* CALCULATIONS */

//   const dailyRevenue =
//     patients * avgRevenue;

//   const monthlyRevenue =
//     dailyRevenue * workingDays;

//   const monthlyPatients =
//     patients * workingDays;

//   const targetBudget =
//     monthlyRevenue * 3;

//   /* FIND CLOSEST CHAIRS */

//   const suggestedChairs =
//     [...chairOption]
//       .sort((a, b) => {

//         return (
//           Math.abs(
//             a.price - targetBudget
//           ) -

//           Math.abs(
//             b.price - targetBudget
//           )
//         );
//       })
//       .filter(
//         (chair) =>
//           chair.price <= targetBudget * 1.5
//       )

//       .slice(0, 2);

//   return (

//     <section className={styles.setupSection}>

//       {/* GLOW */}

//       <div className={styles.glow}></div>

//       <div className="container">

//         {/* HERO */}

//         <div className={styles.heroWrapper}>

//           <div className="row align-items-center">

//             {/* LEFT */}

//             <div className="col-lg-6">

//               <div className={styles.content}>

//                 <span>
//                   TECHNOMAC CLINIC SETUP
//                 </span>

//                 <h1>
//                   Complete Dental
//                   Clinic Setup
//                   Solutions
//                 </h1>

//                 <p>
//                   TECHNOMAC helps dentists
//                   build world-class clinics
//                   with advanced dental
//                   equipment, smart layouts,
//                   modern technology and
//                   reliable service support.
//                   From single-chair setups
//                   to premium multi-specialty
//                   clinics, we provide complete
//                   end-to-end solutions.
//                 </p>

//                 {/* FEATURES */}

//                 <div className={styles.featureList}>

//                   {services.map((item, index) => (

//                     <div
//                       className={styles.featureItem}
//                       key={index}
//                     >

//                       <FaCheckCircle />

//                       <span>
//                         {item}
//                       </span>

//                     </div>

//                   ))}

//                 </div>

//                 {/* BUTTONS */}

//                 <div className={styles.buttonGroup}>

//                   <button
//                     className={styles.primaryBtn}
//                   >

//                     Request Consultation

//                     <FaArrowRight />

//                   </button>

//                   <button
//                     className={styles.secondaryBtn}
//                   >

//                     Download Brochure

//                   </button>

//                 </div>

//               </div>

//             </div>

//             {/* RIGHT */}

//             <div className="col-lg-6">

//               <div className={styles.imageWrapper}>

//                 <Image
//                   src={setupImage}
//                   alt="Clinic Setup"
//                   className={styles.setupImage}
//                 />

//                 {/* FLOAT CARD */}

//                 <div className={styles.floatingCard}>

//                   <h4>
//                     20,000+
//                   </h4>

//                   <p>
//                     Clinics Trusted
//                   </p>

//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>

//         {/* SOLUTION SECTION */}

//         <div className={styles.solutionSection}>

//           <div className={styles.sectionHeading}>

//             <span>
//               COMPLETE SOLUTIONS
//             </span>

//             <h2>
//               End-To-End Clinic
//               Setup Services
//             </h2>

//             <p>
//               TECHNOMAC provides complete
//               dental clinic setup solutions
//               including planning, equipment,
//               interior concepts, installation
//               and after-sales support.
//             </p>

//           </div>

//           <div className="row">

//             <div className="col-lg-4 col-md-6 col-6 mb-4">

//               <div className={styles.solutionCard}>

//                 <h3>
//                   Single Chair Clinics
//                 </h3>

//                 <p>
//                   Perfect setup solutions for
//                   small modern clinics with
//                   optimized equipment and space.
//                 </p>

//               </div>

//             </div>

//             <div className="col-lg-4 col-md-6 col-6 mb-4">

//               <div className={styles.solutionCard}>

//                 <h3>
//                   Multi Chair Clinics
//                 </h3>

//                 <p>
//                   Advanced clinic setup for
//                   multi-specialty practices
//                   and high patient flow.
//                 </p>

//               </div>

//             </div>

//             <div className="col-lg-4 col-md-6 col-6 mb-4">

//               <div className={styles.solutionCard}>

//                 <h3>
//                   Premium Dental Studios
//                 </h3>

//                 <p>
//                   Luxury dental clinic concepts
//                   with smart technology and
//                   modern aesthetics.
//                 </p>

//               </div>

//             </div>

//           </div>

//         </div>

//         {/* WHAT INCLUDED */}

//         <div className={styles.includeSection}>

//           <div className="row align-items-center">

//             <div className="col-lg-6">

//               <div className={styles.includeImage}>

//                 <Image
//                   src={setupImage}
//                   alt="Clinic Design"
//                 />

//               </div>

//             </div>

//             <div className="col-lg-6">

//               <div className={styles.includeContent}>

//                 <span>
//                   WHAT'S INCLUDED
//                 </span>

//                 <h2>
//                   Everything Needed
//                   To Start Your Clinic
//                 </h2>

//                 <p>
//                   We help dentists setup
//                   efficient, modern and
//                   patient-friendly clinics
//                   with complete equipment
//                   and infrastructure support.
//                 </p>

//                 <div className={styles.includeList}>

//                   <div>
//                     ✓ Dental Chair Units
//                   </div>

//                   <div>
//                     ✓ RVG & X-Ray Systems
//                   </div>

//                   <div>
//                     ✓ Air Compressors
//                   </div>

//                   <div>
//                     ✓ Suction Systems
//                   </div>

//                   <div>
//                     ✓ Autoclaves
//                   </div>

//                   <div>
//                     ✓ Interior Planning
//                   </div>

//                   <div>
//                     ✓ Installation Support
//                   </div>

//                   <div>
//                     ✓ Doctor Training
//                   </div>

//                 </div>

//               </div>

//             </div>

//           </div>

//         </div>

//         {/* PROCESS */}

//         <div className={styles.processSection}>

//           <div className={styles.sectionHeading}>

//             <span>
//               WORK PROCESS
//             </span>

//             <h2>
//               How We Setup
//               Your Clinic
//             </h2>

//           </div>

//           <div className="row">

//             {process.map((item, index) => (

//               <div
//                 className="col-lg-3 col-md-6 col-6 mb-4"
//                 key={index}
//               >

//                 <div className={styles.processCard}>

//                   <div className={styles.number}>

//                     0{index + 1}

//                   </div>

//                   <h4>
//                     {item.title}
//                   </h4>

//                   <p>
//                     {item.desc}
//                   </p>

//                 </div>

//               </div>

//             ))}

//           </div>

//         </div>

//         {/* EQUIPMENT */}

//         <div className={styles.equipmentSection}>

//           <div className={styles.sectionHeading}>

//             <span>
//               OUR EQUIPMENT
//             </span>

//             <h2>
//               Advanced Dental
//               Technologies
//             </h2>

//           </div>

//           <div className="row">

//             <div className="col-lg-3 col-md-6 col-6 mb-4">

//               <div className={styles.equipmentCard}>

//                 <h4>
//                   Dental Chairs
//                 </h4>

//               </div>

//             </div>

//             <div className="col-lg-3 col-md-6 col-6 mb-4">

//               <div className={styles.equipmentCard}>

//                 <h4>
//                   RVG Sensors
//                 </h4>

//               </div>

//             </div>

//             <div className="col-lg-3 col-md-6 col-6 mb-4">

//               <div className={styles.equipmentCard}>

//                 <h4>
//                   DC X-Ray Units
//                 </h4>

//               </div>

//             </div>

//             <div className="col-lg-3 col-md-6 col-6 mb-4">

//               <div className={styles.equipmentCard}>

//                 <h4>
//                   Autoclaves
//                 </h4>

//               </div>

//             </div>

//           </div>

//         </div>

//         {/* CTA */}

//         <div className={styles.ctaSection}>

//           <div className={styles.ctaCard}>

//             <span>
//               FREE CONSULTATION
//             </span>

//             <h2>
//               Ready To Build Your
//               Dream Dental Clinic?
//             </h2>

//             <p>
//               Our experts will help you
//               choose the right equipment,
//               optimize clinic layout and
//               setup a modern dental space.
//             </p>

//             <button>
//             <Link className="text-white text-decoration-none" href="/contact">Book Consultation</Link>
//             </button>

//           </div>

//         </div>

//         {/* ROI CALCULATOR */}

//         <div className={styles.calculatorSection}>

//           <div className={styles.sectionHeading}>
//             <h2>
//               Dental Chair ROI
//               Calculator
//             </h2>

//             <p>
//               stimate monthly revenue and see two <b> closest chair options </b> for a budget of <b> 3× monthly revenue.</b>
//             </p>

//           </div>

//           {/* TOP CONTROLS */}

//           <div className="row">

//             {/* PATIENTS */}

//             <div className="col-lg-4 col-6 mb-4">

//               <div className={styles.calcCard}>

//                 <h4>
//                   Patients Treated Per Day
//                 </h4>

//                 <div className={styles.rangeTop}>

//                   <span>
//                     Range: 1-30
//                   </span>

//                   <input
//                     type="number"
//                     value={patients}
//                     onChange={(e) =>
//                       setPatients(
//                         Number(e.target.value)
//                       )
//                     }
//                   />

//                 </div>

//                 <input
//                   type="range"
//                   min="1"
//                   max="30"
//                   value={patients}
//                   onChange={(e) =>
//                     setPatients(
//                       Number(e.target.value)
//                     )
//                   }
//                   className={styles.rangeInput}
//                 />

//               </div>

//             </div>

//             {/* REVENUE */}

//             <div className="col-lg-4 col-6 mb-4">

//               <div className={styles.calcCard}>

//                 <h4>
//                   Avg Revenue Per Patient
//                 </h4>

//                 <div className={styles.rangeTop}>

//                   <span>
//                     ₹500 - ₹20,000
//                   </span>

//                   <input
//                     type="number"
//                     value={avgRevenue}
//                     onChange={(e) =>
//                       setAvgRevenue(
//                         Number(e.target.value)
//                       )
//                     }
//                   />

//                 </div>

//                 <input
//                   type="range"
//                   min="500"
//                   max="20000"
//                   step="500"
//                   value={avgRevenue}
//                   onChange={(e) =>
//                     setAvgRevenue(
//                       Number(e.target.value)
//                     )
//                   }
//                   className={styles.rangeInput}
//                 />

//               </div>

//             </div>

//             {/* DAYS */}

//             <div className="col-lg-4 col-6 mb-4">

//               <div className={styles.calcCard}>

//                 <h4>
//                   Working Days Per Month
//                 </h4>

//                 <div className={styles.rangeTop}>

//                   <span>
//                     Range: 15-30
//                   </span>

//                   <input
//                     type="number"
//                     value={workingDays}
//                     onChange={(e) =>
//                       setWorkingDays(
//                         Number(e.target.value)
//                       )
//                     }
//                   />

//                 </div>

//                 <input
//                   type="range"
//                   min="15"
//                   max="30"
//                   value={workingDays}
//                   onChange={(e) =>
//                     setWorkingDays(
//                       Number(e.target.value)
//                     )
//                   }
//                   className={styles.rangeInput}
//                 />

//               </div>

//             </div>

//           </div>

//           {/* RESULT */}

//           <div className={styles.resultCard}>

//             <div className={styles.resultTop}>

//               <div>

//                 <span>
//                   Estimated Monthly Revenue
//                 </span>

//                 <h2>
//                   ₹
//                   {monthlyRevenue.toLocaleString("en-IN")}
//                 </h2>

//                 <p>
//                   {patients} patients/day × ₹
//                   {avgRevenue} × {workingDays}
//                   days
//                 </p>

//               </div>

//             </div>

//             {/* STATS */}

//             <div className="row">

//               <div className="col-md-4 col-6 mb-3">

//                 <div className={styles.statsCard}>

//                   <span>
//                     Daily Revenue
//                   </span>

//                   <h4>
//                     ₹
//                     {dailyRevenue.toLocaleString("en-IN")}
//                   </h4>

//                 </div>

//               </div>

//               <div className="col-md-4 col-6 mb-3">

//                 <div className={styles.statsCard}>

//                   <span>
//                     Patients / Month
//                   </span>

//                   <h4>
//                     {monthlyPatients}
//                   </h4>

//                 </div>

//               </div>

//               <div className="col-md-4 col-6 mb-3">

//                 <div className={styles.statsCard}>

//                   <span>
//                     Avg Ticket
//                   </span>

//                   <h4>
//                     ₹
//                     {avgRevenue}
//                   </h4>

//                 </div>

//               </div>

//             </div>

//             {/* BUDGET */}

//             <div className="row mt-4">

//               <div className="col-lg-4 mb-4">

//                 <div className={styles.budgetCard}>

//                   <span>
//                     3× Monthly Revenue
//                   </span>

//                   <h3>
//                     ₹
//                     {targetBudget.toLocaleString("en-IN")}
//                   </h3>

//                 </div>

//               </div>

//               {suggestedChairs.map(
//                 (chair, index) => (

//                   <div
//                     className="col-lg-4 mb-4"
//                     key={index}
//                   >

//                     <div className={styles.suggestCard}>

//                       <span>
//                         Suggested Chair
//                       </span>

//                       <h4>
//                         {chair.name}
//                       </h4>

//                       <p>

//                         Price: ₹
//                         {chair.price.toLocaleString("en-IN")}

//                       </p>

//                       <small>

//                         Difference to budget:
//                         ₹
//                         {Math.abs(
//                           targetBudget - chair.price
//                         ).toLocaleString("en-IN")}

//                       </small>

//                     </div>

//                   </div>

//                 )
//               )}

//             </div>

//           </div>

//         </div>

//       </div>

//     </section>
//   );
// }


"use client";
import styles from "./ClinicSetup.module.css";
import Image from "next/image";
import { FaCheckCircle, FaArrowRight, FaWhatsapp, FaFilePdf } from "react-icons/fa";
import setupImage from "../../../../Images/about-image.png";
import { useState, useCallback, useEffect } from "react";
import Link from "next/link";
import { getData } from "../../../services/FetchNodeServices";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";

const services = [
  "Complete Dental Clinic Planning",
  "Installation & Training Support",
  "Single Chair & Multi Chair Setup",
  "Modern Interior Layout Designs",
  "Equipment Selection Guidances",
  "After Sales Service & AMC",
];

const process = [
  { title: "Consultation", desc: "We understand your clinic requirements and goals." },
  { title: "Planning", desc: "Our experts design optimized clinic layouts and equipment planning." },
  { title: "Installation", desc: "Professional installation with testing and setup support." },
  { title: "Training", desc: "Hands-on guidance for smooth clinic operations." },
];

const chairOption = [
  { name: "Basic Dental Chair", price: 120000 },
  { name: "Planet Chair", price: 145000 },
  { name: "Unicorn Flare Dental Chair", price: 135000 },
  { name: "Anthos A3", price: 1050000 },
  { name: "S500 Chair", price: 560000 },
  { name: "Premium Smart Chair", price: 850000 },
];

// ✅ Clamp helper — prevents out-of-range values
const clamp = (val, min, max) => Math.min(Math.max(Number(val) || min, min), max);

export default function ClinicSetup() {
  const [patients, setPatients] = useState(10);
  const [avgRevenue, setAvgRevenue] = useState(1500);
  const [workingDays, setWorkingDays] = useState(22);
  const [chairOptions, setChairOptions] = useState([])
  // ─── Calculations ────────────────────────────────────────────────────────────
  const dailyRevenue = patients * avgRevenue;
  const monthlyRevenue = dailyRevenue * workingDays;
  const monthlyPatients = patients * workingDays;
  const targetBudget = monthlyRevenue * 3;


  const fetchProduct = async () => {
    try {
      let response = await getData(`product/`)
      console.log("RESPONSE==>aa", response)
      if (response.success === true) {
        const mappedProducts = response.data.map((item) => ({
          name: item.name || "",
          price: item.price || 0,
        }));

        setChairOptions(mappedProducts)
      }
    } catch (e) {
      console.log(e)
    }
  }

  useEffect(() => {
    fetchProduct()
  }, [])

  // ─── Suggested chairs ────────────────────────────────────────────────────────
  const suggestedChairs = [...chairOptions]
    .sort((a, b) => Math.abs(a.price - targetBudget) - Math.abs(b.price - targetBudget))
    .filter((chair) => chair.price <= targetBudget * 1.5)
    .slice(0, 2);

  // ─── Download ROI as PDF (print-friendly page) ───────────────────────────────
  const handleDownload = useCallback(() => {
    const content = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8"/>
        <title>Dental Chair ROI Report - TECHNOMAC</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Georgia, serif; padding: 40px; color: #1a1a2e; background: #fff; }
          .header { text-align: center; border-bottom: 3px solid #0066cc; padding-bottom: 20px; margin-bottom: 30px; }
          .header h1 { font-size: 28px; color: #0066cc; }
          .header p  { color: #1E293B; margin-top: 6px; }
          .section   { margin-bottom: 28px; }
          .section h2 { font-size: 16px; color: #0066cc; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; border-left: 4px solid #0066cc; padding-left: 10px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
          .card { background: #f0f6ff; border-radius: 8px; padding: 16px; }
          .card span { font-size: 12px; color: #1E293B; display: block; margin-bottom: 4px; }
          .card h3   { font-size: 22px; color: #0066cc; font-weight: bold; }
          .card p    { font-size: 13px; color: #444; margin-top: 4px; }
          .highlight { background: #0066cc; color: #fff; border-radius: 10px; padding: 20px; text-align: center; margin-bottom: 20px; }
          .highlight span { font-size: 13px; opacity: 0.8; }
          .highlight h2   { font-size: 36px; font-weight: bold; margin: 6px 0; }
          .highlight p    { font-size: 13px; opacity: 0.8; }
          .chair-card { background: #fff3e0; border: 1px solid #ffb347; border-radius: 8px; padding: 16px; }
          .chair-card h4  { font-size: 16px; color: #e65100; margin-bottom: 6px; }
          .chair-card p   { font-size: 13px; color: #444; }
          .chair-card small { color: #888; font-size: 11px; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; color: #999; font-size: 12px; }
          .inputs { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
          .input-card { background: #f9f9f9; border-radius: 8px; padding: 14px; border: 1px solid #e0e0e0; }
          .input-card span { font-size: 11px; color: #888; }
          .input-card h4   { font-size: 18px; color: #333; margin-top: 4px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>TECHNOMAC</h1>
          <p>Dental Chair ROI Calculator Report</p>
          <p style="margin-top:4px; font-size:12px; color:#999;">Generated on ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>

        <div class="section">
          <h2>Input Parameters</h2>
          <div class="inputs">
            <div class="input-card">
              <span>Patients Per Day</span>
              <h4>${patients}</h4>
            </div>
            <div class="input-card">
              <span>Avg Revenue / Patient</span>
              <h4>₹${avgRevenue.toLocaleString("en-IN")}</h4>
            </div>
            <div class="input-card">
              <span>Working Days / Month</span>
              <h4>${workingDays} days</h4>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Revenue Summary</h2>
          <div class="highlight">
            <span>Estimated Monthly Revenue</span>
            <h2>₹${monthlyRevenue.toLocaleString("en-IN")}</h2>
            <p>${patients} patients/day × ₹${avgRevenue.toLocaleString("en-IN")} × ${workingDays} days</p>
          </div>
          <div class="grid">
            <div class="card">
              <span>Daily Revenue</span>
              <h3>₹${dailyRevenue.toLocaleString("en-IN")}</h3>
            </div>
            <div class="card">
              <span>Monthly Patients</span>
              <h3>${monthlyPatients.toLocaleString("en-IN")}</h3>
            </div>
            <div class="card">
              <span>Avg Ticket Size</span>
              <h3>₹${avgRevenue.toLocaleString("en-IN")}</h3>
            </div>
            <div class="card">
              <span>Recommended Budget (3×)</span>
              <h3>₹${targetBudget.toLocaleString("en-IN")}</h3>
            </div>
          </div>
        </div>

        <div class="section">
          <h2>Suggested Dental Chairs</h2>
          <p style="font-size:13px; color:#1E293B; margin-bottom:14px;">
            Based on your budget of ₹${targetBudget.toLocaleString("en-IN")} (3× monthly revenue)
          </p>
          <div class="grid">
            ${suggestedChairs.length > 0
        ? suggestedChairs.map((chair, i) => `
                  <div class="chair-card">
                    <span style="font-size:11px; color:#e65100;">Option ${i + 1}</span>
                    <h4>${chair.name}</h4>
                    <p>Price: ₹${chair.price.toLocaleString("en-IN")}</p>
                    <small>Difference from budget: ₹${Math.abs(targetBudget - chair.price).toLocaleString("en-IN")}</small>
                  </div>`).join("")
        : `<div class="card"><p>No chairs found within budget range.</p></div>`
      }
          </div>
        </div>

        <div class="footer">
          <p>TECHNOMAC Dental Equipment | +91 9311125574 | info@technomac.com</p>
          <p style="margin-top:4px;">Plot no.-88, Pocket-L, Sector 1, Bawana Industrial Area, New Delhi-110039</p>
        </div>
      </body>
      </html>
    `;

    // ✅ Open print dialog — user can save as PDF
    const win = window.open("", "_blank");
    win.document.write(content);
    win.document.close();
    win.focus();
    setTimeout(() => win.print(), 500);
  }, [patients, avgRevenue, workingDays, monthlyRevenue, dailyRevenue, monthlyPatients, targetBudget, suggestedChairs]);

  return (
    <section className={styles.setupSection}>
      <div className={styles.glow}></div>
      <div className="container">
        <Breadcrumb pageName="Clinic Setup" />
        {/* HERO */}
        <div className={styles.heroWrapper}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className={styles.content}>
                <h1>Complete Dental Clinic Setup Solutions</h1>
                <p>
                  TECHNOMAC helps dentists build world-class clinics with advanced
                  dental equipment, smart layouts, modern technology and reliable
                  service support. From single-chair setups to premium
                  multi-specialty clinics, we provide complete end-to-end solutions.
                </p>
                <div className={styles.featureList}>
                  {services.map((item, index) => (
                    <div className={styles.featureItem} key={index}>
                      <FaCheckCircle />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
                {/* <div className={styles.buttonGroup}>
                 
                  <Link href="/contact" className={styles.primaryBtn}>
                    Request Consultation <FaArrowRight />
                  </Link>
                  <a
                    href="https://wa.me/919311125574"
                    target="_blank"
                    rel="noreferrer"
                    className={styles.secondaryBtn}
                  >
                    <FaWhatsapp /> WhatsApp Us
                  </a>
                </div> */}
                <div className={styles.buttonGroup}>

                  <button
                    className={styles.primaryBtn}
                  >
                    <Link href={'/contact'} style={{ color: 'white', textDecoration: 'none' }}>
                      Request Consultation

                      <FaArrowRight />
                    </Link>
                  </button>

                  <button
                    className={styles.secondaryBtn}
                  >

                    Download Brochure

                  </button>

                </div>

              </div>
            </div>
            <div className="col-lg-6">
              <div className={styles.imageWrapper}>
                <Image src={setupImage} alt="Clinic Setup" className={styles.setupImage} />
                <div className={styles.floatingCard}>
                  <h4>20,000+</h4>
                  <p>Clinics Trusted</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SOLUTIONS */}
        <div className={styles.solutionSection}>
          <div className={styles.sectionHeading}>
            <span>COMPLETE SOLUTIONS</span>
            <h2>End-To-End Clinic Setup Services</h2>
            <p>TECHNOMAC provides complete dental clinic setup solutions including planning, equipment, interior concepts, installation and after-sales support.</p>
          </div>
          <div className="row">
            {[
              { title: "Single Chair Clinics", desc: "Perfect setup solutions for small modern clinics with optimized equipment and space." },
              { title: "Multi Chair Clinics", desc: "Advanced clinic setup for multi-specialty practices and high patient flow." },
              { title: "Premium Dental Studios", desc: "Luxury dental clinic concepts with smart technology and modern aesthetics." },
            ].map((item, i) => (
              <div className="col-lg-4 col-md-6 col-6 mb-4" key={i}>
                <div className={styles.solutionCard}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* WHAT'S INCLUDED */}
        <div className={styles.includeSection}>
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className={styles.includeImage}>
                <Image src={setupImage} alt="Clinic Design" />
              </div>
            </div>
            <div className="col-lg-6">
              <div className={styles.includeContent}>
                <span>WHAT'S INCLUDED</span>
                <h2>Everything Needed To Start Your Clinic</h2>
                <p>We help dentists setup efficient, modern and patient-friendly clinics with complete equipment and infrastructure support.</p>
                <div className={styles.includeList}>
                  {["Dental Chair Units", "RVG & X-Ray Systems", "Air Compressors", "Suction Systems", "Autoclaves", "Interior Planning", "Installation Support", "Doctor Training"].map((item, i) => (
                    <div key={i}>✓ {item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROCESS */}
        <div className={styles.processSection}>
          <div className={styles.sectionHeading}>
            <span>WORK PROCESS</span>
            <h2>How We Setup Your Clinic</h2>
          </div>
          <div className="row">
            {process.map((item, index) => (
              <div className="col-lg-3 col-md-6 col-6 mb-4" key={index}>
                <div className={styles.processCard}>
                  <div className={styles.number}>0{index + 1}</div>
                  <h4>{item.title}</h4>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* EQUIPMENT */}
        <div className={styles.equipmentSection}>
          <div className={styles.sectionHeading}>
            <span>OUR EQUIPMENT</span>
            <h2>Advanced Dental Technologies</h2>
          </div>
          <div className="row">
            {["Dental Chairs", "RVG Sensors", "DC X-Ray Units", "Autoclaves"].map((eq, i) => (
              <div className="col-lg-3 col-md-6 col-6 mb-4" key={i}>
                <div className={styles.equipmentCard}><h4>{eq}</h4></div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={styles.ctaSection}>
          <div className={styles.ctaCard}>
            <span>FREE CONSULTATION</span>
            <h2>Ready To Build Your Dream Dental Clinic?</h2>
            <p>Our experts will help you choose the right equipment, optimize clinic layout and setup a modern dental space.</p>
            {/* ✅ Fixed: Link as direct element, not inside button */}
            <button>
              <Link className="text-white text-decoration-none" href="/contact">Book Consultation</Link>
            </button>
          </div>
        </div>

        {/* ROI CALCULATOR */}
        <div className={styles.calculatorSection}>
          <div className={styles.sectionHeading}>
            <h2>Dental Chair ROI Calculator</h2>
            <p>
              Estimate monthly revenue and see two <b>closest chair options</b> for a budget of{" "}
              <b>3× monthly revenue.</b>
            </p>
          </div>

          {/* CONTROLS */}
          <div className="row">
            {[
              { label: "Patients Treated Per Day", value: patients, setter: setPatients, min: 1, max: 30, step: 1, hint: "Range: 1–30", prefix: "" },
              { label: "Avg Revenue Per Patient (₹)", value: avgRevenue, setter: setAvgRevenue, min: 500, max: 20000, step: 500, hint: "₹500 – ₹20,000", prefix: "₹" },
              { label: "Working Days Per Month", value: workingDays, setter: setWorkingDays, min: 15, max: 30, step: 1, hint: "Range: 15–30 days", prefix: "" },
            ].map(({ label, value, setter, min, max, step, hint, prefix }) => (
              <div className="col-lg-4 col-6 mb-4" key={label}>
                <div className={styles.calcCard}>
                  <h4>{label}</h4>
                  <div className={styles.rangeTop}>
                    <span>{hint}</span>
                    <input
                      type="number"
                      value={value}
                      min={min}
                      max={max}
                      // ✅ clamp on blur to prevent out-of-range values
                      onBlur={(e) => setter(clamp(e.target.value, min, max))}
                      onChange={(e) => setter(Number(e.target.value))}
                    />
                  </div>
                  <input
                    type="range"
                    min={min}
                    max={max}
                    step={step}
                    value={value}
                    onChange={(e) => setter(Number(e.target.value))}
                    className={styles.rangeInput}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* RESULTS */}
          <div className={styles.resultCard}>
            <div className={styles.resultTop} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span>Estimated Monthly Revenue</span>
                <h2>₹{monthlyRevenue.toLocaleString("en-IN")}</h2>
                <p>{patients} patients/day × ₹{avgRevenue.toLocaleString("en-IN")} × {workingDays} days</p>
              </div>

              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                  className={styles.primaryBtn}
                  onClick={handleDownload}
                  style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
                >
                  <FaFilePdf /> Download ROI Report
                </button>
              </div>
            </div>

            <div className="row">
              {[
                { label: "Daily Revenue", value: `₹${dailyRevenue.toLocaleString("en-IN")}` },
                { label: "Patients / Month", value: monthlyPatients.toLocaleString("en-IN") },
                { label: "Avg Ticket", value: `₹${avgRevenue.toLocaleString("en-IN")}` },
              ].map(({ label, value }) => (
                <div className="col-md-4 col-6 mb-3" key={label}>
                  <div className={styles.statsCard}>
                    <span>{label}</span>
                    <h4>{value}</h4>
                  </div>
                </div>
              ))}
            </div>

            <div className="row mt-4">
              <div className="col-lg-4 mb-4">
                <div className={styles.budgetCard}>
                  <span>3× Monthly Revenue Budget</span>
                  <h3>₹{targetBudget.toLocaleString("en-IN")}</h3>
                </div>
              </div>

              {suggestedChairs.length > 0 ? (
                suggestedChairs.map((chair, index) => (
                  <div className="col-lg-4 mb-4" key={index}>
                    <div className={styles.suggestCard}>
                      <span>Suggested Chair {index + 1}</span>
                      <h4>{chair.name}</h4>
                      <p>Price: ₹{chair.price.toLocaleString("en-IN")}</p>
                      <small>
                        Difference: ₹{Math.abs(targetBudget - chair.price).toLocaleString("en-IN")}
                      </small>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-lg-8 mb-4">
                  <div className={styles.budgetCard}>
                    <p>Increase your inputs to see chair suggestions.</p>
                  </div>
                </div>
              )}
            </div>

            {/* ✅ DOWNLOAD BUTTON */}
            {/* <div style={{ textAlign: "center", marginTop: "20px" }}>
              <button
                className={styles.primaryBtn}
                onClick={handleDownload}
                style={{ display: "inline-flex", alignItems: "center", gap: "8px" }}
              >
                <FaFilePdf /> Download ROI Report
              </button>
            </div> */}

          </div>
        </div>

      </div>
    </section>
  );
}