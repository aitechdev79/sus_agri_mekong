'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname } from '@/lib/content-locale';

export default function ESGPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const isEn = locale === 'en';

  const content = {
    title: isEn ? 'ESG - Environment, Social and Governance' : 'ESG - Môi trường, Xã hội và Quản trị',
    intro: isEn
      ? 'ESG (Environment, Social, and Governance) is a framework to evaluate business performance beyond financial outcomes. It is now a strategic requirement for organizations that aim to grow sustainably and integrate into global supply chains.'
      : 'ESG (Environment, Social, and Governance) là khung tiêu chuẩn đánh giá hiệu quả hoạt động của doanh nghiệp dựa trên ba trụ cột chính: Môi trường, Xã hội và Quản trị. Đây không chỉ là xu hướng toàn cầu mà còn là yêu cầu bắt buộc đối với các doanh nghiệp muốn phát triển bền vững và tham gia vào chuỗi cung ứng quốc tế.',
    pillars: [
      {
        emoji: '🌍',
        title: isEn ? 'Environment (E)' : 'Môi trường (E)',
        text: isEn
          ? 'Covers emissions, energy transition, biodiversity protection, resource efficiency, and waste management.'
          : 'Đánh giá tác động của doanh nghiệp đến môi trường, bao gồm quản lý khí thải, sử dụng năng lượng tái tạo, bảo vệ đa dạng sinh học và quản lý chất thải.',
        box: 'bg-green-50 border-green-600 text-green-800',
      },
      {
        emoji: '👥',
        title: isEn ? 'Social (S)' : 'Xã hội (S)',
        text: isEn
          ? 'Focuses on labor practices, worker rights, occupational health and safety, inclusion, and community impact.'
          : 'Tập trung vào trách nhiệm xã hội của doanh nghiệp, bao gồm điều kiện lao động, quyền lợi người lao động, an toàn sức khỏe và phát triển cộng đồng.',
        box: 'bg-blue-50 border-blue-600 text-blue-800',
      },
      {
        emoji: '🏛️',
        title: isEn ? 'Governance (G)' : 'Quản trị (G)',
        text: isEn
          ? 'Assesses governance structure, transparency, compliance, business ethics, and accountability.'
          : 'Đánh giá cấu trúc quản trị doanh nghiệp, tính minh bạch, tuân thủ pháp luật, đạo đức kinh doanh và trách nhiệm giải trình.',
        box: 'bg-purple-50 border-purple-600 text-purple-800',
      },
    ],
    whyTitle: isEn ? 'Why ESG matters' : 'Tại sao ESG quan trọng?',
    whyItems: isEn
      ? [
          'Improve competitiveness and brand credibility in international markets',
          'Meet investor and partner expectations on sustainability performance',
          'Reduce legal, operational, and reputational risks',
          'Strengthen long-term resilience in global value chains',
          'Contribute to national sustainable development priorities',
        ]
      : [
          'Nâng cao năng lực cạnh tranh và uy tín doanh nghiệp trên thị trường quốc tế',
          'Đáp ứng yêu cầu của nhà đầu tư và đối tác quốc tế về phát triển bền vững',
          'Giảm thiểu rủi ro pháp lý và tài chính liên quan đến môi trường và xã hội',
          'Tăng cường lợi thế cạnh tranh trong chuỗi giá trị toàn cầu',
          'Đóng góp tích cực cho mục tiêu phát triển bền vững của đất nước',
        ],
    toolsTitle: isEn ? 'ESG assessment tools' : 'Công cụ đánh giá ESG',
    toolsQuote: isEn
      ? '"Know where you are to improve from today."'
      : '“Biết mình đang ở đâu để bắt đầu cải thiện ngay hôm nay.”',
    toolsIntro: isEn
      ? 'Sustainability is no longer optional. A structured assessment helps organizations identify strengths, detect gaps, and prioritize practical improvements with transparent metrics.'
      : 'Phát triển bền vững không còn là lựa chọn mà đã trở thành một định hướng chiến lược để vừa tối ưu hiệu quả hoạt động, vừa bảo tồn tài nguyên và nâng cao khả năng thích ứng trước những biến động toàn cầu.',
    frameworkTitle: isEn ? 'International assessment frameworks' : 'Các khung đánh giá quốc tế',
    learnMore: isEn ? 'Learn more →' : 'Tìm hiểu thêm →',
  };

  const tools = [
    {
      name: 'GRI Standards',
      img: '/GRI_logo.png',
      href: 'https://esg.edu.vn/global-reporting-initiative-gri/',
      desc: isEn
        ? 'Global sustainability reporting standards for transparent disclosure of environmental, social, and economic impacts.'
        : 'Tiêu chuẩn báo cáo bền vững toàn cầu được sử dụng rộng rãi nhất, giúp doanh nghiệp công bố thông tin về tác động kinh tế, môi trường và xã hội một cách minh bạch.',
    },
    {
      name: 'SASB Standards',
      img: '/SASB_Logo.jpg',
      href: 'https://fmit.vn/tu-dien-quan-ly/sasb-standards-sustainability-accounting-standards-board-la-gi',
      desc: isEn
        ? 'Industry-specific ESG standards focused on financially material issues for investor decision-making.'
        : 'Tiêu chuẩn đánh giá ESG tập trung vào các vấn đề tài chính trọng yếu theo từng ngành, giúp nhà đầu tư đưa ra quyết định dựa trên thông tin bền vững đáng tin cậy.',
    },
    {
      name: 'CDP Platform',
      img: '/CDP_logo.png',
      href: 'https://m2mesg.com/bao-cao-cdp/',
      desc: isEn
        ? 'Global disclosure platform for climate, water, and forests to manage environmental risks and opportunities.'
        : 'Nền tảng công bố thông tin về khí hậu, nước và rừng toàn cầu. Hơn 9,600 công ty sử dụng CDP để quản lý tác động môi trường và giao tiếp với nhà đầu tư.',
    },
    {
      name: 'TCFD Framework',
      img: '/TCFD_logo.jpeg',
      href: 'https://esgviet.com/tinh-nang-quan-ly-rui-ro-khi-hau-theo-tcfd/',
      desc: isEn
        ? 'Framework for climate-related financial disclosures, helping organizations report risks and opportunities consistently.'
        : 'Khung công bố thông tin tài chính liên quan đến khí hậu, giúp doanh nghiệp đánh giá và báo cáo rủi ro và cơ hội từ biến đổi khí hậu một cách có cấu trúc.',
    },
    {
      name: 'UN SDGs',
      img: '/UN SDG_logo.png',
      href: 'https://vietnam.un.org/vi/sdgs',
      desc: isEn
        ? 'The 17 Sustainable Development Goals provide a shared roadmap for business and societal impact.'
        : '17 Mục tiêu Phát triển Bền vững của Liên Hợp Quốc cung cấp khung tổng thể để doanh nghiệp đóng góp vào các mục tiêu toàn cầu về xã hội và môi trường.',
    },
    {
      name: 'ESG Rating',
      img: '',
      href: 'https://esgviet.com/esg-rating-la-gi-chien-luoc-cai-thien-cdp-msci-sustainalytics-cho-dn-viet-case-vinamilk-vingroup/',
      desc: isEn
        ? 'Rating systems such as MSCI, S&P, and Sustainalytics support comparable ESG performance benchmarking.'
        : 'Các hệ thống xếp hạng ESG từ MSCI, S&P, Sustainalytics giúp nhà đầu tư và đối tác đánh giá hiệu quả ESG của doanh nghiệp một cách khách quan và có thể so sánh.',
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="relative z-50">
        <NavigationBar />
      </div>

      <main className="pt-16">
        <section className="relative w-full h-[400px] md:h-[500px]">
          <Image src="/esg_hero.jpg" alt="ESG Hero Banner" fill className="object-cover" priority sizes="100vw" />
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl text-gray-800 mb-6">{content.title}</h1>
            <div className="space-y-8">
              <p className="text-lg text-gray-700 leading-relaxed font-montserrat">{content.intro}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {content.pillars.map((pillar) => (
                  <div key={pillar.title} className={`p-6 rounded-lg border-l-4 hover:shadow-lg transition-shadow duration-300 ${pillar.box}`}>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-14 h-14 bg-white/60 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl">{pillar.emoji}</span>
                      </div>
                      <h3 className="font-montserrat font-bold text-2xl">{pillar.title}</h3>
                    </div>
                    <p className="text-gray-700 font-montserrat leading-relaxed">{pillar.text}</p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-8 rounded-lg">
                <h2 className="font-montserrat font-bold text-3xl text-gray-800 mb-6">{content.whyTitle}</h2>
                <ul className="space-y-4 text-gray-700 font-montserrat">
                  {content.whyItems.map((item) => (
                    <li key={item} className="flex items-start">
                      <span className="text-green-600 font-bold mr-3 text-xl">✓</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-gradient-to-br from-gray-50 to-slate-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-800 mb-4">{content.toolsTitle}</h2>
              <p className="text-indigo-600 font-montserrat text-xl md:text-2xl font-semibold mb-6 italic">{content.toolsQuote}</p>
            </div>

            <div className="bg-white rounded-lg p-8 shadow-md mb-12">
              <p className="text-gray-700 font-montserrat leading-relaxed">{content.toolsIntro}</p>
            </div>

            <h3 className="font-montserrat font-bold text-2xl text-gray-800 mb-6">{content.frameworkTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tools.map((tool) => (
                <a
                  key={tool.name}
                  href={tool.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block bg-white rounded-lg p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-montserrat font-bold text-xl text-gray-900">{tool.name}</h3>
                    {tool.img ? (
                      <div className="relative w-16 h-16">
                        <Image src={tool.img} alt={tool.name} fill className="object-contain" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center">
                        <span className="text-3xl">⭐</span>
                      </div>
                    )}
                  </div>
                  <p className="text-gray-700 font-montserrat text-sm mb-4 leading-relaxed">{tool.desc}</p>
                  <div className="text-sm text-gray-900 font-montserrat font-semibold">{content.learnMore}</div>
                </a>
              ))}
            </div>

          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
