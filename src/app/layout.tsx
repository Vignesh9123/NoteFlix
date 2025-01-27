import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/context/AuthContext";
import NextTopLoader from 'nextjs-toploader';
import {Toaster} from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/react"
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NoteFlix",
  description: "NoteFlix is a note-taking app with AI summarization for youtube videos.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/logo.webp" sizes="any" />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
         <AuthProvider>
         <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            disableTransitionOnChange
          >
          <NextTopLoader showSpinner={false} zIndex={1000000000}/>
          <Toaster containerClassName="z-max"/>

            {children}
            <Analytics/>
          </ThemeProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
