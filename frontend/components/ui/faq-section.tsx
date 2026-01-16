"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Is VocoLabAI a replacement for professional speech therapy?",
    answer: "No. VocoLabAI is designed as a clinical tool that operates under speech-language pathologist (SLP) oversight. It extends therapy beyond the treatment room by providing supervised home practice between clinical sessions, but professional guidance and assessment remain essential."
  },
  {
    question: "What age range is VocoLabAI designed for?",
    answer: "VocoLabAI is optimized for children ages 3-8, targeting the critical early childhood intervention window when speech patterns are most malleable. The exercises are designed to be engaging and developmentally appropriate for young children."
  },
  {
    question: "How does VocoLabAI help speech-language pathologists?",
    answer: "VocoLabAI generates actionable progress data including phoneme-level accuracy reports, error pattern analysis, and progress trends. This helps SLPs refine treatment plans, document outcomes, and make data-driven decisions about intervention strategies."
  },
  {
    question: "What type of data do parents and SLPs receive?",
    answer: "Both parents and SLPs receive detailed progress reports showing phoneme accuracy, practice completion rates, and improvement trends over time. SLPs have access to additional clinical insights including specific error patterns and recommendations for treatment adjustments."
  },
  {
    question: "How is this different from consumer speech improvement apps?",
    answer: "VocoLabAI is positioned as a clinical tool designed with speech-language pathologists, not a consumer replacement for therapy. It operates under SLP oversight, uses evidence-based approaches, and generates clinical-grade data that informs professional treatment plans."
  },
  {
    question: "Is children's voice data secure and HIPAA compliant?",
    answer: "Yes. All audio recordings are encrypted in transit and at rest. We follow HIPAA guidelines for protected health information and maintain strict privacy controls. Data is only accessible to authorized SLPs and families, and can be deleted at any time."
  },
  {
    question: "How much practice time is recommended between sessions?",
    answer: "We recommend 10-15 minutes of daily practice between clinical sessions. This consistent daily practice, guided by structured exercises, helps bridge the gap between weekly therapy appointments and accelerates progress."
  },
  {
    question: "Can VocoLabAI be used in clinical settings?",
    answer: "Yes. Many SLPs use VocoLabAI during sessions as a practice tool, then assign exercises for home practice. The app integrates seamlessly into existing treatment protocols and provides data that enhances clinical decision-making."
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
            Common questions about VocoLabAI for speech-language pathologists and families.
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
