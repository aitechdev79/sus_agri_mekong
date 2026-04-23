'use client';

import Image from 'next/image';
import ContentLibrarySection from './ContentLibrarySection';
import ToolsGrid from './ToolsGrid';

export default function LibraryAndToolsWrapper() {
  return (
    <div className="relative w-full overflow-hidden bg-white">
      {/* Shared Background SVG */}
      <div className="pointer-events-none absolute inset-0 w-full opacity-40">
        <Image
          src="/vecteezy_topo_34242655.svg"
          alt="Topographic background"
          fill
          className="object-cover w-full h-full"
          priority={false}
          sizes="100vw"
        />
      </div>

      {/* Light yellow transparent overlay */}
      <div className="pointer-events-none absolute inset-0 w-full" style={{ backgroundColor: 'rgba(255, 248, 225, 0.3)' }}></div>

      {/* Content - Both sections stacked */}
      <div className="relative z-10">
        <ContentLibrarySection />
        <ToolsGrid />
      </div>
    </div>
  );
}
