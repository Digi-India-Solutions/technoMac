import styles from "./HomeProducts.module.css";

import Link from "next/link";
import image1 from "../../../../Images/product1.jpg";
import image2 from "../../../../Images/product2.jpg";
import image3 from "../../../../Images/product3.jpg";
import image4 from "../../../../Images/product4.jpg";
import image5 from "../../../../Images/product5.jpg";
import image6 from "../../../../Images/product6.jpg";
import Image from "next/image";

const products = [

  {
    id: 1,
    name: "Dental Imaging",
    image: image1,
  },

  {
    id: 2,
    name: "Dental Chairs",
    image: image2,
  },

  {
    id: 3,
    name: "Sterilization",
    image: image3,
  },

  {
    id: 4,
    name: "Air Compressor",
    image: image4,
  },

  {
    id: 5,
    name: "RVG Sensor",
    image: image5,
  },

  {
    id: 6,
    name: "Dental Accessories",
    image: image6,
  },

];

export default function HomeProducts() {

  return (

    <section className={styles.productSection}>

      <div className="container">

        {/* HEADER */}

        <div className={styles.sectionHeader}>

          <span>
            Our Products
          </span>

          <h2>
            Advanced Dental
            Equipment Solutions
          </h2>

          <p>
            Explore premium dental
            healthcare products designed
            for modern clinics and professionals.
          </p>

        </div>

        {/* GRID */}

        <div className="row">

          {products.map((item) => (

            <div
              className="col-lg-3 col-md-6 col-6 mb-4"
              key={item.id}
            >

              <Link
                href="/products"
                className={styles.productCard}
              >

                {/* IMAGE */}

                <div className={styles.imageWrapper}>

                  <Image
                    width={400}
                    height={300}
                    src={item.image}
                    alt={item.name}
                  />

                </div>

                <div className={styles.cardContent}>

                  <h3>
                    {item.name}
                  </h3>

                  <span>
                    Explore Products
                  </span>

                </div>

              </Link>

            </div>

          ))}

        </div>

      </div>

    </section>

    
  );
}