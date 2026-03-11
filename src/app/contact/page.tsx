'use client';

import { Mail, MapPin, Phone, Globe } from 'lucide-react';
import { usePathname } from 'next/navigation';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { getLocaleFromPathname } from '@/lib/content-locale';

const CONTACT = {
  vi: {
    title: 'Liên hệ VCCI TP.HCM',
    subtitle:
      'Kênh liên hệ chính thức của Liên đoàn Thương mại và Công nghiệp Việt Nam (VCCI) - Chi nhánh Khu vực TP.HCM.',
    org: 'VCCI-HCM',
    orgFull: 'Liên đoàn Thương mại và Công nghiệp Việt Nam - Chi nhánh Khu vực TP.HCM',
    addressLabel: 'Địa chỉ',
    address: '171 Võ Thị Sáu, Phường Xuân Hòa, TP.HCM',
    phoneLabel: 'Điện thoại',
    phone: '(028) 3932 6598',
    mobileLabel: 'Hỗ trợ chương trình',
    mobiles: ['0366 006 126 (Ms. Minh Thư)', '0906 821 203 (Ms. Phương Thảo)'],
    emailLabel: 'Email',
    email: 'bea@vcci-hcm.org.vn',
    websiteLabel: 'Website',
    website: 'https://vcci-hcm.org.vn',
    hoursTitle: 'Giờ làm việc',
    hours: 'Thứ Hai - Thứ Sáu, 08:00 - 17:00',
  },
  en: {
    title: 'Contact VCCI Ho Chi Minh City',
    subtitle:
      'Official contact channels of the Vietnam Chamber of Commerce and Industry (VCCI) - Ho Chi Minh City Regional Branch.',
    org: 'VCCI-HCM',
    orgFull: 'Vietnam Chamber of Commerce and Industry - Ho Chi Minh City Regional Branch',
    addressLabel: 'Address',
    address: '171 Vo Thi Sau Street, Xuan Hoa Ward, Ho Chi Minh City, Vietnam',
    phoneLabel: 'Phone',
    phone: '(028) 3932 6598',
    mobileLabel: 'Program support',
    mobiles: ['0366 006 126 (Ms. Minh Thu)', '0906 821 203 (Ms. Phuong Thao)'],
    emailLabel: 'Email',
    email: 'bea@vcci-hcm.org.vn',
    websiteLabel: 'Website',
    website: 'https://vcci-hcm.org.vn',
    hoursTitle: 'Working hours',
    hours: 'Monday - Friday, 08:00 - 17:00',
  },
} as const;

export default function ContactPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname) === 'en' ? 'en' : 'vi';
  const text = CONTACT[locale];

  return (
    <div className="min-h-screen bg-[#F6F3EA]">
      <NavigationBar />

      <main className="container mx-auto max-w-5xl px-6 pb-16 pt-28">
        <section className="rounded-3xl bg-white p-8 shadow-sm md:p-12">
          <p className="mb-3 inline-flex rounded-full bg-[#EAF7EF] px-4 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[#0A7029]">
            {text.org}
          </p>
          <h1 className="font-montserrat text-3xl font-bold text-[#1F2937] md:text-4xl">{text.title}</h1>
          <p className="mt-3 max-w-3xl font-montserrat text-base text-[#4B5563]">{text.subtitle}</p>
          <p className="mt-2 font-montserrat text-sm text-[#6B7280]">{text.orgFull}</p>
        </section>

        <section className="mt-8 grid gap-4 md:grid-cols-2">
          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-2 font-montserrat text-sm font-semibold text-[#0A7029]">
              <MapPin className="h-4 w-4" />
              {text.addressLabel}
            </div>
            <p className="font-montserrat text-[#1F2937]">{text.address}</p>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-2 font-montserrat text-sm font-semibold text-[#0A7029]">
              <Phone className="h-4 w-4" />
              {text.phoneLabel}
            </div>
            <a className="font-montserrat text-[#1F2937] hover:underline" href="tel:+842839326598">
              {text.phone}
            </a>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-2 font-montserrat text-sm font-semibold text-[#0A7029]">
              <Mail className="h-4 w-4" />
              {text.emailLabel}
            </div>
            <a className="font-montserrat text-[#1F2937] hover:underline" href={`mailto:${text.email}`}>
              {text.email}
            </a>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-2 font-montserrat text-sm font-semibold text-[#0A7029]">
              <Globe className="h-4 w-4" />
              {text.websiteLabel}
            </div>
            <a
              className="font-montserrat text-[#1F2937] hover:underline"
              href={text.website}
              target="_blank"
              rel="noopener noreferrer"
            >
              {text.website}
            </a>
          </article>
        </section>

        <section className="mt-4 rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="font-montserrat text-lg font-semibold text-[#1F2937]">{text.mobileLabel}</h2>
          <ul className="mt-2 space-y-1 font-montserrat text-[#4B5563]">
            {text.mobiles.map((mobile) => (
              <li key={mobile}>{mobile}</li>
            ))}
          </ul>
          <p className="mt-4 font-montserrat text-sm text-[#6B7280]">
            <span className="font-semibold text-[#374151]">{text.hoursTitle}:</span> {text.hours}
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}
