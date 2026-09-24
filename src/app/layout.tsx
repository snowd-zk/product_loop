import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Product Loop - Liner Pencil 기반 무한 가설·검증 루프",
  description: "가설 샤프닝부터 기획·시안·플로우 한 판 생성, 레슨런 무한 루프 시스템",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className="h-full antialiased font-sans">
      <body className="min-h-full flex flex-col bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
