import Link from "next/link";
import { useState, useEffect } from "react";
import {
  FaBars,
  FaTimes,
  FaPhoneAlt,
  FaEnvelope,
  FaChevronDown,
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
} from "react-icons/fa";

import styles from "./Header.module.css";
import logo from "../../../../Images/logo-chat.png";
import Image from "next/image";
// import menuData from "../../../Data/menuData";
import menuData from "../../../../Data/menuData";


export default function Header() {
  const [mobileProductOpen, setMobileProductOpen] =
    useState(false);

  const [menuOpen, setMenuOpen] = useState(false);

  const [sticky, setSticky] = useState(false);
  const [activeCategory, setActiveCategory] =
    useState(menuData[0]);

  useEffect(() => {

    const handleScroll = () => {
      setSticky(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);

  }, []);

  return (
    <>
      <header
        className={`${styles.header} ${sticky ? styles.sticky : ""
          }`}
      >

        {/* TOP HEADER */}

        <div className={styles.topHeader}>

          <div className="container">

            <div className={styles.topHeaderWrapper}>

              {/* Left */}

              <div className={styles.topLeft}>

                <a href="tel:+919311125574">

                  <FaPhoneAlt />

                  +91 9311125574

                </a>

                <a href="mailto:info@Technomac.com">

                  <FaEnvelope />

                  info@Technomac.com

                </a>

              </div>

              {/* Right */}

              <div className={styles.topRight}>

                <a href="#" target="_blank">
                  <FaFacebookF />
                </a>

                <a href="#" target="_blank">
                  <FaInstagram />
                </a>

                <a href="#" target="_blank">
                  <FaLinkedinIn />
                </a>

                <a href="#" target="_blank">
                  <FaYoutube />
                </a>

              </div>

            </div>

          </div>

        </div>

        {/* MAIN NAVBAR */}

        <div className={styles.mainNavbar}>

          <div className="container">

            <div className={styles.navbar}>

              {/* Logo */}

              <div className={styles.logo}>

                <Link href="/">
                  <Image src={logo} alt="TECHNOMAC Logo" height={50} width={150} />
                </Link>

              </div>

              {/* Menu */}

              <nav
                className={`${styles.navMenu} ${menuOpen ? styles.active : ""
                  }`}
              >

                <Link href="/">Home</Link>
                {/* <Link href="/about">
                  About
                </Link> */}
                <div className={styles.megaMenuWrapper}>
                  <Link href="/products">
                    <span className={styles.menuTitle}>

                      Products
                      <FaChevronDown className={styles.arrowIcon} />
                    </span>
                  </Link>

                  {/* MEGA MENU */}

                  <div className={styles.megaMenu}>

                    {/* LEFT CATEGORY */}

                    <div className={styles.categoryList}>

                      {menuData.map((item, index) => (

                        <div
                          key={index}
                          className={`${styles.categoryItem}
          ${activeCategory.category === item.category
                              ? styles.activeCategory
                              : ""
                            }`}
                          onMouseEnter={() =>
                            setActiveCategory(item)
                          }
                        >

                          {item.category}

                        </div>

                      ))}

                    </div>

                    {/* RIGHT PRODUCTS */}

                    <div className={styles.productList}>

                      <h4>
                        {activeCategory.category}
                      </h4>

                      <div className={styles.productGrid}>

                        {activeCategory.products.map(
                          (product, index) => (

                            <Link href="/products"
                              key={index}
                            >

                              {product}

                            </Link>

                          )
                        )}

                      </div>

                    </div>

                  </div>

                </div>

                <Link href="/certificates">
                  Certificates
                </Link>
                <Link href="/catalogue">
                  Catalogue
                </Link>
                <Link href="/clinic-setup">
                  Clinic Setup
                </Link>

                {/* <Link href="/blogs">
                  Blogs
                </Link> */}
                <Link href="/updates">
                  New Updates 
                </Link>

                <Link href="/contact">
                  Contact Us
                </Link>

                {/* <Link href="/e-library">
                  e-Library
                </Link> */}

                <button
                  className={styles.closeBtn}
                  onClick={() => setMenuOpen(false)}
                >
                  <FaTimes />
                </button>

              </nav>

              {/* Right Section */}

              <div className={styles.rightSection}>

                <Link href="/warranty-registration">

                  <button className={styles.warrantyBtn}>

                    Extend Warranty

                  </button>

                </Link>

                <button className={styles.quoteBtn}>
                  Pay Now
                </button>

                <button
                  className={styles.mobileBtn}
                  onClick={() => setMenuOpen(true)}
                >
                  <FaBars />
                </button>

              </div>

            </div>

          </div>

        </div>

      </header>

      {/* Overlay */}

      {menuOpen && (
        <div
          className={styles.overlay}
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </>
  );
}