import { AboutSection } from "./portfolio/AboutSection";
import { ContactSection } from "./portfolio/ContactSection";
import { FeaturedProjectsSection } from "./portfolio/FeaturedProjectsSection";
import { Footer } from "./portfolio/Footer";
import { Header } from "./portfolio/Header";
import { HeroSection } from "./portfolio/HeroSection";
import { SkillMatrix } from "./portfolio/SkillMatrix.client";

export function PortfolioApp() {
  return (
    <>
      <Header />
      <main id="top">
        <HeroSection />
        <SkillMatrix />
        <FeaturedProjectsSection />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
