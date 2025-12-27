import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VocoLabAI - AI-Powered Speech Training",
  description: "Transform your pronunciation with personalized, AI-powered speech therapy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
