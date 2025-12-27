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
  badge = "VocoLabAI",
  heading = "Transform Your Speech with AI-Powered Training",
  description = "Join thousands improving their pronunciation with personalized, intelligent feedback.",
  tabs = [
    {
      value: "tab-1",
      icon: <Mic className="h-auto w-4 shrink-0" />,
      label: "AI Speech Analysis",
      content: {
        badge: "Advanced Technology",
        title: "Phoneme-level precision feedback.",
        description:
          "Our AI combines Whisper transcription and Azure Speech Services to analyze your pronunciation at the deepest level, identifying exact phoneme substitutions and articulation errors.",
        buttonText: "Start Training",
        imageSrc:
          "https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800&q=80",
        imageAlt: "AI Speech Analysis visualization",
      },
    },
    {
      value: "tab-2",
      icon: <Volume2 className="h-auto w-4 shrink-0" />,
      label: "Real-Time Feedback",
      content: {
        badge: "Instant Results",
        title: "Get immediate pronunciation insights.",
        description:
          "Record your speech and receive instant, detailed feedback on your pronunciation, complete with visual phoneme charts and personalized articulation tips.",
        buttonText: "Try Demo",
        imageSrc:
          "https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=800&q=80",
        imageAlt: "Real-time feedback interface",
      },
    },
    {
      value: "tab-3",
      icon: <TrendingUp className="h-auto w-4 shrink-0" />,
      label: "Track Progress",
      content: {
        badge: "Data-Driven Growth",
        title: "Watch your improvement over time.",
        description:
          "Monitor your pronunciation journey with comprehensive analytics. Track phoneme accuracy, identify patterns, and celebrate your progress with detailed historical data.",
        buttonText: "View Dashboard",
        imageSrc:
          "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
        imageAlt: "Progress tracking dashboard",
      },
    },
  ],
}: Feature108Props) => {
  return (
    <section className="py-32 bg-white">
      {/* Gradient transition from black to white */}
      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black to-white pointer-events-none"></div>
      
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900">Features</h2>
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
          <div className="mx-auto mt-8 max-w-screen-xl rounded-2xl bg-muted/70 p-6 lg:p-16">
            {tabs.map((tab) => (
              <TabsContent
                key={tab.value}
                value={tab.value}
                className="grid place-items-center gap-20 lg:grid-cols-2 lg:gap-10"
              >
                <div className="flex flex-col gap-5">
                  <Badge variant="outline" className="w-fit bg-background">
                    {tab.content.badge}
                  </Badge>
                  <h3 className="text-3xl font-semibold lg:text-5xl">
                    {tab.content.title}
                  </h3>
                  <p className="text-muted-foreground lg:text-lg">
                    {tab.content.description}
                  </p>
                  <Button className="mt-2.5 w-fit gap-2" size="lg">
                    {tab.content.buttonText}
                  </Button>
                </div>
                <img
                  src={tab.content.imageSrc}
                  alt={tab.content.imageAlt}
                  className="rounded-xl w-full h-auto object-cover"
                />
              </TabsContent>
            ))}
          </div>
        </Tabs>
      </div>
    </section>
  );
};

export { Feature108 };
