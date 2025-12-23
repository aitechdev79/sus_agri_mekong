'use client';

import Link from 'next/link';
import NavigationBar from './NavigationBar';

export default function HeroSection() {

  return (
    <section
      className="relative overflow-hidden w-screen min-h-[75vh]"
      style={{
        marginLeft: 'calc(50% - 50vw)',
        marginRight: 'calc(50% - 50vw)',
      }}
    >
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Background Image */}
      <div
        className="absolute inset-0"
        style={{
          width: '100vw',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }}
      >
        <div
          className="w-full h-full bg-cover"
          style={{
            backgroundImage: 'url(/hero-main.jpg)',
            backgroundSize: '120%',
            backgroundPosition: 'center center'
          }}
        />
        {/* Dark Overlay */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)'
          }}
        />
      </div>

      {/* Main Hero Content */}
      <div className="relative flex h-full min-h-[75vh] items-center pt-16" style={{ zIndex: 10 }}>
        <div className="max-w-6xl px-6 w-full mx-auto">
          <div className="max-w-2xl">
            {/* Main Headline - Left aligned */}
            <div className="mb-6">
              <h1 className="font-montserrat font-bold text-yellow-300 text-left" style={{ lineHeight: '1.1', letterSpacing: '0.5px' }}>
                {/* 24px mobile, 32px tablet, 48px desktop */}
                <div className="text-2xl md:text-3xl lg:text-5xl">
                  Thông tin bền vững - Nền móng cho tương lai phát triển bền vững của Việt Nam.
                </div>
              </h1>
            </div>

            {/* Subheadline */}
            <div className="mb-8">
              <p className="font-montserrat font-bold text-lg md:text-xl text-yellow-300 leading-relaxed">
                Cung cấp thông tin minh bạch, chính xác và đáng tin cậy cho sự phát triển bền vững
              </p>
            </div>

            {/* CTA Button */}
            <div>
              <Link
                href="/vision-mission"
                className="inline-block font-montserrat font-semibold text-base md:text-lg text-vn-dark bg-vn-gold px-8 py-4 rounded-lg transition-all duration-300 hover:shadow-lg"
                style={{
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFD84D'; // Lighten gold
                  e.currentTarget.style.boxShadow = '0 6px 12px rgba(255, 184, 28, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFB81C';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }}
              >
                Khám phá →
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
