import { AboutSection } from "./portfolio/AboutSection";
import { ContactSection } from "./portfolio/ContactSection";
import { FeaturedProjectsSection } from "./portfolio/FeaturedProjectsSection";
import { Footer } from "./portfolio/Footer";
import { Header } from "./portfolio/Header";
import { HeroSection } from "./portfolio/HeroSection";
import { JourneySection } from "./portfolio/JourneySection";
import { CapabilitiesSection } from "./portfolio/CapabilitiesSection";
import { SectionMeter } from "./portfolio/SectionMeter.client";
import { pageClass } from "./portfolio/styles";
export function PortfolioApp() {
  return (
    <>
      <Header />
      <SectionMeter />
      <main id="main-content" className={pageClass}>
        <HeroSection />
        <div className="grid grid-cols-3 gap-4 border-t border-[var(--line)] py-6 text-[10px] md:py-7">
          <div>
            <span className="font-mono text-[9px] text-[var(--muted)]">
              FOCUS
            </span>
            <p className="mt-1 font-medium">RAG・画像認識・自動化</p>
          </div>
          <div>
            <span className="font-mono text-[9px] text-[var(--muted)]">
              APPROACH
            </span>
            <p className="mt-1 font-medium">課題から、使える仕組みへ</p>
          </div>
          <div>
            <span className="font-mono text-[9px] text-[var(--muted)]">
              BASED IN
            </span>
            <p className="mt-1 font-medium">日本</p>
          </div>
        </div>
        <FeaturedProjectsSection />
        <AboutSection />
        <JourneySection />
        <CapabilitiesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
