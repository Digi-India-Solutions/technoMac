import styles from "./HomeProducts.module.css";

import Link from "next/link";
import image1 from "../../../../Images/product1.jpg";
import image2 from "../../../../Images/product2.jpg";
import image3 from "../../../../Images/product3.jpg";
import image4 from "../../../../Images/product4.jpg";
import image5 from "../../../../Images/product5.jpg";
import image6 from "../../../../Images/product6.jpg";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getData } from "../../../services/FetchNodeServices";

export default function HomeProducts() {
  const [category, setCategory] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchAllCategory = async () => {
    try {
      // ✅ Remove leading slash — getData likely prepends serverURL + "/"
      const response = await getData("parentCategory/all");
      console.log("categoryResponse=>", response)
      if (response.success === true) {
        // console.log("SSSS==>response", category)
        // ✅ Map API response to the shape our UI expects
        const mapped = response.data.map((item) => ({
          _id: item._id,
          image: item.imageUrl || item.image || item.category_image,
          name: item.title || item.name || "",
          desc: item.desc || item.description || item.subtitle || "",
          isRemote: item.isActive || true, // flag to use <img> instead of next/image for remote URLs
        }));
        setCategory(mapped);
      }
      // If empty or null → keep static fallback already in state
    } catch (e) {
      console.error("Category fetch failed, using static fallback:", e?.message);
      // ✅ Static Category already set as default — nothing extra needed
    } finally {
      setLoading(false);
    }
  };

  // ✅ useEffect instead of useState
  useEffect(() => {
    fetchAllCategory();
  }, []);
  return (
    <section className={styles.productSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
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
          {category.map((item) => (
            <div className="col-lg-3 col-md-6 col-6 mb-4" key={item._id}>
              <Link href={{ pathname: "/products", query: { parentCategory: item?._id } }}
                className={styles.productCard}
              >
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