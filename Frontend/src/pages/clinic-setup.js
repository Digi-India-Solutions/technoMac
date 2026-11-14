import Head from "next/head";
import ClinicSetup from "../Component/clinicSetup/ClinicSetup/ClinicSetup";
import Layout from "../Component/layout/Layout";

export default function ClinicSetupPage() {

  return (

    <Layout>
      <Head>
        <title>Dental Clinic Setup Solutions | Technomac Medical Systems</title>
        <meta
          name="description"
          content="Complete dental clinic setup and turnkey solutions by Technomac Medical Systems Private Limited."
        />
      </Head>
      <ClinicSetup />

    </Layout>
  );
}