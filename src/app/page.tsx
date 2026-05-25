import Footer from '@/components/Footer';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
import SignUpSection from '@/components/SignUpSection';
import DienHinhSection from '@/components/DienHinhSection';
import TinTucSection from '@/components/TinTucSection';
import LibraryAndToolsWrapper from '@/components/LibraryAndToolsWrapper';
import ProjectsAndNewsWrapper from '@/components/ProjectsAndNewsWrapper';
import { getHomeFeaturedContent } from '@/lib/home-content';

export const revalidate = 60;

export default async function Home() {
  const featuredContent = await getHomeFeaturedContent().catch((error) => {
    console.error('Failed to preload homepage content:', error);
    return { stories: [], news: [] };
  });

  return (
    <div className="min-h-screen">
      <main>
        <HeroSection />
        <AboutSection />
        <DienHinhSection initialItems={featuredContent.stories} />
        <TinTucSection initialItems={featuredContent.news} />
        <ProjectsAndNewsWrapper />
        <LibraryAndToolsWrapper />
        <SignUpSection />
      </main>
      <Footer />
    </div>
  );
}
