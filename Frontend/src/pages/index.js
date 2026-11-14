import Head from "next/head";
import Layout from "../Component/layout/Layout";
import Headerimage from "../../Images/headerImage.png";
import Image from "next/image";
import TrustSection from "../Component/Home/TrustSection/TrustSection";
import styles from "../Component/about/AboutPage/AboutPage.module.css";
import ReviewSection from "../Component/Home/ReviewSection/ReviewSection";
import CTASection from "../Component/Home/CTASection/CTASection";
import HomeProducts from "../Component/Home/HomeProducts/HomeProducts";
import EnquirySection from "../Component/Home/EnquirySection/EnquirySection";
import HeroBanner from "../Component/Home/HeroBanner/HeroBanner";
import FAQSection from "../Component/Home/FAQSection/FAQSection";
import OurClients from "../Component/Home/OurClients/OurClients";
import AdvancedDentalEquipment from "../Component/Home/AdvancedDentalEquipment/AdvancedDentalEquipment";

export default function Home() {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: "Technomac Medical Systems Private Limited",
    alternateName: "TECHNOMAC",
    url: "https://technomacmedical.com",
    logo: "https://technomacmedical.com/favicon.jpeg",
    description:
      "Technomac Medical Systems Private Limited is an Indian manufacturer and exporter of advanced dental X-Ray machines, dental chairs, and healthcare equipment since 1999.",
    telephone: "+91 9311125574",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91 9311125574",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  };

  return (
    <Layout>
      <Head>
        <title>Technomac Medical Systems Private Limited</title>
        <meta
          name="description"
          content="Empowering Medical & Dental Professionals Since 1999. Technomac Medical Systems Private Limited is a leading manufacturer of advanced dental X-Ray machines, dental chairs, and clinic equipment."
        />
        <meta
          name="keywords"
          content="Technomac Medical Systems Private Limited, TECHNOMAC, Dental X-Ray Machine, Dental Chairs, Dental Equipment Manufacturer, Clinic Setup Solutions"
        />
        <link rel="canonical" href="https://technomacmedical.com" />
        <meta property="og:title" content="Technomac Medical Systems Private Limited" />
        <meta
          property="og:description"
          content="Empowering Medical & Dental Professionals Since 1999. Technomac Medical Systems Private Limited is a leading manufacturer of advanced dental X-Ray machines, dental chairs, and clinic equipment."
        />
        <meta property="og:url" content="https://technomacmedical.com" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Technomac Medical Systems" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Technomac Medical Systems Private Limited" />
        <meta
          name="twitter:description"
          content="Empowering Medical & Dental Professionals Since 1999. Technomac Medical Systems Private Limited is a leading manufacturer of advanced dental X-Ray machines, dental chairs, and clinic equipment."
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </Head>
      <HeroBanner />
       {/* <section className="hero-section">
        <div className="container">

          <div className="row align-items-center">

            // Left 
            <div className="col-lg-6">

              <div className="hero-content">

                <span className="hero-tag">
                  Advanced Dental Equipment
                </span>

                <h1>
                  Make your perfect smile even better
                </h1>

                <p>
                  Premium dental healthcare products
                  and advanced clinic setup solutions
                  designed for modern dental professionals.
                </p>

                <button className="hero-btn">
                  Request a Call
                </button>

              </div>

            </div>

            // Right 
            <div className="col-lg-6">

              <div className="hero-image">

                <Image
                  src={Headerimage}
                  alt="Dental Equipment"
                  priority
                />

              </div>

            </div>

          </div>

        </div>
      </section> */}
      <AdvancedDentalEquipment />
      <HomeProducts />
      <TrustSection />
      {/* <div className={styles.commitmentSection}>

        <div className="container">

          <div className={styles.commitmentBox}>

            <span>
              Our Commitment
            </span>

            <h2>
              Powering Clinics That
              Refuse To Compromise
            </h2>

            <p>
              We don’t just manufacture machines.
              We reduce downtime, increase patient
              trust, and help dentists build clinics
              they’re proud of.
            </p>

            <p>
              from a new single-chair setup in Ghaziabad to a 10-chair multi-specialty center in South Delhi, TECHNOMAC powers practices that refuse to compromise.
            </p>

          </div>

        </div>

      </div> */}
      <OurClients />
      {/* <CTASection /> */}
      <ReviewSection />
      <FAQSection />
      <EnquirySection />
     
    </Layout>
  );
}