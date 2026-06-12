import styles from "./OurClients.module.css";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getData } from "../../../services/FetchNodeServices";

export default function OurClients() {
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await getData("client/all");
      console.log("SSS==>CLINT" , response)
      if (response?.success) {
        const active = (response.data || [])
          .filter((c) => c.isActive)
          .sort((a, b) => a.order - b.order);
        setClients(active);
      }
    } catch (error) {
      console.error("Failed to fetch clients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <section className={styles.clientSection}>

      {/* GLOW */}
      <div className={styles.glow}></div>

      <div className="container">

        {/* HEADING */}
        <div className={styles.heading}>
          <span>TRUSTED CLIENTS</span>
          <h2>Our Valuable Clients</h2>
          <p>
            Trusted by dental clinics, hospitals and healthcare
            professionals across India.
          </p>
        </div>

        {/* SKELETON */}
        {isLoading && (
          <div className="row">
            {Array.from({ length: 6 }).map((_, i) => (
              <div className="col-lg-2 col-md-4 col-6 mb-4" key={i}>
                <div className={styles.clientCard} style={{ height: 150, background: "#f0f0f0", animation: "pulse 1.4s ease-in-out infinite" }} />
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!isLoading && clients.length === 0 && (
          <p style={{ textAlign: "center", color: "#aaa", padding: "40px 0" }}>
            No clients to display.
          </p>
        )}

        {/* CLIENT GRID */}
        {!isLoading && clients.length > 0 && (
          <div className="row justify-content-center">
            {clients.map((item) => (
              <div className="col-lg-2 col-md-4 col-6 mb-4" key={item._id}>
                <div className={styles.clientCard}>

                  {/* IMAGE */}
                  <div style={{ position: "relative", width: "100%", height: "100px" }}>
                    <Image
                      src={item.image}
                      alt={item.name || "Client Logo"}
                      fill
                      className={styles.clientLogo}
                      sizes="(max-width: 576px) 50vw, 16vw"
                    />
                  </div>

                  {/* NAME */}
                  {/* {item.name && (
                    <p style={{
                      margin: "8px 0 2px",
                      fontSize: "13px",
                      fontWeight: 700,
                      color: "#111",
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}>
                      {item.name}
                    </p>
                  )} */}

                  {/* DESCRIPTION */}
                  {/* {item.description && (
                    <p style={{
                      margin: 0,
                      fontSize: "11px",
                      color: "#888",
                      textAlign: "center",
                      lineHeight: 1.4,
                      overflow: "hidden",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                    }}>
                      {item.description}
                    </p>
                  )} */}

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}