'use client';

import { useState } from 'react';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

export default function CongtyTaiky() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoom, setZoom] = useState(1);

  const images = [
    '/Taiky  (1).jpg',
    '/Taiky  (2).jpg'
  ];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setZoom(1); // Reset zoom when changing images
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setZoom(1); // Reset zoom when changing images
  };

  const zoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.25, 3)); // Max zoom 3x
  };

  const zoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.25, 1)); // Min zoom 1x
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          <h1 className="text-4xl font-bold text-gray-800 mb-8 text-center font-montserrat">
            Công ty Tài Ký
          </h1>

          <div className="relative w-full max-w-5xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            {/* Image Display */}
            <div className="relative w-full overflow-auto" style={{ aspectRatio: '16/9' }}>
              <div
                className="relative w-full h-full transition-transform duration-300"
                style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}
              >
                <Image
                  src={images[currentIndex]}
                  alt={`Công ty Tài Ký - Brochure ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  priority
                />
              </div>

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

              {/* Zoom Controls */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button
                  onClick={zoomIn}
                  disabled={zoom >= 3}
                  className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Zoom in"
                >
                  <ZoomIn className="w-6 h-6" />
                </button>
                <button
                  onClick={zoomOut}
                  disabled={zoom <= 1}
                  className="bg-black/30 hover:bg-black/50 text-white p-2 rounded-full transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Zoom out"
                >
                  <ZoomOut className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Image Counter and Zoom Level */}
            <div className="bg-gray-100 py-4 text-center">
              <span className="text-gray-600 font-medium font-montserrat">
                {currentIndex + 1} / {images.length} | Zoom: {Math.round(zoom * 100)}%
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
