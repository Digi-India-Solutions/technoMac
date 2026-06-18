import Image from "next/image";
import styles from "./UpdateDetails.module.css";
import Breadcrumb from "../common/Breadcrumb/Breadcrumb";

export default function UpdateDetails({
  item,
}) {

  return (

    <section className={styles.detailsSection}>
      <div className="container">

        <Breadcrumb pageName="Update Details" />


        {/* IMAGE */}

        <div className={styles.imageWrapper}>

          <Image
            src={item.image}
            alt={item.title}
            width={250}
            height={250}
            className={styles.image}
          />

        </div>

        {/* CONTENT */}

        <div className={styles.content}>
          <h1>
            {item.title}
          </h1>

          <p>
            {item.description}
          </p>

          {/* POINTS */}

          <div className={styles.pointBox}>

            <h3>
              Key Highlights
            </h3>

            <ul>

              {item?.points?.map(
                (point, index) => (

                  <li key={index}>
                    {point}
                  </li>

                )
              )}

            </ul>

          </div>

        </div>

      </div>

    </section>
  );
}