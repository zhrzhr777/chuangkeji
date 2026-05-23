import { HeroSection } from "@/components/home/HeroSection";
import { StatsBar } from "@/components/home/StatsBar";
import { Leaderboard } from "@/components/home/Leaderboard";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { AdBanner } from "@/components/ads/AdBanner";
import { LatestResources } from "@/components/home/LatestResources";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsBar />
      <Leaderboard />
      <CategoryGrid />
      <AdBanner position="between" />
      <LatestResources />
    </>
  );
}
