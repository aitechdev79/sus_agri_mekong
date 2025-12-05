import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SignUpSection from '@/components/SignUpSection';
import DienHinhSection from '@/components/DienHinhSection';
import LibraryAndToolsWrapper from '@/components/LibraryAndToolsWrapper';
import ProjectsAndNewsWrapper from '@/components/ProjectsAndNewsWrapper';

export default function Home() {
  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <AboutSection />
        <DienHinhSection />
        <LibraryAndToolsWrapper />
        <ProjectsAndNewsWrapper />
        <SignUpSection />
      </main>
      <Footer />
    </div>
  );
}