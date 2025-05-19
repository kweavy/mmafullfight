import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import PopularSearches from "@/components/PopularSearches";
import { Sword, Users, Trophy, Dumbbell } from "lucide-react";
import HeroSlider from "@/components/fight/hero-slider";
import FightSimulator from "@/components/fight/fight-simulator";
import PopularMatchupsSection from "@/components/fight/popular-matchup";
import { Card } from "@/components/ui/card";

// === SEO ===
export const dynamic = "force-static";

export async function generateMetadata(): Promise<Metadata> {
  const title = "UFC Fight Simulator Online – Free Dream Match Generator";
  const description =
    "Simulate UFC fights for free using AI. Create fight cards, generate match results, and experience round-by-round fight simulations with commentary.";

  return {
    title,
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mmawatch.com"),
    alternates: {
      canonical: "/fight-simulator-ai",
    },
    openGraph: {
      title,
      description,
      url: "/fight-simulator-ai",
      siteName: "UFC Fight Simulator",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    keywords: [
      // 🎯 From autocomplete screenshot
      "ufc fight simulator",
      "ufc fight simulator online",
      "ufc fight card simulator",
      "free ufc fight simulator script",
      "free ufc fight simulator",
      "free ufc fight simulator game",
      "ufc simulator",
      "ufc simulator game",
      "ufc fight simulation",
      "ufc undisputed 3 simulation",
      "mma fight simulator",
      "ai ufc fight simulation",
      "generate ufc fight card",
      "dream ufc fight matchups",
      "ufc fight prediction ai",
      "simulate mma fights online",
    ],
  };
}


// === Page ===
export default function FightSimulatorAIPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black text-white">
        {/* Hero Section */}
        <HeroSlider />

        {/* Feature Cards */}
        <section className="bg-gradient-to-b from-black to-zinc-900">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-5">How It Works</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Users className="w-10 h-10 text-red-500" />}
                title="Pick Fighters"
                description="Choose any two UFC fighters across all divisions"
              />
              <FeatureCard
                icon={<Dumbbell className="w-10 h-10 text-red-500" />}
                title="Compare Stats"
                description="AI analyzes fighting styles and statistics"
              />
              <FeatureCard
                icon={<Sword className="w-10 h-10 text-red-500" />}
                title="Watch Simulation"
                description="Round-by-round breakdown of the action"
              />
              <FeatureCard
                icon={<Trophy className="w-10 h-10 text-red-500" />}
                title="Get Results"
                description="See who wins and how the fight ends"
              />
            </div>
          </div>
        </section>

        {/* AI Fight Simulator */}
      <section className="py-20 bg-zinc-900">
            <div className="text-center mb-12 px-4">
                <h2 className="text-4xl font-bold">Simulate Your Dream Fight</h2>
            </div>
            <FightSimulator />
            </section>


        {/* Popular Matchups */}
       <section className="py-20 bg-zinc-900">
            <div className="text-center mb-12 px-4">
            <h2 className="text-4xl font-bold text-center mb-12">Popular Dream Matchups</h2>
            <PopularMatchupsSection />
          </div>
        </section>

        {/* Popular Searches */}
      <div className="text-center mb-12 px-4">
          <PopularSearches />
        </div>
      </main>
    </>
  );
}

// === Feature Card ===
function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Card className="p-6 bg-zinc-800 border-zinc-700 hover:border-red-500 transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </Card>
  );
}
