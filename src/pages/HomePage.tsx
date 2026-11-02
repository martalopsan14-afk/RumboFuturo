import { HeroSection } from '@/components/home/HeroSection';
import { BenefitsSection } from '@/components/home/BenefitsSection';
import { NewsSection } from '@/components/home/NewsSection';

export function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <NewsSection />
    </>
  );
}
