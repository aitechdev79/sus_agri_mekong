import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import { AuthProvider } from "@/providers/auth-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  title: "Nền Tảng Tư Liệu Hóa - Good Practices Platform",
  description: "Chia sẻ và học hỏi các thực hành tốt trong chuỗi giá trị tôm và lúa. Kết nối nông dân, doanh nghiệp và chuyên gia để xây dựng nền nông nghiệp bền vững tại Việt Nam.",
  keywords: "tôm, lúa, thực hành tốt, nông nghiệp bền vững, Việt Nam, Oxfam, VCCI, An Giang, Cà Mau",
  authors: [{ name: "Good Practices Platform Team" }],
  creator: "Good Practices Platform",
  publisher: "Oxfam & VCCI",
  openGraph: {
    title: "Nền Tảng Tư Liệu Hóa - Good Practices Platform",
    description: "Kết nối nông dân, doanh nghiệp và chuyên gia để xây dựng chuỗi giá trị bền vững cho tôm và lúa",
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
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nền Tảng Tư Liệu Hóa",
    description: "Chia sẻ và học hỏi các thực hành tốt trong chuỗi giá trị tôm và lúa",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} antialiased`}
      >
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
