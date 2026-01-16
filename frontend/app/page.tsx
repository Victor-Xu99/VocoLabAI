import { GradientWave } from "@/components/ui/gradient-wave";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Feature108 } from "@/components/ui/feature108";
import Casestudies from "@/components/ui/case-studies";
import FAQSection from "@/components/ui/faq-section";
import { Footer } from "@/components/ui/footer-section";

export default function Home() {
  return (
    <div className="relative">
      <section className="relative w-full h-screen overflow-hidden">
        {/* Animated gradient background */}
        <GradientWave 
          className="opacity-70" 
          colors={["#38bdf8", "#ffffff", "#38bdf8"]}
        />
        
        {/* Content */}
        <div className="relative z-10 flex items-center justify-center w-full h-full">
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-center bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent px-4">
            VocoLabAI
          </h1>
        </div>
        
        {/* NavBar inside hero section to overlay properly */}
        <div className="absolute top-0 left-0 right-0 z-20">
          <NavBar />
        </div>
      </section>
      
      <main className="relative">
        <Feature108 />
        <Casestudies />
        <FAQSection />
        <Footer />
      </main>
    </div>
  );
}
