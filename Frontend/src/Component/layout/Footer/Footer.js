// import Link from "next/link";
// import {
//   FaPhoneAlt,
//   FaEnvelope,
//   FaFacebookF,
//   FaInstagram,
//   FaLinkedinIn,
//   FaYoutube,
//   FaMapMarkerAlt,
// } from "react-icons/fa";

// import styles from "./Footer.module.css";
// import Image from "next/image";
// import Logo from "../../../../Images/logo.png";
// import { useState } from "react";

// export default function Footer() {
//   const [email, setEmail] = useState("");
//   const [status, setStatus] = useState(null); // 'success' | 'error' | 'loading'
//   const [msg, setMsg] = useState("");

//   const handleSubscribe = async (e) => {
//     e.preventDefault();

//     if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
//       setStatus("error");
//       setMsg("Please enter a valid email address.");
//       return;
//     }

//     setStatus("loading");
//     try {
//       const res = await postData("newsletter/subscribe", { email: email.trim() });
//       if (res?.success) {
//         setStatus("success");
//         setMsg("Thank you for subscribing!");
//         setEmail("");
//       } else {
//         setStatus("error");
//         setMsg(res?.message || "Subscription failed. Please try again.");
//       }
//     } catch {
//       setStatus("error");
//       setMsg("Something went wrong. Please try again.");
//     }
//   };

//   return (
//     <footer className={styles.footer}>

//       <div className="container">

//         {/* Top Footer */}

//         <div className={styles.footerTop}>

//           <div className="row">

//             {/* Company Info */}

//             <div className="col-lg-3 col-md-6 mb-4">

//               <div className={styles.footerAbout}>

//                 {/* <h2>
//                   Dental<span>Loom</span>
//                 </h2> */}
//                 <Image src={Logo} alt="DentalLoom Logo" width={150} objectFit="cover" height={50} />

//                 <p>
//                   Premium dental healthcare equipment
//                   supplier providing advanced clinic
//                   setup solutions and modern dental
//                   products for professionals.
//                 </p>

//                 <div className={styles.socialIcons}>

//                   <a href="#">
//                     <FaFacebookF />
//                   </a>

//                   <a href="#">
//                     <FaInstagram />
//                   </a>

//                   <a href="#">
//                     <FaLinkedinIn />
//                   </a>

//                   <a href="#">
//                     <FaYoutube />
//                   </a>

//                 </div>

//               </div>

//             </div>

//             {/* Quick Links */}

//             <div className="col-lg-2 col-md-6 mb-4">

//               <div className={styles.footerLinks}>

//                 <h4>
//                   Quick Links
//                 </h4>

//                 <ul>

//                   <li>
//                     <Link href="/">
//                       Home
//                     </Link>
//                   </li>

//                   <li>
//                     <Link href="/about">
//                       About
//                     </Link>
//                   </li>

//                   <li>
//                     <Link href="/updates">
//                       New Updates
//                     </Link>
//                   </li>

//                   <li>
//                     <Link href="/blogs">
//                       Blog
//                     </Link>
//                   </li>

//                   <li>
//                     <Link href="/products">
//                       Products
//                     </Link>
//                   </li>

//                   <li>
//                     <Link href="/contact">
//                       Contact
//                     </Link>
//                   </li>

//                   <li>
//                     <Link href="/privacy-policy">
//                       Privacy Policy
//                     </Link>
//                   </li>

//                 </ul>

//               </div>

//             </div>
//             {/* Contact */}

//             <div className="col-lg-3 col-md-6 mb-4">

//               <div className={styles.footerContact}>

//                 <h4>
//                   Contact Us
//                 </h4>
//                 <ul>
//                   <li>
//                     <FaPhoneAlt />
//                     <a href="tel:+919311125574">
//                       +91 9311125574
//                     </a>
//                   </li>
//                   <li>
//                     <FaEnvelope />
//                     <a href="mailto:info@dentalloom.com">
//                       info@dentalloom.com
//                     </a>
//                   </li>
//                   <li>
//                     <FaMapMarkerAlt />
//                     <span>
//                       Plot no.-88, Pocket- L, Sector 1, Bawana Industrial Area, DSIIDC Sub-city, New Delhi-110039, India
//                     </span>
//                   </li>
//                 </ul>
//               </div>

//             </div>

//             {/* Newslater */}

//             <div className="col-lg-4 col-md-6 mb-4">

//               <div className={styles.newsletterBox}>
//                 <h4>
//                   Subscribe to Our
//                   Newsletter
//                 </h4>

//                 <p>
//                   Get latest dental equipment
//                   updates, offers and clinic
//                   setup innovations.
//                 </p>

//                 {/* FORM */}

//                 <form className={styles.newsletterForm}>
//                   {status === "success" ? (
//                     <div className={styles.successMsg}>
//                       <FaCheckCircle />
//                       {msg}
//                     </div>
//                   ) :
//                     <div className={styles.inputGroup}>
//                       <input type="email" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} required />
//                       <button type="submit" onClick={handleSubscribe}>Subscrib</button>
//                     </div>}
//                 </form>

