import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Sainthia Shishutirtha | Foundational & Primary School (KG – Class IV)",
  description:
    "Official website for Sainthia Shishutirtha, Birbhum, West Bengal (Govt. Regd: S/2L/14754 OF 2013-14, U-DISE: 19082200103). Nurturing foundational excellence, joyful inquiry, and moral character since 2013.",
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
      className={`${plusJakartaSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-white text-[#243B43] selection:bg-[#A5D1DC]/40 selection:text-[#243B43]">
        {children}
      </body>
    </html>
  );
}
