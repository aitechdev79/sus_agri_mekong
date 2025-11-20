'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function CongtyVinhhien() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    '/Vinhhien  (1).jpg',
    '/Vinhhien  (2).jpg'
  ];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center font-montserrat">
            Công ty Vinh Hiển
          </h1>

          <div className="relative w-full max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Image Display */}
            <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
              <Image
                src={images[currentIndex]}
                alt={`Công ty Vinh Hiển - Brochure ${currentIndex + 1}`}
                fill
                className="object-contain"
                priority
              />

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-3 rounded-full transition-all duration-300 z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>

            {/* Image Counter */}
            <div className="bg-gray-100 py-4 text-center">
              <span className="text-gray-600 font-medium font-montserrat">
                {currentIndex + 1} / {images.length}
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
