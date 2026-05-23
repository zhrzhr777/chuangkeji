import { HeroSection } from "@/components/home/HeroSection";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { Leaderboard } from "@/components/home/Leaderboard";
import { AdBanner } from "@/components/ads/AdBanner";
import { LatestResources } from "@/components/home/LatestResources";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Leaderboard />
      <CategoryGrid />
      <AdBanner position="between" />
      <LatestResources />
    </>
  );
}
