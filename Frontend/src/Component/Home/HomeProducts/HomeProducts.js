import styles from "./HomeProducts.module.css";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getData } from "../../../services/FetchNodeServices";
import defulteImage from "../../../../Images/landing_doctors.png"

import { optimizeImageUrl } from "../../../utils/imageOptimizer";

// Helper to convert category name into a clean URL slug without %20
const toSlug = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

import SkeletonLoader from "../../common/Loader/SkeletonLoader";

const fallbackImages = [
  "/Images/product1.jpg",
  "/Images/product2.jpg",
  "/Images/product3.jpg",
  "/Images/product4.jpg",
  "/Images/product5.jpg",
  "/Images/product6.jpg",
];

function CategoryCardImage({ src, alt }) {
  const [imgSrc, setImgSrc] = useState(src || defulteImage);

  useEffect(() => {
    setImgSrc(src || defulteImage);
  }, [src]);

  return (
    <Image
      width={400}
      height={300}
      src={imgSrc}
      alt={alt || "Product"}
      onError={() => {
        if (imgSrc !== defulteImage) {
          setImgSrc(defulteImage);
        }
      }}
      loading="lazy"
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
    />
  );
}

export default function HomeProducts() {
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllCategory = async () => {
    try {
      setLoading(true);
      const response = await getData("parentCategory/all");
      if (response?.success === true && Array.isArray(response.data)) {
        const mapped = response.data.map((item) => {
          const rawImg = item.imageUrl || item.image || item.category_image;
          const isValidImg =
            rawImg &&
            typeof rawImg === "string" &&
            rawImg.trim() !== "" &&
            rawImg !== "undefined" &&
            rawImg !== "null";
          return {
            _id: item._id,
            image: isValidImg ? optimizeImageUrl(rawImg, { width: 400 }) : defulteImage,
            name: item.title || item.name || "",
            desc: item.desc || item.description || item.subtitle || "",
            isRemote: item.isActive || true,
          };
        });
        setCategory(mapped);
      }
    } catch (e) {
      console.error("Category fetch failed, using static fallback:", e?.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCategory();
  }, []);

  return (
    <section className={styles.productSection}>
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2>
            Advanced Medical and Dental Equipment Solutions
          </h2>

          <p>
            Explore Premium Dental and Medical Healthcare products designed for modern clinics and professionals
          </p>
        </div>

        {/* GRID */}
        {loading && category.length === 0 ? (
          <SkeletonLoader type="category-grid" count={4} />
        ) : (
          <div className="row">
            {category.map((item) => (
              <div className="col-lg-3 col-md-6 col-6 mb-4" key={item._id}>
                <Link
                  href={{
                    pathname: "/products",
                    query: { parentCategory: toSlug(item?.name) || item?.name },
                  }}
                  className={styles.productCard}
                >
                  <div className={styles.imageWrapper}>
                    <CategoryCardImage
                      src={item?.image}
                      alt={item.name || "Product"}
                    />
                  </div>

                  <div className={styles.cardContent}>
                    <div style={{ fontWeight: 600, textTransform: 'capitalize', color: '#333' }}>
                      {item.name}
                    </div>
                    <span>
                      Explore Products
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}