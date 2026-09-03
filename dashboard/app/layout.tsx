import type { Metadata } from "next";
import { DM_Sans, Geist_Mono, Lora } from "next/font/google";

import { THEME_SCRIPT } from "@/lib/theme";

import "./globals.css";

const lora = Lora({ variable: "--font-lora", subsets: ["latin"], display: "swap" });
const dmSans = DM_Sans({ variable: "--font-dm-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  title: "OpenOutreach · Dashboard",
  description: "Configure this OpenOutreach install.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${lora.variable} ${dmSans.variable} ${geistMono.variable} h-full antialiased`}
      // THEME_SCRIPT sets data-theme before React hydrates — an intentional
      // server/client mismatch. See lib/theme.ts.
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full bg-paper font-sans text-body">{children}</body>
    </html>
  );
}
