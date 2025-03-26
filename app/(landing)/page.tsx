import { BenefitsSection } from "@/components/landing/sections/Benefits";
import { FAQSection } from "@/components/landing/sections/FAQ";
import { FeaturesSection } from "@/components/landing/sections/Features";
import { FooterSection } from "@/components/landing/sections/Footer";
import { HeroSection } from "@/components/landing/sections/Hero";
import { ServicesSection } from "@/components/landing/sections/Services";
import { TeamSection } from "@/components/landing/sections/Team";

export const metadata = {
  title: "Graxion: Next Gen Grading and Assessment Platform",
  description: "Free Shadcn landing page for developers",
  openGraph: {
    type: "website",
    url: "https://github.com/nobruf/shadcn-landing-page.git",
    title: "Graxion: Next Gen Grading and Assessment Platform",
    description: "Free Shadcn landing page for developers",
    images: [
      {
        url: "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
        width: 1200,
        height: 630,
        alt: "Graxion: Next Gen Grading and Assessment Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "https://github.com/nobruf/shadcn-landing-page.git",
    title: "Graxion: Next Gen Grading and Assessment Platform",
    description: "Free Shadcn landing page for developers",
    images: [
      "https://res.cloudinary.com/dbzv9xfjp/image/upload/v1723499276/og-images/shadcn-vue.jpg",
    ],
  },
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-32">
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <ServicesSection />
      <TeamSection />
      <FAQSection />
      <FooterSection />
    </div>
  );
}
