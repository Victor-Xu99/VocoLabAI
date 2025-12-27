"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "How does VocoLabAI analyze my pronunciation?",
    answer: "VocoLabAI uses advanced AI models including Whisper for transcription and Azure Speech Services for phoneme-level analysis. Our system identifies specific pronunciation errors and provides targeted feedback on sounds you need to practice."
  },
  {
    question: "What languages does VocoLabAI support?",
    answer: "Currently, VocoLabAI focuses on English pronunciation training with support for multiple accents. We're actively working on expanding to additional languages based on user demand."
  },
  {
    question: "Do I need special equipment to use VocoLabAI?",
    answer: "No special equipment needed! Any device with a microphone (laptop, tablet, or smartphone) and a modern web browser will work. For best results, we recommend using a quiet environment and a decent quality microphone or headset."
  },
  {
    question: "How long does it take to see improvement?",
    answer: "Most users notice measurable improvements within 2-3 weeks of consistent practice (15-20 minutes daily). Our AI tracks your progress at the phoneme level, so you can see exactly which sounds you're mastering over time."
  },
  {
    question: "Can VocoLabAI help with specific speech impediments?",
    answer: "VocoLabAI is designed for pronunciation training and accent reduction. While many users with mild speech challenges find it helpful, we recommend consulting with a speech-language pathologist for clinical speech therapy needs."
  },
  {
    question: "Is my voice data secure and private?",
    answer: "Absolutely. All audio recordings are encrypted in transit and at rest. We use your recordings solely to provide personalized feedback and never share your data with third parties. You can delete your recordings at any time from your account settings."
  },
  {
    question: "What's included in the free trial?",
    answer: "Our 14-day free trial gives you full access to all features: unlimited practice sessions, AI-powered feedback, progress tracking, and personalized exercises. No credit card required to start."
  },
  {
    question: "Can I use VocoLabAI offline?",
    answer: "Currently, VocoLabAI requires an internet connection to process your recordings through our AI services. We're exploring offline capabilities for future releases."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleQuestion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="w-full py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
      <div className="container px-4 md:px-6 mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to know about VocoLabAI and how it can help improve your speech.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden bg-white dark:bg-gray-900 transition-all duration-200 hover:shadow-md"
            >
              <button
                onClick={() => toggleQuestion(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left gap-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <span className="text-lg font-semibold text-gray-900 dark:text-white">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-gray-500 transition-transform duration-200 flex-shrink-0 ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              
              <div
                className={`overflow-hidden transition-all duration-200 ${
                  openIndex === index ? "max-h-96" : "max-h-0"
                }`}
              >
                <div className="px-6 pb-5 text-gray-600 dark:text-gray-400 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <p className="text-muted-foreground mb-4">
            Still have questions?
          </p>
          <a
            href="#"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background bg-primary text-primary-foreground hover:bg-primary/90 h-10 py-2 px-6"
          >
            Contact Support
          </a>
        </div>
      </div>
    </section>
  );
}
