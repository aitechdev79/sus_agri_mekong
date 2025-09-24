import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import HeroSectionFixed from '@/components/HeroSectionFixed';
import HeroSectionDebug from '@/components/HeroSectionDebug';
import AboutSection from '@/components/AboutSection';
import ToolsGrid from '@/components/ToolsGrid';
import SignUpSection from '@/components/SignUpSection';
import DienhinhSection from '@/components/DienhinhSection';
import HoatDongSection from '@/components/HoatDongSection';
import NewsSection from '@/components/NewsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSectionFixed />
        <HeroSectionDebug />
        <AboutSection />
        <DienhinhSection />
        <ToolsGrid />
        <HoatDongSection />
        <NewsSection />
        <SignUpSection />
      </main>
      <Footer />
    </div>
  );
}