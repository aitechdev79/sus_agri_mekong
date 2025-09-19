import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import ToolsGrid from '@/components/ToolsGrid';
import SignUpSection from '@/components/SignUpSection';
import DienhinhSection from '@/components/DienhinhSection';
import NewsSection from '@/components/NewsSection';

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <AboutSection />
        <DienhinhSection />
        <NewsSection />
        <ToolsGrid />
        <SignUpSection />
      </main>
      <Footer />
    </div>
  );
}