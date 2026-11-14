import Head from "next/head";
import Breadcrumb from "../Component/common/Breadcrumb/Breadcrumb";
import ContactPage from "../Component/contact/ContactPage/ContactPage";
import Layout from "../Component/layout/Layout";

export default function Contact() {

  return (

    <Layout>
      <Head>
        <title>Contact Us | Technomac Medical Systems Private Limited</title>
        <meta
          name="description"
          content="Get in touch with Technomac Medical Systems Private Limited for inquiries, sales, and service of dental and medical equipment."
        />
      </Head>
      <ContactPage />
    </Layout>
  );
}