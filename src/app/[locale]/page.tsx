import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import FeaturedContent from '@/components/FeaturedContent';
import ToolsGrid from '@/components/ToolsGrid';
import CommunityCarousel from '@/components/CommunityCarousel';
import SignUpSection from '@/components/SignUpSection';
import NewsSection from '@/components/NewsSection';

export default async function Home({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <HeroSection />
        <AboutSection />
        <FeaturedContent />
        <ToolsGrid />
        <CommunityCarousel />
        <SignUpSection />
        <NewsSection locale={locale} />
      </main>
      <Footer />
    </div>
  );
}