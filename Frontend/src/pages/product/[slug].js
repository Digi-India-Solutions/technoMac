import { useRouter } from "next/router";
import Layout from "../../Component/layout/Layout";
import products from "../../../Data/products";

import ProductDetails from "../../Component/products/ProductDetails/ProductDetails";

export default function ProductDetailPage() {

  // const router = useRouter();
  // const { slug } = router.query;
  // const product = products.find(
  //   (item) => item.slug === slug
  // );

  // if (!product) return null;

  return (
    <Layout>

      <ProductDetails  />

    </Layout>
  );
}