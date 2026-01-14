"use client"

import { NavBar } from "@/components/ui/tubelight-navbar"
import { Footer } from "@/components/ui/footer-section"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <NavBar />

      {/* Big black bar for About heading */}
      <div className="w-full bg-black py-32">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white text-center">
          About Us
        </h1>
      </div>

      {/* Real Impact Section */}
      <section className="py-32 bg-background" aria-labelledby="about-results-heading">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
            <h2
              id="about-results-heading"
              className="text-4xl font-semibold md:text-5xl text-foreground"
            >
              Real Impact of VocoLabAI
            </h2>
            <p className="text-muted-foreground">
              From improving pronunciation to boosting confidence in communication, VocoLabAI empowers users to achieve their speech goals effectively.
            </p>
          </div>

      {/* Intro text with image */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto px-4">
        {/* Image */}
        <div className="flex justify-center md:justify-start">
            <img
            src="/talking.jpg"
            alt="VocoLabAI speech practice illustration"
            className="w-full max-w-md rounded-xl shadow-lg"
            />
        </div>

        {/* Text */}
        <div className="space-y-6 text-center md:text-left">
            <p className="text-lg text-muted-foreground">
            VocoLabAI is a revolutionary speech training platform designed to help learners improve their pronunciation using advanced AI feedback.
            </p>
            <p className="text-lg text-muted-foreground">
            Our mission is to make speech practice accessible, interactive, and personalized for everyone, whether you're a beginner or an advanced speaker.
            </p>
            <p className="text-lg text-muted-foreground">
            With VocoLabAI, you can track your progress, get detailed insights, and practice anytime, anywhere. Join thousands of users improving their speech skills today!
            </p>
        </div>
        </div>
        </div>
      </section>

      {/* About Us Detailed Sections */}
      <section className="py-24 bg-background">
        <div className="max-w-5xl mx-auto px-6 space-y-20">
          {/* What We Offer */}
          <div className="space-y-4 text-center">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              What We Offer
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl">
              VocoLabAI offers a variety of features designed to make speech training effective and engaging:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-2">Personalized Feedback</h3>
              <p className="text-muted-foreground">
                Our AI analyzes pronunciation, intonation, and fluency, offering guidance tailored to each user.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-2">Adaptive Exercises</h3>
              <p className="text-muted-foreground">
                Practice sentences and exercises adjust based on your performance, focusing on areas that need improvement.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
              <p className="text-muted-foreground">
                Visual dashboards allow users to monitor improvement over time and celebrate milestones.
              </p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-bold mb-2">Accessible Anywhere</h3>
              <p className="text-muted-foreground">
                Practice on desktop or mobile, whenever and wherever it’s convenient.
              </p>
            </div>
          </div>

       {/* Our Vision */}
        <div className="space-y-20 mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        {/* Text */}
        <div className="space-y-4 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
            Our Vision
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl">
            We envision a world where communication is not a barrier but a bridge.
            VocoLabAI strives to remove obstacles that learners face when improving
            their speech. By leveraging technology and AI, we aim to provide an
            affordable, accessible, and highly effective solution that helps everyone
            achieve clear, confident communication.
            </p>
        </div>

        {/* Image */}
        <div className="flex justify-center md:justify-end">
            <img
            src="/speaker.jpg"
            alt="VocoLabAI vision illustration"
            className="w-full max-w-md rounded-xl shadow-lg"
            />
        </div>
        </div>

          {/* Why Choose Us */}
          <div className="space-y-4 text-center mt-12">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground">
              Why Choose VocoLabAI?
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl">
              Unlike traditional speech training methods, VocoLabAI combines precision AI analytics with practical exercises that are fun and engaging. We focus on real-world applications, helping users sound natural and confident in professional, academic, and social settings.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}
