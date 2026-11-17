import type { Metadata } from "next";
import { Footer } from "@/components/portfolio/Footer";
import { Header } from "@/components/portfolio/Header";
import { ProjectArchive } from "@/components/portfolio/ProjectArchive.client";
import { pageClass } from "@/components/portfolio/styles";
export const metadata: Metadata = {
  title: "実績一覧 | Chuchu",
  description:
    "RAG・画像認識・Webアプリ・業務自動化の取り組みを、技術や経験した領域から探せます。",
};
export default function ProjectsPage() {
  return (
    <>
      <Header />
      <main id="main-content" className={pageClass}>
        <ProjectArchive />
      </main>
      <Footer />
    </>
  );
}
