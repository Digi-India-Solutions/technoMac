import "bootstrap/dist/css/bootstrap.min.css";
import "swiper/css";
import "swiper/css/navigation";
import "aos/dist/aos.css";

import "../../styles/globals.css";

import EnquiryPopup from "../Component/GlobalPopup/EnquiryPopup";

export default function App({
  Component,
  pageProps,
}) {

  return (

    <>

      <Component
        {...pageProps}
      />

      <EnquiryPopup />

    </>

  );
}