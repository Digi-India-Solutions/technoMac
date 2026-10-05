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