"use client"

import { Mic, Sparkles } from "lucide-react"
import { PricingSection } from "@/components/ui/pricing-section"
import { NavBar } from "@/components/ui/tubelight-navbar"
import { Footer } from "@/components/ui/footer-section"

const pricingTiers = [
  {
    name: "Free",
    price: {
      monthly: 0,
      yearly: 0,
    },
    description: "Perfect for trying out VocoLabAI",
    icon: (
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-500/30 to-gray-500/30 blur-2xl rounded-full" />
        <Mic className="w-7 h-7 relative z-10 text-gray-500 dark:text-gray-400" />
      </div>
    ),
    features: [
      {
        name: "10 Practice Sessions",
        description: "Limited sessions to test the platform",
        included: true,
      },
      {
        name: "Basic Pronunciation Feedback",
        description: "AI-powered phoneme analysis",
        included: true,
      },
      {
        name: "Progress Tracking",
        description: "View your improvement over time",
        included: true,
      },
      {
        name: "Personalized Exercises",
        description: "Adaptive practice sentences",
        included: false,
      },
      {
        name: "Advanced Analytics",
        description: "Detailed phoneme-level insights",
        included: false,
      },
    ],
  },
  {
    name: "Pro",
    price: {
      monthly: 29,
      yearly: 290,
    },
    description: "Ideal for serious learners",
    highlight: true,
    badge: "Most Popular",
    icon: (
      <div className="relative">
        <Sparkles className="w-7 h-7 relative z-10" />
      </div>
    ),
    features: [
      {
        name: "Unlimited Practice Sessions",
        description: "Practice as much as you want",
        included: true,
      },
      {
        name: "Advanced AI Feedback",
        description: "Detailed pronunciation analysis with Claude AI",
        included: true,
      },
      {
        name: "Personalized Exercises",
        description: "Adaptive sentences based on your weak points",
        included: true,
      },
      {
        name: "Advanced Analytics",
        description: "Phoneme-level tracking and historical data",
        included: true,
      },
      {
        name: "Priority Support",
        description: "24/7 email support with quick response",
        included: true,
      },
    ],
  },
]

export default function PricingPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <NavBar />
      <div className="pt-24">
        <div className="text-center py-12 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Get Started with VocoLabAI
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the perfect plan for your speech training journey
          </p>
        </div>
        <PricingSection tiers={pricingTiers} />
      </div>
      <Footer />
    </main>
  )
}
