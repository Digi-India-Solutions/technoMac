import Head from "next/head";
import Layout from "../Component/layout/Layout";

import CataloguePage from "../Component/catalogue/CataloguePage/CataloguePage";

export default function Catalogue() {

  return (

    <Layout>
      <Head>
        <title>Product Catalogue | Technomac Medical Systems</title>
        <meta
          name="description"
          content="Download and view product catalogues of dental machines and medical systems by Technomac Medical Systems Private Limited."
        />
      </Head>
      <CataloguePage />

    </Layout>
  );
}