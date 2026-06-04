import Image from "next/image";

import styles from "./BlogDetails.module.css";
import Breadcrumb from "../../common/Breadcrumb/Breadcrumb";

export default function BlogDetails({
  blog,
}) {

  return (

    <section className={styles.detailsSection}>

      <div className="container">

        <Breadcrumb pageName="Blog Details" />

        {/* IMAGE */}

        <div className={styles.imageWrapper}>

          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className={styles.blogImage}
          />

        </div>

        {/* CONTENT */}

        <div className={styles.content}>

          <span>
            {blog.category}
          </span>

          <h1>
            {blog.title}
          </h1>

          <p>
            {blog.content}
          </p>

        </div>

      </div>

    </section>
  );
}