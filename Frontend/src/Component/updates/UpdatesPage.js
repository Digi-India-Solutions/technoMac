import Link from "next/link";

import Image from "next/image";

import updates from "../../../Data/updates";

import styles from "./UpdatesPage.module.css";

import {
  FaArrowRight,
  FaClock,
  FaCalendarAlt,
} from "react-icons/fa";

export default function UpdatesPage() {

  return (

    <section className={styles.updateSection}>

      {/* GLOW */}

      <div className={styles.glow}></div>

      <div className="container">

        {/* TOP */}

        <div className={styles.heading}>

          <span>
            TECHNOMAC NEWS
          </span>

          <h1>
            Latest Updates &
            Healthcare News
          </h1>

          <p>
            Explore the latest innovations,
            product launches and modern
            healthcare technology updates
            from TECHNOMAC.
          </p>

        </div>

        {/* GRID */}

        <div className="row">

          {updates.map((item) => (

            <div
              className="col-lg-4 col-md-6 mb-4"
              key={item.id}
            >

              <Link
                href={`/updates/${item.slug}`}
                className={styles.card}
              >

                {/* IMAGE */}

                <div className={styles.imageWrapper}>

                  <Image
                    src={item.image}
                    alt={item.title}
                    className={styles.image}
                  />

                  {/* OVERLAY */}

                  <div className={styles.overlay}></div>

                  {/* DATE */}

                  <div className={styles.dateBox}>

                    <FaCalendarAlt />

                    18 Aug 2026

                  </div>

                </div>

                {/* CONTENT */}

                <div className={styles.content}>

                  {/* TIME */}

                  <div className={styles.time}>

                    <FaClock />

                    5 Min Read

                  </div>

                  {/* TITLE */}

                  <h3>
                    {item.title}
                  </h3>

                  {/* DESCRIPTION */}

                  <p>
                    {item.description.slice(0, 90)}...
                  </p>

                  {/* BUTTON */}

                  <div className={styles.readMore}>

                    Read Full Update

                    <FaArrowRight />

                  </div>

                </div>

              </Link>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}