import Link from "next/link";

import styles from "./Breadcrumb.module.css";

export default function Breadcrumb({
  pageName,
}) {

  return (

    <div className={styles.breadcrumb}>

      <Link href="/">
        Home
      </Link>

      <span>/</span>

      <p>
        {pageName}
      </p>

    </div>
  );
}