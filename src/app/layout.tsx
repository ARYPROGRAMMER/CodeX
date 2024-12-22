"use client";
import type { Metadata } from "next";
import { Comfortaa } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import ConvexClientProvider from "@/components/providers/ConvexClientProvider";
import { BuyMeCoffeeButton } from "@/components/ui/BuyMeCoffee";
import Footer from "@/components/ui/Footer";
import { Toaster } from "react-hot-toast";

// Comfortaa font configuration
const comfortaa = Comfortaa({
  subsets: ["latin"],
  variable: "--font-comfortaa",
  display: "swap",
});

// Geist Mono for code blocks
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const metadata: Metadata = {
  title: "CodeCraft - Online Code Editor",
  description: "A modern, collaborative code editor platform",
  keywords: ["code editor", "programming", "development", "coding platform"],
  authors: [{ name: "Your Name" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0F172A",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${comfortaa.variable} ${geistMono.variable} h-full`}
      >
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        </head>
        <body className="font-comfortaa antialiased h-full flex flex-col bg-gradient-custom">
          <style jsx global>{`
            :root {
              --gradient-start: #0F172A;
              --gradient-mid: #1E293B;
              --gradient-end: #0F172A;
            }

            .bg-gradient-custom {
              background: linear-gradient(
                135deg,
                var(--gradient-start) 0%,
                var(--gradient-mid) 50%,
                var(--gradient-end) 100%
              );
            }

            /* Custom scrollbar */
            ::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }

            ::-webkit-scrollbar-track {
              background: #1E293B;
            }

            ::-webkit-scrollbar-thumb {
              background: #3B82F6;
              border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
              background: #60A5FA;
            }

            /* Text selection */
            ::selection {
              background: #3B82F6;
              color: white;
            }
          `}</style>
          <ConvexClientProvider>
            <main className="flex-grow flex flex-col w-full">
              {children}
            </main>
          </ConvexClientProvider>
    
            <BuyMeCoffeeButton />
            <Footer />
     
          <Toaster
            position="top-right"
            toastOptions={{
              className: "font-comfortaa",
              style: {
                background: "#1E293B",
                color: "#fff",
                border: "1px solid #3B82F6",
              },
              duration: 3000,
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
