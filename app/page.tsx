import EcosystemHero from '@/components/EcosystemHero';
import TheModel from '@/components/TheModel';
import Ventures from '@/components/Ventures';
import TrainingHub from '@/components/TrainingHub';
import MarketOpportunity from '@/components/MarketOpportunity';
import SocialProof from '@/components/SocialProof';
import FinalCTA from '@/components/FinalCTA';

export default function Home() {
  return (
    <main className="min-h-screen">
      <EcosystemHero />
      <TheModel />
      <Ventures />
      <TrainingHub />
      <MarketOpportunity />
      <SocialProof />
      <FinalCTA />
    </main>
  );
}
