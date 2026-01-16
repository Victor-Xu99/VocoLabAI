"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { Mic, Brain, TrendingUp } from "lucide-react";
import Image from "next/image";

// Avoid SSR hydration issues by loading react-countup on the client.
const CountUp = dynamic(() => import("react-countup"), { ssr: false });

/** Hook: respects user's motion preferences */
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !("matchMedia" in window)) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    setReduced(mq.matches);
    mq.addEventListener?.("change", onChange);
    return () => mq.removeEventListener?.("change", onChange);
  }, []);
  return reduced;
}

/** Utility: parse a metric like "98%", "3.8x", "$1,200+", "1.5M", "€23.4k" */
function parseMetricValue(raw: string) {
  const value = (raw ?? "").toString().trim();
  const m = value.match(
    /^([^\d\-+]*?)\s*([\-+]?\d{1,3}(?:,\d{3})*(?:\.\d+)?)\s*([^\d\s]*)$/
  );
  if (!m) {
    return { prefix: "", end: 0, suffix: value, decimals: 0 };
  }
  const [, prefix, num, suffix] = m;
  const normalized = num.replace(/,/g, "");
  const end = parseFloat(normalized);
  const decimals = (normalized.split(".")[1]?.length ?? 0);
  return {
    prefix: prefix ?? "",
    end: isNaN(end) ? 0 : end,
    suffix: suffix ?? "",
    decimals,
  };
}

/** Small component: one animated metric */
function MetricStat({
  value,
  label,
  sub,
  duration = 1.6,
}: {
  value: string;
  label: string;
  sub?: string;
  duration?: number;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const { prefix, end, suffix, decimals } = parseMetricValue(value);

  return (
    <div className="flex flex-col gap-2 text-left p-6">
      <p
        className="text-2xl font-medium text-gray-900 dark:text-white sm:text-4xl"
        aria-label={`${label} ${value}`}
      >
        {prefix}
        {reduceMotion ? (
          <span>
            {end.toLocaleString(undefined, {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            })}
          </span>
        ) : (
          <CountUp
            end={end}
            decimals={decimals}
            duration={duration}
            separator=","
            enableScrollSpy
            scrollSpyOnce
          />
        )}
        {suffix}
      </p>
      <p className="font-medium text-gray-900 dark:text-white text-left">
        {label}
      </p>
      {sub ? (
        <p className="text-gray-600 dark:text-gray-400 text-left">{sub}</p>
      ) : null}
    </div>
  );
}

export default function Casestudies() {
  const caseStudies = [
    {
      id: 1,
      quote:
        "VocoLabAI has transformed how we deliver therapy. The progress data I receive helps me adjust treatment plans weekly, and my families love having structured practice between sessions. We're seeing faster progress in our patients.",
      name: "Dr. Jennifer Martinez, CCC-SLP",
      role: "Pediatric Speech-Language Pathologist",
      image:
        "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&q=80",
      icon: Mic,
      metrics: [
        { value: "2.5x", label: "Practice Frequency", sub: "Daily vs weekly sessions" },
        { value: "40%", label: "Faster Progress", sub: "Compared to traditional homework" },
      ],
    },
    {
      id: 2,
      quote:
        "As a parent, I finally have a tool that helps me support my 5-year-old's speech therapy at home. The exercises are engaging for him, and I love seeing his progress data that I can share with his SLP.",
      name: "Lisa Thompson",
      role: "Parent & Healthcare Professional",
      image:
        "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&q=80",
      icon: Brain,
      metrics: [
        { value: "87%", label: "Home Completion Rate", sub: "Of assigned exercises" },
        { value: "4.8/5", label: "Family Satisfaction", sub: "Parent feedback rating" },
      ],
    },
    {
      id: 3,
      quote:
        "The phoneme-level tracking has been invaluable for documenting treatment outcomes. I can now provide concrete data showing improvement in specific speech sounds, which helps with insurance authorizations and family communication.",
      name: "Robert Chen, M.S., CCC-SLP",
      role: "Clinical Director, Pediatric Speech Clinic",
      image:
        "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&q=80",
      icon: TrendingUp,
      metrics: [
        { value: "95%", label: "SLP Approval Rate", sub: "Would recommend to colleagues" },
        { value: "3.2x", label: "Therapeutic Dosage", sub: "Increase in practice minutes" },
      ],
    },
  ];

  return (
    <section
      className="py-32 bg-gradient-to-b from-pink-50 via-white to-blue-50"
      aria-labelledby="case-studies-heading"
    >
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 text-center max-w-2xl mx-auto">
          <h2
            id="case-studies-heading"
            className="text-4xl font-semibold md:text-5xl text-foreground"
          >
            Trusted by Speech-Language Pathologists and Families
          </h2>
          <p className="text-muted-foreground">
            See how VocoLabAI is transforming pediatric speech therapy by bridging the gap between clinical sessions and daily practice.
          </p>
        </div>

        {/* Cases */}
        <div className="mt-20 flex flex-col gap-20">
          {caseStudies.map((study, idx) => {
            const reversed = idx % 2 === 1;
            const isLast = idx === caseStudies.length - 1;
            return (
              <div
                key={study.id}
                className={`grid gap-12 lg:grid-cols-3 xl:gap-24 items-center ${!isLast ? 'border-b border-gray-200 dark:border-gray-800 pb-12' : ''}`}
              >
                {/* Left: Image + Quote */}
                <div
                  className={[
                    "flex flex-col sm:flex-row gap-10 lg:col-span-2 lg:border-r lg:pr-12 xl:pr-16 text-left",
                    reversed
                      ? "lg:order-2 lg:border-r-0 lg:border-l border-gray-200 dark:border-gray-800 lg:pl-12 xl:pl-16 lg:pr-0"
                      : "border-gray-200 dark:border-gray-800",
                  ].join(" ")}
                >
                  <div className="relative aspect-[29/35] h-auto w-full max-w-60 rounded-2xl overflow-hidden shadow-2xl border-4 border-white hover:scale-105 transition-all duration-300">
                    <Image
                      src={study.image}
                      alt={`${study.name} portrait`}
                      width={300}
                      height={400}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                  <figure className="flex flex-col justify-between gap-8 text-left">
                    <blockquote className="text-lg sm:text-xl text-foreground leading-relaxed text-left">
                      <h3 className="text-lg sm:text-xl lg:text-xl font-normal text-gray-900 dark:text-white leading-relaxed text-left">
                        Success Story{" "}
                        <span className="block text-gray-500 dark:text-gray-400 text-sm sm:text-base lg:text-lg mt-2">
                          {study.quote}
                        </span>
                      </h3>
                    </blockquote>
                    <figcaption className="flex items-center gap-6 mt-4 text-left">
                      <div className="flex flex-col gap-1">
                        <span className="text-md font-medium text-foreground">
                          {study.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {study.role}
                        </span>
                      </div>
                    </figcaption>
                  </figure>
                </div>

                {/* Right: Metrics */}
                <div
                  className={[
                    "grid grid-cols-1 gap-10 self-center text-left",
                    reversed ? "lg:order-1" : "",
                  ].join(" ")}
                >
                  {study.metrics.map((metric, i) => (
                    <MetricStat
                      key={`${study.id}-${i}`}
                      value={metric.value}
                      label={metric.label}
                      sub={metric.sub}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
