'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

export default function AboutUsPage() {
  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <div className="relative z-50">
        <NavigationBar />
      </div>

      {/* Main Content */}
      <main className="pt-20 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="font-montserrat font-bold text-4xl md:text-6xl text-gray-800">
            Cần thêm thông tin
          </h1>
        </div>
      </main>

      <Footer />
    </div>
  );
}