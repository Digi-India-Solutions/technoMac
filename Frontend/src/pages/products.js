import Head from "next/head";
import Layout from "../Component/layout/Layout";
import ProductPage from "../Component/products/ProductPage/ProductPage";


export default function Products() {

  return (
    <Layout>
      <Head>
        <title>Dental & Medical Equipment Products | Technomac Medical Systems</title>
        <meta
          name="description"
          content="Explore our range of dental X-Ray machines, dental chairs, and medical equipment from Technomac Medical Systems Private Limited."
        />
      </Head>
      <ProductPage />

    </Layout>
  );
}