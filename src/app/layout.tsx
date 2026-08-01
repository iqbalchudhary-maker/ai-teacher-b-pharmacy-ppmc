import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pak Paramedical College Chiniot - AI Tutor",
  description: "Official B-Pharmacy Category-B AI Teaching System developed by SM Tech",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ur" dir="rtl">
      <body className="bg-gray-50 font-sans antialiased">{children}</body>
    </html>
  );
}