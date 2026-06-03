import { useRouter } from "next/router";

import Layout from "../../Component/layout/Layout";

import updates from "../../../Data/updates";

import UpdateDetails from "../../Component/updates/UpdateDetails";

export default function UpdateDetailPage() {

  const router = useRouter();

  const { slug } = router.query;

  const updateData =
    updates.find(
      (item) => item.slug === slug
    );

  if (!updateData) return null;

  return (

    <Layout>

      <UpdateDetails item={updateData} />

    </Layout>
  );
}