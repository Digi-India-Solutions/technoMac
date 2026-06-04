import Link from "next/link";

import styles from "./ProductCard.module.css";
import Image from "next/image";

export default function ProductCard({ item }) {

  return (
    <div className={styles.card}>

      <div className={styles.imageBox}>

        <Image
          src={item.image}
          alt={item.name}
          width={500}
          height={300}
        />

      </div>

      <div className={styles.content}>

        <span>
          {item.category}
        </span>

        <h3>
          {item.name}
        </h3>

        <p>
          {item.description}
        </p>

        <Link href={`/product/${item.slug}`}>

          <button>
            View Details
          </button>

        </Link>

      </div>

    </div>
  );
}