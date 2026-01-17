"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mic, Volume2, TrendingUp } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface TabContent {
  badge: string;
  title: string;
  description: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
}

interface Tab {
  value: string;
  icon: React.ReactNode;
  label: string;
  content: TabContent;
}

interface Feature108Props {
  badge?: string;
  heading?: string;
  description?: string;
  tabs?: Tab[];
}

const Feature108 = ({
  badge = "For Families & SLPs",
  heading = "Extending Speech Therapy Beyond the Treatment Room",
  description = "A warm, child-friendly app that helps families practice between sessions while giving speech-language pathologists the data they need.",
  tabs = [
    {
      value: "tab-1",
      icon: <Mic className="h-auto w-4 shrink-0" />,
      label: "Home Practice",
      content: {
        badge: "Parent's Perspective",
        title: "Finally, a way to help at home that actually works.",
        description:
          "\"As a parent, I used to feel helpless between therapy sessions. VocoLabAI gives me structured exercises my 5-year-old actually enjoys. We practice together for 10 minutes each day, and I can see his progress. His SLP loves having this data—it makes our sessions so much more productive.\"",
        buttonText: "Learn More",
        imageSrc:
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
        imageAlt: "Happy child practicing speech therapy at home with parent",
      },
    },
    {
      value: "tab-2",
      icon: <Volume2 className="h-auto w-4 shrink-0" />,
      label: "Progress Tracking",
      content: {
        badge: "For SLPs",
        title: "See progress between sessions, not just during them.",
        description:
          "Speech-language pathologists receive detailed phoneme-level accuracy reports, error patterns, and progress trends. \"Having daily practice data completely changed how I adjust treatment plans. I can see exactly which sounds need more work and celebrate the wins with families.\" - Dr. Jennifer Martinez, CCC-SLP",
        buttonText: "View Features",
        imageSrc:
          "https://images.unsplash.com/photo-1516627145497-ae6968895b74?w=800&q=80",
        imageAlt: "Young child engaging happily with speech therapy app",
      },
    },
    {
      value: "tab-3",
      icon: <TrendingUp className="h-auto w-4 shrink-0" />,
      label: "Fun & Engaging",
      content: {
        badge: "Ages 3-8",
        title: "Practice that feels like play, not work.",
        description:
          "\"My daughter asks to practice now! The games make it fun, and she doesn't realize she's working on her speech sounds. We target those critical early years when progress happens fastest, making therapy feel like a natural part of playtime.\"",
        buttonText: "See How It Works",
        imageSrc:
          "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80",
        imageAlt: "Child playing and learning with speech therapy activities",
      },
    },
  ],
}: Feature108Props) => {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <p className="text-blue-600 font-semibold text-sm uppercase tracking-wide mb-2">{badge}</p>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">{heading}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>
        </div>
        <Tabs defaultValue={tabs[0].value} className="mt-8">
          <TabsList className="container flex flex-col items-center justify-center gap-4 sm:flex-row md:gap-10 bg-transparent border-0">
            {tabs.map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-gray-500 data-[state=active]:bg-transparent data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none"
              >
                {tab.icon} {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <div className="mx-auto mt-8 max-w-screen-xl rounded-2xl bg-white p-6 lg:p-16 shadow-lg border border-gray-100">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="grid place-items-center gap-12 lg:grid-cols-2 lg:gap-16"
              >
                <div className="flex flex-col gap-6">
                  <Badge variant="outline" className="w-fit bg-blue-50 text-blue-700 border-blue-200">
                    {tab.content.badge}
                  </Badge>
                  <h3 className="text-3xl font-bold lg:text-5xl text-gray-900 leading-tight">
                    {tab.content.title}
                  </h3>
                  <p className="text-gray-700 lg:text-lg leading-relaxed italic">
                    {tab.content.description}
                  </p>
                  <Button className="mt-2.5 w-fit gap-2 bg-blue-600 hover:bg-blue-700" size="lg">
                    {tab.content.buttonText}
                  </Button>
                </div>
                <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                  <img
                    src={tab.content.imageSrc}
                    alt={tab.content.imageAlt}
                    className="w-full h-auto object-cover rounded-xl"
                  />
                </div>
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature108 };
