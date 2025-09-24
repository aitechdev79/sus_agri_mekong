'use client';

import Image from 'next/image';
import { useState } from 'react';

export default function HeroSectionDebug() {
  const [imageError, setImageError] = useState<string>('');
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);

  return (
    <div className="p-8 bg-gray-100">
      <h2 className="text-2xl font-bold mb-4">Hero Image Debug</h2>

      <div className="mb-4">
        <p><strong>Image Status:</strong> {imageLoaded ? '✅ Loaded' : '❌ Not loaded'}</p>
        {imageError && <p className="text-red-600"><strong>Error:</strong> {imageError}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Standard img tag test */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Standard IMG tag</h3>
          <img
            src="/hero/hero-main.jpg"
            alt="Hero Standard"
            className="w-full h-32 object-cover border"
            onLoad={() => console.log('Standard img loaded')}
            onError={(e) => console.error('Standard img failed:', e)}
          />
        </div>

        {/* Next.js Image component test */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Next.js Image Component</h3>
          <div className="relative w-full h-32">
            <Image
              src="/hero/hero-main.jpg"
              alt="Hero Next"
              fill
              className="object-cover border"
              onLoad={() => {
                setImageLoaded(true);
                console.log('Next.js Image loaded');
              }}
              onError={(e) => {
                setImageError('Next.js Image failed to load');
                console.error('Next.js Image failed:', e);
              }}
            />
          </div>
        </div>

        {/* Mobile image test */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Mobile Image</h3>
          <img
            src="/hero/hero-mobile.jpg"
            alt="Hero Mobile"
            className="w-full h-32 object-cover border"
            onLoad={() => console.log('Mobile img loaded')}
            onError={(e) => console.error('Mobile img failed:', e)}
          />
        </div>

        {/* Direct path test */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Path Tests</h3>
          <ul className="text-sm">
            <li><a href="/hero/hero-main.jpg" target="_blank" className="text-blue-600 hover:underline">Direct link to hero-main.jpg</a></li>
            <li><a href="/hero/hero-mobile.jpg" target="_blank" className="text-blue-600 hover:underline">Direct link to hero-mobile.jpg</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}