import { blogs } from "../../../../Data/blogs";

import BlogCard from "../BlogCard/BlogCard";

import styles from "./BlogListing.module.css";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";

export default function BlogListing() {

  return (

    <section className={styles.blogSection}>

      <div className="container">
        <Breadcrumb pageName="Blogs" />
        <div className={styles.heading}>
          <h2>
            Latest Dental
            Insights & News
          </h2>

        </div>

        <div className="row">

          {blogs.map((item) => (

            <div
              className="col-lg-3 col-md-6 col-6 mb-4"
              key={item.id}
            >

              <BlogCard item={item} />

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}