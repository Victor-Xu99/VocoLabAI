import { MusicReactiveHeroSection } from "@/components/ui/music-reactive-hero-section";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Feature108 } from "@/components/ui/feature108";
import Casestudies from "@/components/ui/case-studies";
import FAQSection from "@/components/ui/faq-section";
import { Footer } from "@/components/ui/footer-section";

export default function Home() {
  return (
    <main>
      <NavBar />
      <MusicReactiveHeroSection />
      <Feature108 />
      <Casestudies />
      <FAQSection />
      <Footer />
    </main>
  );
}
