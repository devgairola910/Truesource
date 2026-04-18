import type { Metadata } from "next";
import { LastVisitedTracker } from "@/components/auth/last-visited-tracker";
import { Inter, IBM_Plex_Mono } from "next/font/google";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TrueSource | Protect Media Integrity",
  description:
    "A multi-page website for content integrity services, workflows, and insights.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <LastVisitedTracker />
        <SiteHeader />
        <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-5 md:px-8 md:py-8">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
