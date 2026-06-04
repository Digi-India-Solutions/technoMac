import { useState } from "react";
import products from "../../../../Data/products";
import ProductCard from "../ProductCard/ProductCard";
import styles from "./ProductPage.module.css";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";

export default function ProductPage() {

  const [search, setSearch] = useState("");

  const filteredProducts = products.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (

    <section className={styles.productPage}>

      <div className="container">

        {/* BREADCRUMB */}

        <Breadcrumb pageName="Products" />

        {/* HEADING */}

        <div className={styles.heading}>

          <span>
            TECHNOMAC PRODUCTS
          </span>

          <h1>
            Explore Our
            Dental Equipment
          </h1>

          <p>
            Discover premium dental
            healthcare products and modern
            clinic equipment trusted by
            professionals across India.
          </p>

        </div>

        {/* SEARCH */}

        <div className={styles.searchBox}>

          <input
            type="text"
            placeholder="Search dental products..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>

        {/* PRODUCT GRID */}

        <div className={`row ${styles.productGrid}`}>

          {filteredProducts.length > 0 ? (

            filteredProducts.map((item) => (

              <div
                className="col-lg-4 col-md-6 col-6 mb-4"
                key={item.id}
              >

                <ProductCard item={item} />

              </div>

            ))

          ) : (

            <div className="col-12">

              <div className={styles.emptyBox}>

                <h3>
                  No Products Found
                </h3>

                <p>
                  Try searching another
                  dental product.
                </p>

              </div>

            </div>

          )}

        </div>

      </div>

    </section>
  );
}