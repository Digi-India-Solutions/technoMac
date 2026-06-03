import Link from "next/link";
import Image from "next/image";

import styles from "./BlogCard.module.css";

export default function BlogCard({
  item,
}) {

  return (

    <Link
      href={`/blogs/${item.slug}`}
      className={styles.blogCard}
    >

      {/* IMAGE */}

      <div className={styles.imageWrapper}>

        <Image
          src={item.image}
          alt={item.title}
          fill
          className={styles.blogImage}
        />

      </div>

      {/* CONTENT */}

      <div className={styles.content}>

        <span>
          {item.category}
        </span>

        <h3>
          {item.title}
        </h3>

        <p>
          {item.description}
        </p>

        <button>
          Read More →
        </button>

      </div>

    </Link>
  );
}