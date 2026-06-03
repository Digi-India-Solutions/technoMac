import Link from "next/link";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaMapMarkerAlt,
} from "react-icons/fa";

import styles from "./Footer.module.css";
import Image from "next/image";
import Logo from "../../../../Images/logo.png";

export default function Footer() {

  return (
    <footer className={styles.footer}>

      <div className="container">

        {/* Top Footer */}

        <div className={styles.footerTop}>

          <div className="row">

            {/* Company Info */}

            <div className="col-lg-3 col-md-6 mb-4">

              <div className={styles.footerAbout}>

                {/* <h2>
                  Dental<span>Loom</span>
                </h2> */}
                <Image src={Logo} alt="DentalLoom Logo" width={150} objectFit="cover" height={50} />

                <p>
                  Premium dental healthcare equipment
                  supplier providing advanced clinic
                  setup solutions and modern dental
                  products for professionals.
                </p>

                <div className={styles.socialIcons}>

                  <a href="#">
                    <FaFacebookF />
                  </a>

                  <a href="#">
                    <FaInstagram />
                  </a>

                  <a href="#">
                    <FaLinkedinIn />
                  </a>

                  <a href="#">
                    <FaYoutube />
                  </a>

                </div>

              </div>

            </div>

            {/* Quick Links */}

            <div className="col-lg-2 col-md-6 mb-4">

              <div className={styles.footerLinks}>

                <h4>
                  Quick Links
                </h4>

                <ul>

                  <li>
                    <Link href="/">
                      Home
                    </Link>
                  </li>

                  <li>
                    <Link href="/about">
                      About
                    </Link>
                  </li>

                  <li>
                  <Link href="/updates">
                    New Updates   
                  </Link>
                  </li>

                  <li>
                  <Link href="/blogs">
                    Blog  
                  </Link>
                  </li>

                  <li>
                    <Link href="/products">
                      Products
                    </Link>
                  </li>

                  <li>
                    <Link href="/contact">
                      Contact
                    </Link>
                  </li>

                  <li>
                    <Link href="/privacy-policy">
                      Privacy Policy
                    </Link>
                  </li>

                </ul>

              </div>

            </div>
            {/* Contact */}

            <div className="col-lg-3 col-md-6 mb-4">

              <div className={styles.footerContact}>

                <h4>
                  Contact Us
                </h4>
                <ul>
                  <li>
                    <FaPhoneAlt />
                    <a href="tel:+919311125574">
                      +91 9311125574
                    </a>
                  </li>
                  <li>
                    <FaEnvelope />
                    <a href="mailto:info@dentalloom.com">
                      info@dentalloom.com
                    </a>
                  </li>
                  <li>
                    <FaMapMarkerAlt />
                    <span>
                      Plot no.-88, Pocket- L, Sector 1, Bawana Industrial Area, DSIIDC Sub-city, New Delhi-110039, India
                    </span>
                  </li>
                </ul>
              </div>

            </div>

            {/* Newslater */}

            <div className="col-lg-4 col-md-6 mb-4">

              <div className={styles.newsletterBox}>
                <h4>
                  Subscribe to Our
                  Newsletter
                </h4>

                <p>
                  Get latest dental equipment
                  updates, offers and clinic
                  setup innovations.
                </p>

                {/* FORM */}

                <form className={styles.newsletterForm}>

                  <div className={styles.inputGroup}>

                    <input
                      type="email"
                      placeholder="Enter your email"
                      required
                    />

                    <button type="submit">

                      Subscribe

                    </button>

                  </div>

                </form>

                {/* BOTTOM TEXT */}

                <small>
                  No spam. Only useful updates.
                </small>

              </div>

            </div>


          </div>

        </div>

        {/* Bottom Footer */}

        <div className={styles.footerBottom}>

          <p>
            © 2026 Technomac. All Rights Reserved.
          </p>

        </div>

      </div>

    </footer>
  );
}