//                 {/* BOTTOM TEXT */}

//                 <small>No spam. Only useful updates. </small>

//               </div>

//             </div>


//           </div>

//         </div>

//         {/* Bottom Footer */}

//         <div className={styles.footerBottom}>

//           <p>
//             © 2026 Technomac. All Rights Reserved.
//           </p>

//         </div>

//       </div>

//     </footer>
//   );
// }

import Link from "next/link";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaMapMarkerAlt,
  FaCheckCircle,
} from "react-icons/fa";

import styles from "./Footer.module.css";
import Image from "next/image";
import Logo from "../../../../Images/logo.png";
import { useState } from "react";
import { postData } from "../../../services/FetchNodeServices"; // ✅ was missing

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // 'success' | 'error' | 'loading'
  const [msg, setMsg] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // ✅ Validation
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setStatus("error");
      setMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");
    try {
      const res = await postData("subscribe/", { email: email.trim() });
      console.log("res===>", res)
      if (res?.success) {
        setStatus("success");
        setMsg("Thank you for subscribing!");
        setEmail("");
      } else {
        setStatus("error");
        setMsg(res?.message || "Subscription failed. Please try again.");
      }
    } catch {
      setStatus("error");
      setMsg("Something went wrong. Please try again.");
    }
  };

  return (
    <footer className={styles.footer}>
      <div className="container">

        {/* Top Footer */}
        <div className={styles.footerTop}>
          <div className="row">

            {/* Company Info */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className={styles.footerAbout}>
                <Image
                  src={Logo}
                  alt="TECHNOMAC Logo"
                  width={150}
                  height={50}
                  style={{ objectFit: "cover" }}
                />
                <p>
                  Premium Medical healthcare equipment’s manufacturer &
                  supplier providing advanced Dental setup solutions and
                  modern healthcare products for professionals.
                </p>
                <div className={styles.socialIcons}>
                  <a href="#" aria-label="Facebook"><FaFacebookF /></a>
                  <a href="#" aria-label="Instagram"><FaInstagram /></a>
                  <a href="#" aria-label="LinkedIn"><FaLinkedinIn /></a>
                  <a href="#" aria-label="YouTube"><FaYoutube /></a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="col-lg-2 col-md-6 mb-4">
              <div className={styles.footerLinks}>
                <h4>Quick Links</h4>
                <ul>
                  <li><Link href="/">Home</Link></li>
                  <li><Link href="/about">About</Link></li>
                  <li><Link href="/updates">New Updates</Link></li>
                  <li><Link href="/blogs">Blog</Link></li>
                  <li><Link href="/products">Products</Link></li>
                  <li><Link href="/contact">Contact</Link></li>
                  <li><Link href="/privacy-policy">Privacy Policy</Link></li>
                  <li><Link href="/certificates">Certificates</Link></li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div className="col-lg-3 col-md-6 mb-4">
              <div className={styles.footerContact}>
                <h4>Contact Us</h4>
                <ul>
                  <li>
                    <FaPhoneAlt />
                    <a href="tel:+919311125574">+91 9311125574</a>
                  </li>
                  <li>
                    <FaEnvelope />
                    <a href="mailto:info@technomac.in">info@technomac.in</a>
                  </li>
                  <li>
                    <FaMapMarkerAlt style={{ fontSize: "40px" }} />
                    <span>
                      Plot no.-88, Pocket-L, Sector 1, Bawana Industrial Area,
                      DSIIDC Sub-city, New Delhi-110039, India
                    </span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Newsletter */}
            <div className="col-lg-4 col-md-6 mb-4">
              <div className={styles.newsletterBox}>
                <h4>Subscribe to Our Newsletter</h4>
                <p>
                  Get product updates, medical and dental equipment offers,
                  and the latest healthcare innovations.
                </p>

                {/* ✅ Fixed form — onSubmit on form, not onClick on button */}
                <form className={styles.newsletterForm} onSubmit={handleSubscribe} noValidate>
                  {status === "success" ? (
                    <div className={styles.successMsg}>
                      <FaCheckCircle />
                      <span>{msg}</span>
                    </div>
                  ) : (
                    <>
                      <div className={styles.inputGroup}>
                        <input
                          type="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (status === "error") setStatus(null); // clear error on type
                          }}
                          required
                        />
                        <button type="submit" disabled={status === "loading"}>
                          {status === "loading" ? "Subscribing..." : "Subscribe"}
                        </button>
                      </div>
                      {/* ✅ Error message shown below input */}
                      {status === "error" && (
                        <p className={styles.errorMsg}>{msg}</p>
                      )}
                    </>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Footer */}
        <div className={styles.footerBottom}>
          <p>© {new Date().getFullYear()} Technomac. All Rights Reserved.</p>
        </div>

      </div>
    </footer>
  );
}