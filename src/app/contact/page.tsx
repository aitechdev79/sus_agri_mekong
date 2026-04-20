'use client';

import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import { usePathname } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { getLocaleFromPathname } from '@/lib/content-locale';

const CONTACT = {
  vi: {
    eyebrow: 'VCCI-HCM',
    title: 'Liên hệ VCCI-HCM',
    subtitle:
      'Kênh liên hệ chính thức của Liên đoàn Thương mại & Công nghiệp Việt Nam - Chi nhánh khu vực Thành phố Hồ Chí Minh.',
    org: 'Liên đoàn Thương mại & Công nghiệp Việt Nam - Chi nhánh khu vực Thành phố Hồ Chí Minh (VCCI-HCM)',
    office: 'Văn phòng Giới sử dụng lao động & Doanh nhân nữ',
    addressLabel: 'Địa chỉ',
    address: '171 Võ Thị Sáu, Phường Xuân Hoà, TP. Hồ Chí Minh',
    phoneLabel: 'Điện thoại',
    phone: '(+84) 28 3932 1205 - (+84) 28 3932 6598',
    emailLabel: 'Email',
    email: 'bea@vcci-hcm.org.vn',
    websiteLabel: 'Website',
    website: 'www.vcci-hcm.org.vn',
  },
  en: {
    eyebrow: 'VCCI-HCM',
    title: 'Contact VCCI-HCM',
    subtitle: 'Official contact channel of the Vietnam Chamber of Commerce and Industry - Ho Chi Minh Regional Branch.',
    org: 'Vietnam Chamber of Commerce and Industry - Ho Chi Minh Regional Branch (VCCI-HCM)',
    office: 'Bureau for Employers’ Activities and Women Entrepreneurs Council',
    addressLabel: 'Address',
    address: '171 Vo Thi Sau Str., Xuan Hoa Ward, Ho Chi Minh City',
    phoneLabel: 'Phone',
    phone: '(+84) 28 3932 1205 - (+84) 28 3932 6598',
    emailLabel: 'Email',
    email: 'bea@vcci-hcm.org.vn',
    websiteLabel: 'Website',
    website: 'www.vcci-hcm.org.vn',
  },
} as const;

export default function ContactPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) === 'en' ? 'en' : 'vi';
  const text = CONTACT[locale];
  const details = [
    {
      label: text.addressLabel,
      value: text.address,
      icon: MapPin,
    },
    {
      label: text.phoneLabel,
      value: text.phone,
      icon: Phone,
      href: 'tel:+842839321205',
    },
    {
      label: text.websiteLabel,
      value: text.website,
      icon: Globe,
      href: 'https://www.vcci-hcm.org.vn',
    },
    {
      label: text.emailLabel,
      value: text.email,
      icon: Mail,
      href: `mailto:${text.email}`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F6F3EA]">
      <NavigationBar />

      <main className="container mx-auto max-w-6xl px-6 pb-16 pt-28">
        <section className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-[#EEECE1] px-7 py-10 md:px-10 md:py-12">
              <p className="mb-5 inline-flex rounded-full bg-white px-4 py-1.5 font-montserrat text-xs font-bold uppercase tracking-[0.16em] text-[#0A7029]">
                {text.eyebrow}
              </p>
              <h1 className="font-montserrat text-3xl font-bold leading-tight text-[#1F2937] md:text-5xl">
                {text.title}
              </h1>
              <p className="mt-5 max-w-xl text-justify font-montserrat text-base leading-relaxed text-[#4B5563]">
                {text.subtitle}
              </p>
              <div className="mt-8 space-y-3 border-t border-[#D9D4C3] pt-6 font-montserrat">
                <p className="font-semibold leading-relaxed text-[#1F2937]">{text.org}</p>
                <p className="leading-relaxed text-[#4B5563]">{text.office}</p>
              </div>
            </div>

            <div className="px-7 py-10 md:px-10 md:py-12">
              <div className="space-y-6">
                {details.map((item) => {
                  const Icon = item.icon;
                  const value = item.href ? (
                    <a href={item.href} className="transition-colors hover:text-[#0A7029]" target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}>
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  );

                  return (
                    <div key={item.label} className="flex gap-4 border-b border-gray-100 pb-5 last:border-b-0">
                      <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-[#EAF7EF] text-[#0A7029]">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="font-montserrat">
                        <p className="text-sm font-bold text-[#0A7029]">{item.label}</p>
                        <p className="mt-1 text-base leading-relaxed text-[#1F2937]">{value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
