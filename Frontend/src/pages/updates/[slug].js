// import { useRouter } from "next/router";
// import { useEffect, useState } from "react";
// import Layout from "../../Component/layout/Layout";
// import UpdateDetails from "../../Component/updates/UpdateDetails";
// import { getData } from "../../services/FetchNodeServices";

// export default function UpdateDetailPage() {
//   const router = useRouter();
//   const { slug } = router.query;

//   const [updateData, setUpdateData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [notFound, setNotFound] = useState(false);

//   useEffect(() => {
//     if (!slug) return; // wait for router ready

//     const fetchUpdate = async () => {
//       setLoading(true);
//       try {
//         const res = await getData(`newupdate/subtitle/${slug}`);
//         if (res?.success) {
//           const found = res.data
//           if (found) {
//             setUpdateData(found);
//           } else {
//             setNotFound(true);
//           }
//         } else {
//           setNotFound(true);
//         }
//       } catch (e) {
//         console.error("Failed to fetch update:", e?.message);
//         setNotFound(true);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchUpdate();
//   }, [slug]); // re-run whenever slug changes

//   // ── Loading ──
//   if (loading) {
//     return (
//       <Layout>
//         <div style={{
//           minHeight: "60vh",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//         }}>
//           <div style={{
//             width: 48, height: 48,
//             border: "4px solid #e5e7eb",
//             borderTopColor: "#3b82f6",
//             borderRadius: "50%",
//             animation: "spin 0.8s linear infinite",
//           }} />
//           <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//         </div>
//       </Layout>
//     );
//   }

//   // ── Not Found ──
//   if (notFound || !updateData) {
//     return (
//       <Layout>
//         <div style={{
//           minHeight: "60vh",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: 16,
//           textAlign: "center",
//           padding: "0 20px",
//         }}>
//           <h2 style={{ fontSize: 24, color: "#f1f5f9", margin: 0 }}>
//             Update not found
//           </h2>
//           <p style={{ color: "#94a3b8", margin: 0 }}>
//             The update <strong style={{ color: "#e2e8f0" }}>&ldquo;{slug}&rdquo;</strong> does not exist or may have been removed.
//           </p>
//           <button
//             onClick={() => router.push("/updates")}
//             style={{
//               background: "#3b82f6", color: "#fff",
//               border: "none", borderRadius: 8,
//               padding: "10px 24px", fontSize: 14,
//               fontWeight: 600, cursor: "pointer",
//             }}
//           >
//             ← Back to Updates
//           </button>
//         </div>
//       </Layout>
//     );
//   }

//   // ── Success ──
//   return (
//     <Layout>
//       <UpdateDetails item={updateData} />
//     </Layout>
//   );
// }

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Head from "next/head";
import Layout from "../../Component/layout/Layout";
import UpdateDetails from "../../Component/updates/UpdateDetails";
import { getData } from "../../services/FetchNodeServices";

export default function UpdateDetailPage() {
  const router = useRouter();
  const { slug } = router.query;

  const [updateData, setUpdateData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchUpdate = async () => {
      setLoading(true);
      try {
        // const res = await getData("newupdate/all");
        const res = await getData(`newupdate/subtitle/${slug}`);
        if (res?.success===true) {
          const found = res?.data;
          found ? setUpdateData(found) : setNotFound(true);
        } else {
          setNotFound(true);
        }
      } catch (e) {
        console.error("Failed to fetch update:", e?.message);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUpdate();
  }, [slug]);

  // ── Dynamic meta values ──
  const pageTitle = updateData
    ? `${updateData?.title} | TECHNOMAC`
    : "Update | TECHNOMAC";

  const pageDescription = updateData?.description
    ? updateData?.description?.slice(0, 160)
    : "Explore the latest healthcare equipment updates and innovations from TECHNOMAC.";

  const pageKeywords = updateData
    ? [
      updateData?.title,
      updateData?.subTitle,
      ...(updateData?.points || []),
      "TECHNOMAC",
      "dental equipment",
      "healthcare technology",
      "clinic setup",
      "dental chair",
      "medical equipment India",
    ]
      .filter(Boolean)
      .join(", ")
    : "TECHNOMAC, dental equipment, healthcare technology, clinic setup, medical equipment India";

  const pageImage = updateData?.image || "";
  const pageUrl = `https://www.technomac.in/updates/${slug}`;

  // ── Loading ──
  if (loading) {
    return (
      <>
        <Head>
          <title>Loading... | TECHNOMAC</title>
        </Head>
        <Layout>
          <div style={{
            minHeight: "60vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <div style={{
              width: 48, height: 48,
              border: "4px solid #e5e7eb",
              borderTopColor: "#3b82f6",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }} />
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          </div>
        </Layout>
      </>
    );
  }

  // ── Not Found ──
  if (notFound || !updateData) {
    return (
      <>
        <Head>
          <title>Update Not Found | TECHNOMAC</title>
          <meta name="robots" content="noindex, nofollow" />
        </Head>
        <Layout>
          <div style={{
            minHeight: "60vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            textAlign: "center",
            padding: "0 20px",
          }}>
            <h2 style={{ fontSize: 24, color: "#f1f5f9", margin: 0 }}>
              Update not found
            </h2>
            <p style={{ color: "#94a3b8", margin: 0 }}>
              The update <strong style={{ color: "#e2e8f0" }}>&ldquo;{slug}&rdquo;</strong> does not exist or may have been removed.
            </p>
            <button
              onClick={() => router.push("/updates")}
              style={{
                background: "#3b82f6", color: "#fff",
                border: "none", borderRadius: 8,
                padding: "10px 24px", fontSize: 14,
                fontWeight: 600, cursor: "pointer",
              }}
            >
              ← Back to Updates
            </button>
          </div>
        </Layout>
      </>
    );
  }
  // ── Success ──
  return (
    <>
      <Head>
        {/* ── Primary Meta ── */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta name="keywords" content={pageKeywords} />
        <meta name="author" content="TECHNOMAC" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={pageUrl} />

        {/* ── Open Graph (Facebook / WhatsApp / LinkedIn) ── */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        <meta property="og:image" content={pageImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content="TECHNOMAC" />

        {/* ── Twitter Card ── */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={pageTitle} />
        <meta name="twitter:description" content={pageDescription} />
        <meta name="twitter:image" content={pageImage} />

        {/* ── Article Meta ── */}
        <meta property="article:published_time" content={updateData?.createdAt} />
        <meta property="article:modified_time" content={updateData?.updatedAt} />
        <meta property="article:author" content="TECHNOMAC" />
        {(updateData?.points || []).map((pt, i) => (
          <meta key={i} property="article:tag" content={pt} />
        ))}
      </Head>

      <Layout>
        <UpdateDetails item={updateData} />
      </Layout>
    </>
  );
}