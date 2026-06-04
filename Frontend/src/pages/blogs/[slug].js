import { useRouter } from "next/router";

import Layout from "../../Component/layout/Layout";

import BlogDetails from "../../Component/blogs/BlogDetails/BlogDetails";

import { blogs } from "../../../Data/blogs";

export default function BlogDetailPage() {

  const router = useRouter();

  const { slug } = router.query;

  const blog = blogs.find(
    (item) => item.slug === slug
  );

  if (!blog) return null;

  return (

    <Layout>

      <BlogDetails blog={blog} />

    </Layout>
  );
}