import type { Metadata } from "next";
import {
  Fraunces,
  Plus_Jakarta_Sans,
  Noto_Serif_Bengali,
  Hind_Siliguri,
} from "next/font/google";
import "./globals.css";
import { AdmissionModalProvider } from "@/components/modals/AdmissionModalContext";
import SkipToContent from "@/components/common/SkipToContent";
import { getRequestLocale } from "@/lib/i18n/request";
import { getLocaleDefinition } from "@/lib/i18n/locales";
import { getUiDictionary } from "@/lib/i18n/dictionaries";
import MotionProvider from "@/components/common/MotionProvider";

export const instant = false;

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const notoSerifBengali = Noto_Serif_Bengali({
  variable: "--font-noto-serif-bengali",
  subsets: ["bengali"],
  display: "swap",
});

const hindSiliguri = Hind_Siliguri({
  variable: "--font-hind-siliguri",
  subsets: ["bengali"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Sainthia Shishutirtha | Pre-Primary & Primary School (Lower Nursery – Class 5)",
  description:
    "Official website for Sainthia Shishutirtha, Birbhum, West Bengal. Serving children from Lower Nursery to Class 5.",
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
    "Class 1 to 5 school Sainthia",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const locale = await getRequestLocale();
  const localeDefinition = getLocaleDefinition(locale);
  const dictionary = getUiDictionary(locale);
  return (
    <html
      lang={localeDefinition.htmlLang}
      dir="ltr"
      className={`${plusJakartaSans.variable} ${fraunces.variable} ${notoSerifBengali.variable} ${hindSiliguri.variable} h-full antialiased`}
    >
      <body
        data-locale={locale}
        className={`min-h-full flex flex-col bg-[#FDFBF7] text-[#243B43] selection:bg-[#D95D39]/20 selection:text-[#1A535C] ${locale === 'bn' ? 'font-bengali leading-bengali' : 'font-sans'}`}
      >
        <MotionProvider />
        <SkipToContent label={dictionary.common.skipToContent} />
        <AdmissionModalProvider>
          {children}
        </AdmissionModalProvider>
      </body>
    </html>
  );
}
