import Image from "next/image";
import Link from "next/link";
import {
  FaArrowLeft,
  FaCalendarAlt,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";

import styles from "./UpdateDetails.module.css";
import Breadcrumb from "../common/Breadcrumb/Breadcrumb";

export default function UpdateDetails({ item }) {
  if (!item) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return "Recently Updated";

    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className={styles.detailsSection}>
      <div className="container">
        <Breadcrumb pageName={item.title || "Update Details"} />

        <div className={styles.wrapper}>
          {/* TOP BACK LINK */}
          <div className={styles.topBar}>
            <Link href="/updates" className={styles.backBtn}>
              <FaArrowLeft />
              Back to Updates
            </Link>
          </div>

          {/* HEADER */}
          <div className={styles.header}>
            <div className={styles.metaRow}>
              <span className={styles.updateBadge}>
                <FaCheckCircle className={styles.badgeIcon} />
                Latest Update
              </span>

              {item.createdAt && (
                <span className={styles.metaItem}>
                  <FaCalendarAlt />
                  {formatDate(item.createdAt)}
                </span>
              )}

              {item.readTime && (
                <span className={styles.metaItem}>
                  <FaClock />
                  {item.readTime}
                </span>
              )}
            </div>

            <h1 className={styles.title}>{item.title}</h1>
          </div>

          {/* HERO IMAGE */}
          <div className={styles.imageWrapper}>
            <Image
              src={item.image}
              alt={item.title || "Update"}
              fill
              priority
              className={styles.updateImage}
              sizes="(max-width: 768px) 100vw, 920px"
            />
          </div>

          {/* CONTENT CARD */}
          <div className={styles.articleCard}>
            {/* DESCRIPTION */}
            {item.description && (
              <div className={styles.description}>
                <p>{item.description}</p>
              </div>
            )}

            {/* KEY HIGHLIGHTS */}
            {item?.points?.length > 0 && (
              <div className={styles.highlights}>
                <div className={styles.sectionHeading}>
                  <span className={styles.headingIcon}>
                    <FaCheckCircle />
                  </span>

                  <div>
                    <h2>Key Highlights</h2>
                    <p>Important information you should know</p>
                  </div>
                </div>

                <ul className={styles.pointsList}>
                  {item.points.map((point, index) => (
                    <li key={index} className={styles.pointItem}>
                      <span className={styles.pointIcon}>
                        <FaCheckCircle />
                      </span>

                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FOOTER */}
            <div className={styles.articleFooter}>
              <Link href="/updates" className={styles.footerBackBtn}>
                <FaArrowLeft />
                Explore More Updates
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


// import Image from "next/image";
// import styles from "./UpdateDetails.module.css";
// import Breadcrumb from "../common/Breadcrumb/Breadcrumb";

// export default function UpdateDetails({
//   item,
// }) {

//   return (

//     <section className={styles.detailsSection}>
//       <div className="container">

//         <Breadcrumb pageName="Update Details" />


//         {/* IMAGE */}

//         <div className={styles.update_container}>
//           <h1>
//             {item.title}
//           </h1>

//         <div className={styles.imageWrapper}>

//           <Image
//             src={item.image}
//             alt={item.title}
//             width={250}
//             height={250}
//             className={styles.image}
//           />

//   <div className={styles.content}>
//           <h1>
//             {item.title}
//           </h1>

//           <p>
//             {item.description}
//           </p>

//           {/* POINTS */}

//           <div className={styles.pointBox}>

//             <h3>
//               Key Highlights
//             </h3>

//             <ul>

//               {item?.points?.map(
//                 (point, index) => (

//                   <li key={index}>
//                     {point}
//                   </li>

//                 )
//               )}

//             </ul>

//           </div>

//         </div>
//         </div>
//         </div>


//         {/* CONTENT */}

      

//       </div>

//     </section>
//   );
// }