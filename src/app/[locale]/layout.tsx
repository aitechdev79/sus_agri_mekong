import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { AuthProvider } from "@/providers/auth-provider";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isEn = locale === 'en';

  const title = isEn
    ? "Digital Knowledge Platform - Good Practices Platform"
    : "Nền Tảng Tư Liệu Hóa - Good Practices Platform";
  const description = isEn
    ? "Share and learn practical knowledge across shrimp and rice value chains. Connect farmers, businesses, and experts for sustainable agriculture in Vietnam."
    : "Chia sẻ và học hỏi các thực hành tốt trong chuỗi giá trị tôm và lúa. Kết nối nông dân, doanh nghiệp và chuyên gia để xây dựng nền nông nghiệp bền vững tại Việt Nam.";
  const keywords = isEn
    ? "shrimp, rice, good practices, sustainable agriculture, Vietnam, Oxfam, VCCI, An Giang, Ca Mau"
    : "tôm, lúa, thực hành tốt, nông nghiệp bền vững, Việt Nam, Oxfam, VCCI, An Giang, Cà Mau";

  return {
    metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
    title,
    description,
    keywords,
    authors: [{ name: "Good Practices Platform Team" }],
    creator: "Good Practices Platform",
    publisher: "Oxfam & VCCI",
    openGraph: {
      title,
      description,
      url: "https://goodpractices.vn",
      siteName: "Good Practices Platform",
      images: [
        {
          url: "/uploads/hero.jpg",
          width: 1200,
          height: 630,
          alt: "Good Practices Platform - Sustainable Shrimp and Rice Farming",
        },
      ],
      locale: isEn ? "en_US" : "vi_VN",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ["/uploads/hero.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
