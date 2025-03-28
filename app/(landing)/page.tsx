import { BenefitsSection } from "@/components/landing/sections/Benefits";
import { FAQSection } from "@/components/landing/sections/FAQ";
import { FeaturesSection } from "@/components/landing/sections/Features";
import { FooterSection } from "@/components/landing/sections/Footer";
import { HeroSection } from "@/components/landing/sections/Hero";
import { StepSection } from "@/components/landing/sections/Steps";
import { TeamSection } from "@/components/landing/sections/Team";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-32">
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <StepSection />
      <TeamSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
}
