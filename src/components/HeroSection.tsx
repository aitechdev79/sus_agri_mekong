'use client';

import Link from 'next/link';
import MuxPlayer from '@mux/mux-player-react/lazy';
import NavigationBar from './NavigationBar';

const heroPlaybackId = process.env.NEXT_PUBLIC_MUX_HERO_PLAYBACK_ID;

export default function HeroSection() {
  return (
    <section
      className="relative left-1/2 min-h-[75vh] w-screen -translate-x-1/2 overflow-hidden md:min-h-0 md:aspect-[5/2]"
    >
      <NavigationBar />

      <div
        className="absolute inset-0"
        style={{
          width: '100vw',
          height: '100%',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      >
        {heroPlaybackId ? (
          <MuxPlayer
            playbackId={heroPlaybackId}
            streamType="on-demand"
            autoPlay="muted"
            muted
            loop
            playsInline
            preload="auto"
            nohotkeys
            aria-hidden="true"
            className="pointer-events-none block h-full w-full"
            poster="/hero-main.jpg"
            style={{
              '--controls': 'none',
              '--media-object-fit': 'cover',
              '--media-object-position': 'center',
              '--media-poster-image-background-size': 'cover',
              width: '100%',
              height: '100%',
              display: 'block',
            }}
          />
        ) : (
          <div
            className="h-full w-full bg-cover"
            style={{
              backgroundImage: 'url(/hero-main.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
            }}
          />
        )}

        <div
          className="absolute inset-0"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          }}
        />
      </div>

      <div className="relative flex min-h-[75vh] h-full items-center pt-16 md:min-h-0" style={{ zIndex: 10 }}>
        <div className="mx-auto w-full max-w-6xl px-6">
          <div className="max-w-2xl">
            <div className="mb-6">
              <h1 className="font-montserrat font-bold text-left text-white" style={{ lineHeight: '1.1', letterSpacing: '0.5px' }}>
                <div className="text-2xl md:text-3xl lg:text-5xl">
                  Thông tin bền vững - Nền móng cho tương lai phát triển bền vững của Việt Nam.
                </div>
              </h1>
            </div>

            <div className="mb-8">
              <p className="font-montserrat text-lg font-bold leading-relaxed text-white md:text-xl">
                Cung cấp thông tin minh bạch, chính xác và đáng tin cậy cho sự phát triển bền vững
              </p>
            </div>

            <div>
              <Link
                href="/vision-mission"
                className="inline-block rounded-lg bg-vn-gold px-8 py-4 font-montserrat text-base font-semibold text-vn-dark transition-all duration-300 hover:shadow-lg md:text-lg"
                style={{
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#FFD84D';
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

      <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 transform">
        <div className="animate-bounce">
          <div className="flex h-10 w-6 justify-center rounded-full border-2 border-white">
            <div className="mt-2 h-3 w-1 animate-pulse rounded-full bg-white" />
          </div>
        </div>
      </div>
    </section>
  );
}
