import {FaStar,FaQuoteRight} from "react-icons/fa";
import {Swiper,SwiperSlide} from "swiper/react";
import {Autoplay,Pagination} from "swiper/modules";
import styles from "./ReviewSection.module.css";

import image1 from "../../../../Images/review1.webp";
import image2 from "../../../../Images/review2.webp";
import image3 from "../../../../Images/review3.webp";
import Image from "next/image";

const reviews = [

  {
    id: 1,
    name: "Dr. Amit Sharma",
    role: "MDS Orthodontist",
    image: image2,
    review:
      "TECHNOMAC products completely transformed my clinic setup. Their dental chair quality and after-sales service are outstanding.",
  },

  {
    id: 2,
    name: "Dr. Priya Verma",
    role: "Dental Surgeon",
    image: image1,
    review:
      "The intraoral camera and RVG sensor are excellent. Smooth performance and professional support team.",
  },

  {
    id: 3,
    name: "Dr. Rahul Mehta",
    role: "Implantologist",
    image: image3,
    review:
      "Highly recommended for dental clinic setup. Premium equipment with fast installation and technical support.",
  },

  {
    id: 4,
    name: "Dr. Neha Kapoor",
    role: "Dental Specialist",
    image: image1,
    review:
      "Excellent build quality and advanced technology. TECHNOMAC gives genuine service support.",
  },

];

export default function ReviewSection() {

  return (
    <>
     <section className={styles.marqueeSection}>

      <div className={styles.marquee}>

        <div className={styles.track}>

          <span>
            Wellness
          </span>

          <span>
            Health
          </span>

          <span>
            Care
          </span>

          <span>
            Trust
          </span>

          <span>
            Dental
          </span>

          <span>
            Innovation
          </span>

          <span>
            TECHNOMAC
          </span>

          {/* DUPLICATE FOR SMOOTH LOOP */}

          <span>
            Wellness
          </span>

          <span>
            Health
          </span>

          <span>
            Care
          </span>

          <span>
            Trust
          </span>

          <span>
            Dental
          </span>

          <span>
            Innovation
          </span>

          <span>
            TECHNOMAC
          </span>

        </div>

      </div>

    </section>
    <section className={styles.reviewSection}>

      <div className="container">

        {/* HEADER */}

        <div className={styles.sectionHeader}>

          <span>
            Testimonials
          </span>

          <h2>
            What Dentists Say
            About TECHNOMAC
          </h2>

          <p>
            Trusted by thousands of
            dental professionals across India.
          </p>

        </div>

        {/* SLIDER */}

        <Swiper
          slidesPerView={3}
          spaceBetween={30}
          loop={true}
          speed={1000}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{
            clickable: true,
          }}
          modules={[
            Autoplay,
            Pagination,
          ]}
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
          className={styles.reviewSwiper}
        >

          {reviews.map((item) => (

            <SwiperSlide key={item.id}>

              <div className={styles.reviewCard}>

                {/* QUOTE */}

                <div className={styles.quoteIcon}>

                  <FaQuoteRight />

                </div>

                {/* STARS */}

                <div className={styles.stars}>

                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />

                </div>

                {/* REVIEW */}

                <p className={styles.reviewText}>
                  {item.review}
                </p>

                {/* USER */}

                <div className={styles.userInfo}>

                  <Image 
                    width={80}
                    height={80}
                    src={item.image}
                    alt={item.name}
                  />

                  <div>

                    <h4>
                      {item.name}
                    </h4>

                    <span>
                      {item.role}
                    </span>

                  </div>

                </div>

              </div>

            </SwiperSlide>

          ))}

        </Swiper>

      </div>

    </section>
   
    </>
  );
}