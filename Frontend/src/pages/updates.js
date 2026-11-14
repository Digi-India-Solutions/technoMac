import Head from "next/head";
import Layout from "../Component/layout/Layout";

import UpdatesPage from "../Component/updates/UpdatesPage";

export default function Updates() {

  return (

    <Layout>
      <Head>
        <title>Updates & News | Technomac Medical Systems</title>
        <meta
          name="description"
          content="Latest updates, innovations, and news from Technomac Medical Systems Private Limited."
        />
      </Head>
      <UpdatesPage />

    </Layout>
  );
}