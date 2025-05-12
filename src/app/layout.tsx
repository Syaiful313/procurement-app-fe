import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import StoreProvider from "@/providers/StoreProvider";
import AuthProvider from "@/providers/AuthProvider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/sonner";
import NextAuthProvider from "@/providers/NextAuthProvider";
import TokenProvider from "@/providers/TokenProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sabar App - Aplikasi Pengadaan Barang",
  description: "Aplikasi Pengadaan Barang",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReactQueryProvider>
          <StoreProvider>
            <NextAuthProvider>
              <TokenProvider>{children}</TokenProvider>
            </NextAuthProvider>
          </StoreProvider>
        </ReactQueryProvider>
        <Toaster duration={1500} position="top-right" />
      </body>
    </html>
  );
}
