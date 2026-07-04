
import Footer from "./Footer/Footer";
import Header from "./Header/Header";
import WhatsAppChat from "../../Component/whatsapp/WhatsAppChat.js"
export default function Layout({ children }) {
  return (
    <>
      <Header />

      <main className="mainContent">
        {children}
      </main>
       <WhatsAppChat />
      <Footer />
    </>
  );
}