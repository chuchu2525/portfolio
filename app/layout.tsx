import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"),
  title: "YUU's room | Engineer Portfolio",
  description:
    "古着とレコードの質感で、Webアプリ開発の経験とエンジニアリングスキルを整理するポートフォリオ。",
  openGraph: {
    title: "YUU's room | Engineer Portfolio",
    description:
      "古着とレコードをモチーフにした、フルスタック寄りエンジニアのポートフォリオ。",
    type: "website",
    images: ["/images/hero-vintage-records.png"]
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
