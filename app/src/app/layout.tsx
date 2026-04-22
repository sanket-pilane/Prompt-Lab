import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import { Sidebar } from "@/components/sidebar";
import { Navbar } from "@/components/navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
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
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased dark`}
    >
      <body className="font-sans antialiased bg-brand-bg text-[#e5e2e1] h-full flex flex-row overflow-hidden selection:bg-primary/30">
        <Sidebar />
        <div className="flex-1 flex flex-col h-full overflow-hidden relative">
          <Navbar />
          <div className="flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
        <Toaster position="bottom-right" theme="dark" />
      </body>
    </html>
  );
}
