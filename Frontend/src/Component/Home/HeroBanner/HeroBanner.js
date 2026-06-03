import styles from "./HeroBanner.module.css";

import {
  Swiper,
  SwiperSlide,
} from "swiper/react";

import {
  Autoplay,
  Pagination,
} from "swiper/modules";

import Image from "next/image";

import {
  FaArrowRight,
} from "react-icons/fa";

import heroImage1 from "../../../../Images/banner1.jpg";
import heroImage2 from "../../../../Images/banner2.jpg";
import heroImage3 from "../../../../Images/banner3.jpg";
import heroImage4 from "../../../../Images/banner4.jpg";

const banners = [

  {
    image: heroImage1,
    title: "Advanced Dental Clinic Setup",
    desc:
      "Premium dental healthcare equipment and modern clinic solutions.",
  },

  {
    image: heroImage2,
    title: "Modern Imaging Solutions",
    desc:
      "High precision dental imaging and diagnostic systems.",
  },

  {
    image: heroImage3,
    title: "Smart Dental Equipment",
    desc:
      "Reliable dental machines designed for modern professionals.",
  },

  {
    image: heroImage4,
    title: "Trusted By Dental Experts",
    desc:
      "Innovative healthcare technology trusted across India.",
  },

];

export default function HeroBanner() {

  return (

    <section className={styles.heroSection}>

      <Swiper
        modules={[
          Autoplay,
          Pagination,
        ]}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        speed={1200}
        className={styles.heroSwiper}
      >

        {banners.map((item, index) => (

          <SwiperSlide key={index}>

            <div className={styles.bannerItem}>

              {/* IMAGE */}

              <Image
                src={item.image}
                alt="Dental Banner"
                fill
                priority
                className={styles.bannerImage}
              />

              {/* OVERLAY */}

              <div className={styles.overlay}></div>

              {/* CONTENT */}

              <div className="container">

                <div className={styles.bannerContent}>

                  <span>
                    TECHNOMAC DENTAL
                  </span>

                  <h1>
                    {item.title}
                  </h1>

                  <p>
                    {item.desc}
                  </p>

                  {/* BUTTONS */}

                  <div className={styles.buttonGroup}>

                    <button
                      className={styles.primaryBtn}
                    >

                      Explore Products

                      <FaArrowRight />

                    </button>

                    <button
                      className={styles.secondaryBtn}
                    >

                      Book Demo

                    </button>

                  </div>

                  {/* SCROLL */}

                  {/* <div className={styles.scrollBtn}>

                    <span>
                      Scroll
                    </span>

                    <div className={styles.mouse}>

                      <div className={styles.wheel}></div>

                    </div>

                  </div> */}

                </div>

              </div>

            </div>

          </SwiperSlide>

        ))}

      </Swiper>

    </section>
  );
}   