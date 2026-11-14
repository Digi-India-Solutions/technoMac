import Head from "next/head";
import Layout from "../Component/layout/Layout";
import PrivacyPolicy from "../Component/privacy/PrivacyPolicy/PrivacyPolicy";

export default function PrivacyPolicyPage() {

  return (

    <Layout>
      <Head>
        <title>Privacy Policy | Technomac Medical Systems</title>
        <meta
          name="description"
          content="Privacy policy of Technomac Medical Systems Private Limited."
        />
      </Head>
      <PrivacyPolicy />

    </Layout>
  );
}