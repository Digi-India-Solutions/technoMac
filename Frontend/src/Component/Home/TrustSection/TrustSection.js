import CountUp from "react-countup";
import { useInView } from "react-intersection-observer";
import styles from "./TrustSection.module.css";
import { FaHandshake, FaTools, FaUserMd } from "react-icons/fa";
import { FaTruckMedical } from "react-icons/fa6";

export default function TrustSection() {

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  return (
    <section className={styles.trustSection} ref={ref}>

      <div className="container">

        <div className="row align-items-center">

          {/* Left Content */}

          <div className="col-lg-5">

            <div className={styles.leftContent}>

              {/* <span className={styles.tag}>
                Trusted Dental Partner
              </span> */}

              <h2>
                Empowering Medical & Dental
                Professionals Since 1999
              </h2>

              <p>
                For over 26 years, Technomac Medical Systems has been
                empowering medical and dental professionals across India with world-class
                equipment and innovative clinical solutions.

              </p>

              <p>
                Built on quality, reliability,
                and customer-first support, Technomac
                continues to shape the future of healthcare.
              </p>

            </div>

          </div>

          {/* Right Stats */}

          <div className="col-lg-7">

            <div className={styles.statsGrid}>

              {/* Item */}

              <div className={styles.statCard}>

                <div className={styles.iconBox}>
                  <FaUserMd />
                </div>

                <h3>
                  {inView && (
                    <CountUp
                      end={150000}
                      duration={3}
                      separator=","
                    />
                  )}
                  +
                </h3>

                <p>
                  Happy Clients
                </p>

              </div>

              {/* Item */}

              <div className={styles.statCard}>

                <div className={styles.iconBox}>
                  <FaHandshake />
                </div>

                <h3>
                  {inView && (
                    <CountUp
                      end={200}
                      duration={3}
                    />
                  )}
                  +
                </h3>

                <p>
                  Channel Partners
                </p>

              </div>

              {/* Item */}

              <div className={styles.statCard}>

                <div className={styles.iconBox}>
                  <FaTruckMedical />
                </div>

                <h3>
                  {inView && (
                    <CountUp
                      end={500000}
                      duration={3}
                      separator=","
                    />
                  )}
                  +
                </h3>

                <p>
                  Equipments Delivered
                </p>

              </div>

              {/* Item */}

              <div className={styles.statCard}>

                <div className={styles.iconBox}>
                  <FaTools />
                </div>

                <h3>
                  {inView && (
                    <CountUp
                      end={275}
                      duration={3}
                    />
                  )}
                  +
                </h3>

                <p>
                  Technical Staff
                </p>

              </div>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}