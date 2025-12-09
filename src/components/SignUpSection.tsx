'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function SignUpSection() {
  const partnerLogos = [
    // Row 1
    { id: 'iff', name: 'IFF', logo: '/partners/iff.png' },
    { id: 'interbev', name: 'Interbev', logo: '/partners/interbev.png' },
    { id: 'interfood', name: 'Interfood', logo: '/partners/interfood.png' },
    { id: 'innovation-center', name: 'Innovation Center for U.S. Dairy', logo: '/partners/innovation-center.png' },
    // Row 2
    { id: 'importaco', name: 'Importaco', logo: '/partners/importaco.png' },
    { id: 'inalca', name: 'Inalca', logo: '/partners/inalca.png' },
    { id: 'intersnack', name: 'Intersnack', logo: '/partners/intersnack.png' },
    { id: 'ingredion', name: 'Ingredion', logo: '/partners/ingredion.png' },
  ];

  return (
    <section className="py-20 bg-vn-rice-white">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header Section */}
        <div className="mb-16 relative">
          <div className="flex items-start justify-between">
            {/* Left Side - Headlines */}
            <div style={{ maxWidth: '60%' }}>
              {/* Section Identifier */}
              <p className="text-xs uppercase font-montserrat font-semibold tracking-wider mb-4" style={{ color: 'rgba(60, 60, 59, 0.6)' }}>
                Trở thành đối tác
              </p>

              {/* Main Headline */}
              <h2 className="text-vn-dark font-montserrat font-bold leading-tight" style={{ fontSize: '48px', fontWeight: 700 }}>
                Đối tác doanh nghiệp được cập nhật các chương trình và nội dung mới nhất. Được kết nối với cộng đồng doanh nghiệp, chuyên gia và nông dân.
              </h2>
            </div>

            {/* Right Side - CTA Button */}
            <Link
              href="/join-us"
              className="flex-shrink-0 inline-flex items-center gap-2 font-montserrat font-bold uppercase transition-all duration-300 hover:scale-105"
              style={{
                border: '2px solid #0A7029',
                color: '#0A7029',
                padding: '16px 32px',
                borderRadius: '8px',
                backgroundColor: 'transparent'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#0A7029';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#0A7029';
              }}
              aria-label="Join Us"
            >
              JOIN US
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>

        {/* Partner Logos Grid */}
        <div className="space-y-8">
          {/* Row 1 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {partnerLogos.slice(0, 4).map((partner) => (
              <div
                key={partner.id}
                className="bg-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  padding: '24px',
                  maxHeight: '120px',
                  filter: 'grayscale(100%) opacity(0.7)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'grayscale(0%) opacity(1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'grayscale(100%) opacity(0.7)';
                }}
              >
                <div className="relative w-full h-20 flex items-center justify-center">
                  <span className="text-vn-dark font-montserrat font-bold text-lg text-center">
                    {partner.name}
                  </span>
                  {/* Placeholder for actual logo image */}
                  {/* <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  /> */}
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200" style={{ borderColor: 'rgba(0, 0, 0, 0.1)' }}></div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {partnerLogos.slice(4, 8).map((partner) => (
              <div
                key={partner.id}
                className="bg-white rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-105"
                style={{
                  border: '1px solid rgba(0, 0, 0, 0.1)',
                  padding: '24px',
                  maxHeight: '120px',
                  filter: 'grayscale(100%) opacity(0.7)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.filter = 'grayscale(0%) opacity(1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.filter = 'grayscale(100%) opacity(0.7)';
                }}
              >
                <div className="relative w-full h-20 flex items-center justify-center">
                  <span className="text-vn-dark font-montserrat font-bold text-lg text-center">
                    {partner.name}
                  </span>
                  {/* Placeholder for actual logo image */}
                  {/* <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  /> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}