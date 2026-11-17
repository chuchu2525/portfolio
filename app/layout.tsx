import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Chuchu / AIエンジニア",
  description:
    "曖昧な課題を、使えるAIへ。RAG・画像認識・自動化を軸に、使う人に届く仕組みをつくっています。",
  openGraph: {
    title: "Chuchu / AIエンジニア",
    description: "課題から、かたちへ。AIとソフトウェアの取り組み。",
    type: "website",
    locale: "ja_JP",
  },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
