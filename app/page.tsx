import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsappButton from "@/components/WhatsappButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Contact />
      <Footer />
      <WhatsappButton />
    </>
  );
}