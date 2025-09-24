'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import NavigationBar from './NavigationBar';

export default function HeroSection() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIsMobile();
    window.addEventListener('resize', checkIsMobile);
    return () => window.removeEventListener('resize', checkIsMobile);
  }, []);

  return (
    <section
      className="relative overflow-hidden w-screen"
      style={{
        height: '75vh',
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)'
      }}
    >
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          width: '100vw',
          height: '75vh',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        <Image
          src={isMobile ? '/hero-mobile.jpg' : '/hero-main.jpg'}
          alt="Nông nghiệp bền vững đồng bằng sông Cửu Long"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{
            objectFit: 'cover',
            objectPosition: 'center center'
          }}
        />
      </div>

      {/* Main Hero Content */}
      <div className="relative flex h-full items-center pt-16" style={{ zIndex: 10 }}>
        <div className="max-w-6xl px-6 w-full mx-auto">
          <div className="max-w-2xl">
            {/* Main Headline - Left aligned */}
            <div className="mb-6">
              <h1 className="font-montserrat font-bold text-white text-left" style={{ lineHeight: '1.1', letterSpacing: '0.5px' }}>
                {/* 24px mobile, 32px tablet, 48px desktop */}
                <div className="text-2xl md:text-3xl lg:text-5xl">
                  Nông nghiệp bền vững
                </div>
                <div className="text-2xl md:text-3xl lg:text-5xl">
                  cho đồng bằng
                </div>
                <div className="text-2xl md:text-3xl lg:text-5xl">
                  sông Cửu Long
                </div>
              </h1>
            </div>

            {/* Subheadline - Left aligned */}
            <div className="mb-6">
              <p className="font-montserrat font-normal text-white text-left max-w-lg text-xs md:text-sm lg:text-xl" style={{ lineHeight: '1.5' }}>
                Phát triển bền vững để đảm bảo chuỗi cung ứng an toàn.
              </p>
            </div>

            {/* CTA Button - Below subheadline */}
            <div>
              <Link
                href="/about-us"
                className="inline-block font-montserrat font-bold text-sm text-white bg-green-600 hover:bg-green-700 transition-all duration-300 px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                aria-label="Khám phá về chúng tôi"
              >
                Khám phá
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="animate-bounce">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}