import styles from "./OurClients.module.css";

import Image from "next/image";

import client1 from "../../../../Images/about-image.png";
import client2 from "../../../../Images/about-image.png";
import client3 from "../../../../Images/about-image.png";
import client4 from "../../../../Images/about-image.png";

const clients = [
  client1,
  client2,
  client3,
  client4,
  client3,
  client4,
];

export default function OurClients() {

  return (

    <section className={styles.clientSection}>

      {/* GLOW */}

      <div className={styles.glow}></div>

      <div className="container">

        {/* HEADING */}

        <div className={styles.heading}>

          <span>
            TRUSTED CLIENTS
          </span>

          <h2>
            Our Valuable Clients
          </h2>

          <p>
            Trusted by dental clinics,
            hospitals and healthcare
            professionals across India.
          </p>

        </div>

        {/* CLIENT GRID */}

        <div className="row">

          {clients.map((item, index) => (

            <div
              className="col-lg-2 col-md-4 col-6 mb-4"
              key={index}
            >

              <div className={styles.clientCard}>

                <Image
                  src={item}
                  alt="Client Logo"
                  className={styles.clientLogo}
                />

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}