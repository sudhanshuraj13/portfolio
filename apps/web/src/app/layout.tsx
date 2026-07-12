import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/ThemeProvider";
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
  title: "Sudhanshu Raj | AI & Backend Engineer",
  description:
    "AI and Backend Engineer specializing in RAG pipelines, LangGraph multi-agent orchestration, and production backend systems in TypeScript, Node.js, and Python.",
  keywords: [
    "AI Engineer",
    "Backend Engineer",
    "RAG",
    "LangGraph",
    "Multi-Agent Orchestration",
    "TypeScript",
    "Node.js",
    "Python",
    "Portfolio",
  ],
  icons: {
    icon: "/web_icon.png",
    apple: "/web_icon.png",
  },
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetBrainsMono.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="w-full font-sans bg-base text-primary">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
