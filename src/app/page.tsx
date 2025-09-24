import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import HeroSectionFixed from '@/components/HeroSectionFixed';
import HeroSectionAPI from '@/components/HeroSectionAPI';
import HeroSectionSimple from '@/components/HeroSectionSimple';
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
        <HeroSectionSimple />
        <div className="bg-yellow-100 p-4 text-center">
          <h2 className="text-lg font-bold mb-2">Image Loading Tests:</h2>
          <div className="space-x-4">
            <a href="/hero-main.jpg" target="_blank" className="text-blue-600 hover:underline">Test Root Image</a>
            <a href="/hero/hero-main.jpg" target="_blank" className="text-blue-600 hover:underline">Test Subfolder Image</a>
            <a href="/api/static/hero/hero-main.jpg" target="_blank" className="text-blue-600 hover:underline">Test API Route</a>
          </div>
        </div>
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