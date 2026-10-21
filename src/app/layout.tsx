import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sainthia Shishutirtha | Excellence in Foundational & Primary Education (KG – Class IV)",
  description:
    "Official visual prototype for Sainthia Shishutirtha, Birbhum, West Bengal (Govt. Regd: S/2L/14754 OF 2013-14, U-DISE: 19082200103). Nurturing foundational excellence, joyful inquiry, and moral character since 2013.",
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  keywords: [
    "Sainthia Shishutirtha",
    "Sainthia primary school",
    "Shishu Tirtha Birbhum",
    "Kindergarten Sainthia",
    "Primary education Birbhum",
    "Class 1 to 4 school Sainthia",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-[#243B43]">
        {children}
      </body>
    </html>
  );
}
