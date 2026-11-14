
import Head from "next/head";
import WarrantyForm from "../Component/warranty/WarrantyForm/WarrantyForm";
import Layout from "../Component/layout/Layout"
export default function WarrantyRegistrationPage() {

  return (

    <Layout>
      <Head>
        <title>Warranty Registration | Technomac Medical Systems</title>
        <meta
          name="description"
          content="Register your Technomac medical and dental equipment warranty online."
        />
      </Head>
      <WarrantyForm />

    </Layout>
  );
}