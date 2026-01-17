"use client";

import { GradientWave } from "@/components/ui/gradient-wave";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Feature108 } from "@/components/ui/feature108";
import Casestudies from "@/components/ui/case-studies";
import FAQSection from "@/components/ui/faq-section";
import { Footer } from "@/components/ui/footer-section";
import { TextEffect } from "@/components/ui/text-effect";
import { useState, memo } from "react";
import { motion } from "framer-motion";

const HeroContent = memo(() => {
  const [sloganComplete, setSloganComplete] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  return (
    <div className="relative z-10 flex flex-col items-center justify-center w-full h-full gap-6">
      {/* Title - always takes up space but invisible at first */}
      <motion.h1 
        initial={{ opacity: 0 }}
        animate={{ opacity: showTitle ? 1 : 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-6xl md:text-8xl lg:text-9xl font-bold text-center bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 bg-clip-text text-transparent px-4"
      >
        VocoLabAI
      </motion.h1>
      
      <motion.div
        animate={{ y: sloganComplete ? 0 : -150 }}
        transition={{ duration: 0.6, ease: "easeInOut", delay: sloganComplete ? 0.3 : 0 }}
        onAnimationComplete={() => {
          if (sloganComplete) {
            setTimeout(() => setShowTitle(true), 100);
          }
        }}
      >
        <TextEffect 
          per='char' 
          preset='blur'
          className="text-xl md:text-2xl lg:text-3xl text-center text-gray-700 font-medium px-4 max-w-4xl"
          variants={{
            container: {
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.025,
                },
              },
            },
            item: {
              hidden: { opacity: 0, filter: 'blur(12px)' },
              visible: { opacity: 1, filter: 'blur(0px)' },
            },
          }}
          onAnimationComplete={() => {
            setTimeout(() => setSloganComplete(true), 300);
          }}
        >
          POWERING EVERYDAY PRACTICE WITH CLININIAL EXPERTISE
        </TextEffect>
      </motion.div>
    </div>
  );
});

HeroContent.displayName = 'HeroContent';

export default function Home() {
  return (
    <div className="relative">
      <section className="relative w-full h-screen overflow-hidden">
        {/* Animated gradient background */}
        <GradientWave 
          className="opacity-70" 
          colors={["#38bdf8", "#ffffff", "#38bdf8"]}
        />
        
        {/* Gradient overlay for seamless transition */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-b from-transparent via-white/50 to-white z-[5] pointer-events-none" />
        
        {/* Content */}
        <HeroContent />
        
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
