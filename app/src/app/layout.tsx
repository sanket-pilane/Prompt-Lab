import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Anton, Playfair_Display } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Navbar } from "@/components/navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PromptOasis | PROMPT.LAB",
  description: "High-performance prompt extraction for neural media generation engines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${anton.variable} ${playfair.variable} h-full antialiased dark`}
    >
      <body className="font-sans antialiased bg-brand-bg text-white h-full flex flex-col selection:bg-brand-yellow/30">
        <Navbar />
        {children}
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
