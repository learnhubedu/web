import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import PageTransition from "@/components/page-transition"

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  preload: true,
})

// ✅ Metadata (without viewport)
export const metadata: Metadata = {
  title: "LearnHub Edu - Educational Consulting",
  description: "Expert guidance for your college journey",
};

// ✅ New Next.js 14+ method for viewport
export const generateViewport = () => ({
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} min-h-screen bg-white`}>
        <PageTransition>
          <Navbar />
          {children}
          <Footer />
        </PageTransition>
      </body>
    </html>
  );
}
