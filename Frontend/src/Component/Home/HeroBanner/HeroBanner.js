import styles from "./HeroBanner.module.css";
import { Swiper, SwiperSlide, } from "swiper/react";
import { Autoplay, Pagination, } from "swiper/modules";
import Image from "next/image";
import { FaArrowRight, } from "react-icons/fa";
import { getData } from "../../../services/FetchNodeServices";
import heroImage1 from "../../../../Images/banner1.jpg";
import heroImage2 from "../../../../Images/banner2.jpg";
import heroImage3 from "../../../../Images/banner3.jpg";
import heroImage4 from "../../../../Images/banner4.jpg";
import { useEffect, useState } from "react";
import Link from "next/link";

// const statice_bannerss = [

//   {
//     image: heroImage1,
//     title: "Advanced Dental Clinic Setup",
//     desc:
//       "Premium dental healthcare equipment and modern clinic solutions.",
//   },

//   {
//     image: heroImage2,
//     title: "Modern Imaging Solutions",
//     desc:
//       "High precision dental imaging and diagnostic systems.",
//   },

//   {
//     image: heroImage3,
//     title: "Smart Dental Equipment",
//     desc:
//       "Reliable dental machines designed for modern professionals.",
//   },

//   {
//     image: heroImage4,
//     title: "Trusted By Dental Experts",
//     desc:
//       "Innovative healthcare technology trusted across India.",
//   },

// ];

export default function HeroBanner() {
  const [banners, setBanners] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAllBanners = async () => {
    try {
      // ✅ Remove leading slash — getData likely prepends serverURL + "/"
      const response = await getData("banner/all");
      if (response.success === true) {
        // ✅ Map API response to the shape our UI expects
        const mapped = response.banners.map((item) => ({
          image: item.imageUrl || item.image || item.banner_image,
          category: item?.categoryId || {},
          title: item.title || item.banner_title || "",
          desc: item.desc || item.description || item.subtitle || "",
          isRemote: item.isActive || true, // flag to use <img> instead of next/image for remote URLs
        }));
        setBanners(mapped);
      }
      // If empty or null → keep static fallback already in state
    } catch (e) {
      console.error("Banner fetch failed, using static fallback:", e?.message);
      // ✅ Static banners already set as default — nothing extra needed
    } finally {
      setLoading(false);
    }
  };

  // ✅ useEffect instead of useState
  useEffect(() => {
    fetchAllBanners();
  }, []);
  console.log("SSSS==>response", banners)
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
                      <Link
                        href={{ pathname: "/products", query: { category: item?.category?._id } }}
                        className={styles.productCard}
                        style={{ textDecoration: "none", color: '#fff' }}
                      >
                        Explore Products

                        <FaArrowRight />
                      </Link>
                    </button>

                    <button
                      className={styles.secondaryBtn}

                    >
                      <Link
                        href={{ pathname: "/contact" }}
                        className={styles?.productCard}
                        style={{ textDecoration: "none", color: '#fff' }}
                      >
                        Book Demo
                      </Link>
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