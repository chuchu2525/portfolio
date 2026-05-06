import { AboutSection } from "./portfolio/AboutSection";
import { ContactSection } from "./portfolio/ContactSection";
import { Footer } from "./portfolio/Footer";
import { Header } from "./portfolio/Header";
import { HeroSection } from "./portfolio/HeroSection";
import { ProjectArchive } from "./portfolio/ProjectArchive.client";
import { RecentPatchesSection } from "./portfolio/RecentPatchesSection";
import { SkillMatrix } from "./portfolio/SkillMatrix.client";

export function PortfolioApp() {
  return (
    <>
      <Header />
      <main id="top">
        <HeroSection />
        <RecentPatchesSection />
        <SkillMatrix />
        <ProjectArchive />
        <AboutSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
