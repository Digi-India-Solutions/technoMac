import Head from "next/head";
import Layout from "../Component/layout/Layout";
import AboutPage from "../Component/about/AboutPage/AboutPage";
import Breadcrumb from "../Component/common/Breadcrumb/Breadcrumb";
export default function About() {

  return (
    <Layout>
      <Head>
        <title>About Us | Technomac Medical Systems Private Limited</title>
        <meta
          name="description"
          content="Learn about Technomac Medical Systems Private Limited, pioneering high-quality dental and medical equipment manufacturing since 1999."
        />
      </Head>
      <AboutPage />
    </Layout>
  );
}