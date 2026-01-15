import { Button } from "@/components/ui/button";
import { Download, ArrowDown } from "lucide-react";
import { NavBar } from "@/components/ui/tubelight-navbar";
import { Footer } from "@/components/ui/footer-section";

export const metadata = {
  title: "Download - VocoLabAI",
  description: "Download VocoLabAI and start improving your speech today",
};

export default function DownloadPage() {
  return (
    <main>
      <NavBar />
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-primary/5 flex items-center justify-center">
      <div className="container px-4 flex flex-col items-center justify-center text-center space-y-8">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
          Download VocoLabAI
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl">
          Start your journey to better speech with our AI-powered training platform
        </p>

        {/* Animated Arrow */}
        <div className="relative flex flex-col items-center gap-4 py-8">
          <div className="animate-bounce">
            <ArrowDown className="w-12 h-12 text-primary" strokeWidth={2.5} />
          </div>
          
          {/* Download Button */}
          <Button
            size="lg"
            className="text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl hover:shadow-primary/20 transition-all duration-300 hover:scale-105"
          >
            <Download className="mr-2 h-5 w-5" />
            Download Now
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          Available for Windows, macOS, and Linux
        </p>
      </div>
    </div>
    <Footer />
    </main>
  );
}
