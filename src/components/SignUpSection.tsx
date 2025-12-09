'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function SignUpSection() {
  const partnerLogos = [
    // Row 1
    { id: 'vinamilk', name: 'Vinamilk', logo: '/Logo_Vinamilk_(2023).png' },
    { id: 'john-deere', name: 'John Deere', logo: '/John_Deere_logo.svg.png' },
    { id: 'loctroi', name: 'Lộc Trời', logo: '/06-loctroi.png' },
    { id: 'binhdien', name: 'Bình Điền', logo: '/03-binhdien.jpg' },
    // Row 2
    { id: 'cp', name: 'CP', logo: '/02-CP.jpg' },
    { id: 'vietfood', name: 'Vietfood', logo: '/vietfood.png' },
    { id: 'agribank', name: 'Agribank', logo: '/Agribank.png' },
    { id: 'phan-bon-ca-mau', name: 'Phân bón Cà Mau', logo: '/phan bon ca mau.png' },
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
              <p className="uppercase font-montserrat font-semibold tracking-wider mb-4" style={{ fontSize: '18px', color: 'rgba(60, 60, 59, 0.6)' }}>
                Trở thành đối tác
              </p>

              {/* Main Headline */}
              <h2 className="text-vn-dark font-montserrat font-bold leading-tight" style={{ fontSize: '38.4px', fontWeight: 700 }}>
                Đối tác doanh nghiệp được cập nhật các chương trình và nội dung mới nhất. Được kết nối với cộng đồng doanh nghiệp, chuyên gia và nông dân.
              </h2>
            </div>

            {/* Right Side - CTA Button */}
            <Link
              href="/join-us"
              className="flex-shrink-0 inline-flex items-center gap-2 font-montserrat font-bold transition-all duration-300 hover:scale-105"
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
              aria-label="Trở thành đối tác"
            >
              Trở thành đối tác
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
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
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
                  <Image
                    src={partner.logo}
                    alt={partner.name}
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}