import Link from "next/link";
import {  FaCheckCircle, FaFilePdf, FaWhatsapp} from "react-icons/fa";
import { Swiper,SwiperSlide,} from "swiper/react";
import { Navigation } from "swiper/modules";
import products from "../../../../Data/products";
import styles from "./ProductDetails.module.css";
import Image from "next/image";
import { useState } from "react";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";

export default function ProductDetails({ product }) {
  const relatedProducts = products.filter(
    (item) => item.slug !== product.slug
  );

  const galleryImages = product.images || [
    product.image,
    product.image,
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  const [activeImage, setActiveImage] =
    useState(galleryImages[0]);

  return (

    <section className="allSections">
      <div className="container">
        <Breadcrumb pageName={product.name} />

        <div className="row">
          <div className="col-lg-5">
            <div className={styles.imageWrapper}>
              <div className={styles.mainImage}>
                <Image
                  src={activeImage}
                  alt={product.name}
                  width={600}
                  height={500}
                  className={styles.mainProductImage}
                />
              </div>
              <div className={styles.galleryWrapper}>
                <div className={styles.gallery}>
                  {galleryImages.map((img, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`${styles.thumbBox}
                        ${activeImage === img
                          ? styles.activeThumb
                          : ""
                        }`}
                      onClick={() =>
                        setActiveImage(img)
                      }
                    >
                      <Image
                        src={img}
                        alt={`thumb-${index}`}
                        width={100}
                        height={100}
                        className={styles.thumbImage}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className={styles.content}>
              <span className={styles.category}>
                {product.category}
              </span>
              <h1>
                {product.name}
              </h1>
              <p className={styles.description}>
                {product.description}
              </p>
              <div className={styles.sectionBox}>
                <h3>
                  Salient Features
                </h3>
                <ul>
                  <li>
                    <FaCheckCircle />
                    Fully Automatic System
                  </li>
                  <li>
                    <FaCheckCircle />
                    Advanced Sterilization
                  </li>
                  <li>
                    <FaCheckCircle />
                    Compact Modern Design
                  </li>
                  <li>
                    <FaCheckCircle />
                    Dentist Recommended
                  </li>
                </ul>
              </div>
              <div className={styles.sectionBox}>
                <h3>
                  Technical Specifications
                </h3>
                <div className={styles.specGrid}>
                  <div>
                    <span>Capacity</span>
                    <p>12-15 Liters</p>
                  </div>
                  <div>
                    <span>Voltage</span>
                    <p>230V</p>
                  </div>
                  <div>
                    <span>Power</span>
                    <p>1000W</p>
                  </div>
                  <div>
                    <span>Material</span>
                    <p>Stainless Steel</p>
                  </div>
                </div>
              </div>
              <div className={styles.buttonGroup}>
                <button className={styles.primaryBtn}>
                  <FaWhatsapp />
                  WhatsApp Inquiry
                </button>
                <button className={styles.secondaryBtn}>
                  <FaFilePdf />
                  Download Brochure
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.relatedSection}>
          <div className={styles.relatedHeading}>
            <span>
              Related Products
            </span>
            <h2>
              Explore More Equipment
            </h2>
          </div>
          <Swiper
            slidesPerView={3}
            spaceBetween={24}
            navigation={true}
            modules={[Navigation]}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1200: {
                slidesPerView: 3,
              },
            }}
          >
            {relatedProducts.map((item) => (
              <SwiperSlide key={item.id}>
                <div className={styles.relatedCard}>
                  <div className="globalProductCard">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={250}
                      height={200}
                    />
                    <span>
                      {item.category}
                    </span>
                    <h3>
                      {item.name}
                    </h3>
                    <p>
                      {item.description}
                    </p>
                    <Link href={`/product/${item.slug}`}>
                      <button>
                        View Details
                      </button>
                    </Link>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}