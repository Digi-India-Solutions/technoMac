import Head from "next/head";
import Layout from "../Component/layout/Layout";
import CertificatePage from "../Component/certificate/CertificatePage/CertificatePage";

export default function Certificates() {

  return (

    <Layout>
      <Head>
        <title>Certificates & Quality Assurance | Technomac Medical Systems</title>
        <meta
          name="description"
          content="Quality assurance, ISO certifications, and regulatory compliances of Technomac Medical Systems Private Limited."
        />
      </Head>
      <CertificatePage />

    </Layout>
  );
}