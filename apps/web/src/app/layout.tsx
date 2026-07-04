import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sudhanshu Raj | AI & Backend Engineer — System Registry",
  description:
    "AI-Orchestrated System Registry & Log Console. Specializing in multi-agent orchestration, LLM inference routing, and high-availability backend systems.",
  keywords: [
    "AI Engineer",
    "Backend Engineer",
    "LLM",
    "Multi-Agent",
    "Fastify",
    "TypeScript",
    "Portfolio",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetBrainsMono.variable} h-full antialiased`}
    >
      <body className="h-full w-full overflow-hidden flex flex-col font-sans bg-base text-primary">
        {children}
      </body>
    </html>
  );
}
