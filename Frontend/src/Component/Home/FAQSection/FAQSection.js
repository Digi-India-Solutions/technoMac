import { useEffect, useState } from "react";
import { FaPlus, FaMinus, } from "react-icons/fa";
import styles from "./FAQSection.module.css";
import { getData } from "../../../services/FetchNodeServices";

export default function FAQSection() {
  const [faq, setFaq] = useState([])
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false)

  const fetchAllFaq = async () => {
    try {
      // ✅ Remove leading slash — getData likely prepends serverURL + "/"
      const response = await getData("faq/");
      console.log("categoryResponse=>", response)
      if (response.success === true) {
        // console.log("SSSS==>response", category)
        // ✅ Map API response to the shape our UI expects
        setFaq(response.data);
      }
      // If empty or null → keep static fallback already in state
    } catch (e) {
      console.error("Category fetch failed, using static fallback:", e?.message);
      // ✅ Static Category already set as default — nothing extra needed
    } finally {
      setLoading(false);
    }
  };

  // ✅ useEffect instead of useState
  useEffect(() => {
    fetchAllFaq();
  }, []);
  // console.log("SSSS==>response", category)

  const toggleFAQ = (index) => {

    if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      setActiveIndex(index);
    }
  };

  return (

    <section className={styles.faqSection}>

      {/* GLOW */}

      <div className={styles.glow}></div>

      <div className="container">

        <div className="row align-items-center">

          {/* LEFT */}

          <div className="col-lg-5">

            <div className={styles.leftContent}>
{/* 
              <span>
                FAQ'S
              </span> */}

              <h2>
                Frequently Asked
                Questions
              </h2>

              <p>
                Everything you need to know
                about TECHNOMAC dental
                healthcare products and
                services.
              </p>

              <button>
                Contact Support
              </button>

            </div>

          </div>

          {/* RIGHT */}

          <div className="col-lg-7">
          <div className={styles.faqWrapperScroller}>
            
            <div className={styles.faqWrapper}>

              {faq.map((item, index) => (

                <div
                  className={`${styles.faqItem} ${activeIndex === index
                    ? styles.active
                    : ""
                    }`}
                  key={index}
                >

                  {/* QUESTION */}

                  <div
                    className={styles.question}
                    onClick={() =>
                      toggleFAQ(index)
                    }
                  >

                    <h4>
                      {item.question}
                    </h4>

                    <div
                      className={styles.icon}
                    >

                      {activeIndex === index ? (
                        <FaMinus />
                      ) : (
                        <FaPlus />
                      )}

                    </div>

                  </div>

                  {/* ANSWER */}

                  <div
                    className={styles.answer}
                  >

                    <p>
                      {item.answer}
                    </p>

                  </div>

                </div>

              ))}

            </div>

          </div>
          </div>

        </div>

      </div>

    </section>
  );
}