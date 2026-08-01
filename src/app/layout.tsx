import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pak Paramedical College Chiniot - AI Tutor",
  description: "Official B-Pharmacy Category-B AI Teaching System developed by SM Tech",
};

// موبائل اسکرینز پر زومنگ اور اسکیلنگ کو پرفیکٹ رکھنے کے لیے ویوپورٹ سیٹنگ
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-slate-900 font-sans antialiased text-slate-100 overflow-hidden">
        {children}
      </body>
    </html>
  );
}