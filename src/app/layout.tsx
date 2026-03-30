import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Matthieu Feracho | Développeur Web & Content Creator",
  description:
    "Portfolio de Matthieu Feracho — Développeur Web Junior, Streamer Twitch & Musicien. Bachelor EFREI Paris.",
  keywords: [
    "Matthieu Feracho",
    "développeur web",
    "portfolio",
    "Next.js",
    "Twitch",
    "EFREI",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-dark-900 text-gray-200 font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
