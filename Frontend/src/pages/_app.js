import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/css";
import "swiper/css/navigation";
import "aos/dist/aos.css";

import "../../styles/globals.css";

import EnquiryPopup from "../Component/GlobalPopup/EnquiryPopup";
 import Head from "next/head";

export default function App({
  Component,
  pageProps,
}) {

  return (

    <>
      <Head>
        <title>Technomac Medical Systems Private Limited</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta
          name="description"
          content="Technomac Medical Systems Private Limited is a leading manufacturer and exporter of dental X-Ray machines, dental chairs, and medical equipment since 1999."
        />
        <link
          rel="icon"
          type="image/jpeg"
          href="/favicon.jpeg"
        />
      </Head>
      <Component
        {...pageProps}
      />
      <EnquiryPopup />

    </>

  );
}