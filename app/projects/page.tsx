import type { Metadata } from "next";
import { Footer } from "@/components/portfolio/Footer";
import { Header } from "@/components/portfolio/Header";
import { ProjectArchive } from "@/components/portfolio/ProjectArchive.client";

export const metadata: Metadata = {
  title: "Project Archive | YUU's room",
  description: "YUU's room の実績アーカイブ。属性や技術タグから経験を確認できます。"
};

export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main id="top">
        <ProjectArchive />
      </main>
      <Footer />
    </>
  );
}
