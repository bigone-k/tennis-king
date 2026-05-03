import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-noto-sans-kr",
});

export const metadata: Metadata = {
  title: "NoAD",
  description: "NoAD 테니스 클럽 공식 웹사이트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKR.variable} h-full`}>
      <body className="flex flex-col md:flex-row min-h-screen font-[family-name:var(--font-noto-sans-kr)]">
        <Sidebar />
        <main className="flex-1 bg-gray-50 p-5 md:p-10 pt-20 md:pt-10">{children}</main>
      </body>
    </html>
  );
}
