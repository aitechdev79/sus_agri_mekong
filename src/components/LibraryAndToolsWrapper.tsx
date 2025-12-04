'use client';

import Image from 'next/image';
import ContentLibrarySection from './ContentLibrarySection';
import ToolsGrid from './ToolsGrid';

export default function LibraryAndToolsWrapper() {
  return (
    <div className="relative overflow-hidden w-full bg-gray-50">
      {/* Shared Background SVG - Full Width */}
      <div className="absolute inset-0 w-full h-full opacity-40">
        <Image
          src="/vecteezy_topo_34242655.svg"
          alt="Topographic background"
          fill
          className="object-cover w-full h-full"
          priority={false}
          sizes="100vw"
        />
      </div>

      {/* Content - Both sections stacked */}
      <div className="relative z-10">
        <ContentLibrarySection />
        <ToolsGrid />
      </div>
    </div>
  );
}
