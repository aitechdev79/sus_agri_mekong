'use client';

import { useState } from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';

type PolicyCategory = 'all' | 'esg' | 'agriculture' | 'labor' | 'environment' | 'trade';

interface Policy {
  id: string;
  title: string;
  category: PolicyCategory;
  status: 'new' | 'updated' | 'urgent';
  date: string;
  summary: string;
  source: string;
}

export default function PolicyPage() {
  const [selectedCategory, setSelectedCategory] = useState<PolicyCategory>('all');

  const categories = [
    { id: 'all' as PolicyCategory, name: 'Tất cả', icon: '📋' },
    { id: 'esg' as PolicyCategory, name: 'ESG & Bền vững', icon: '🌱' },
    { id: 'agriculture' as PolicyCategory, name: 'Nông nghiệp', icon: '🌾' },
    { id: 'labor' as PolicyCategory, name: 'Lao động', icon: '👥' },
    { id: 'environment' as PolicyCategory, name: 'Môi trường', icon: '🌍' },
    { id: 'trade' as PolicyCategory, name: 'Thương mại', icon: '📊' },
  ];

  const policies: Policy[] = [
    {
      id: '1',
      title: 'Nghị định về Báo cáo Phát triển Bền vững cho Doanh nghiệp',
      category: 'esg',
      status: 'new',
      date: '15/11/2025',
      summary: 'Nghị định mới quy định báo cáo bền vững bắt buộc cho doanh nghiệp niêm yết từ năm 2026, bao gồm tiêu chí ESG và tuân thủ tiêu chuẩn quốc tế.',
      source: 'Chính phủ Việt Nam',
    },
    {
      id: '2',
      title: 'Thông tư hướng dẫn VietGAP cho nuôi trồng thủy sản',
      category: 'agriculture',
      status: 'updated',
      date: '10/11/2025',
      summary: 'Cập nhật quy trình chứng nhận VietGAP cho tôm và cá, tăng cường yêu cầu về an toàn sinh học và truy xuất nguồn gốc.',
      source: 'Bộ Nông nghiệp và Phát triển Nông thôn',
    },
    {
      id: '3',
      title: 'Quy định mới về Lương tối thiểu vùng năm 2026',
      category: 'labor',
      status: 'urgent',
      date: '05/11/2025',
      summary: 'Tăng lương tối thiểu vùng trung bình 6% từ tháng 7/2026, ảnh hưởng trực tiếp đến chi phí lao động trong doanh nghiệp.',
      source: 'Bộ Lao động - Thương binh và Xã hội',
    },
    {
      id: '4',
      title: 'Chiến lược Kinh tế Tuần hoàn và Phát triển Xanh',
      category: 'environment',
      status: 'new',
      date: '01/11/2025',
      summary: 'Chiến lược quốc gia đến 2030, tầm nhìn 2050 về kinh tế tuần hoàn, giảm phát thải ròng bằng 0 và chuyển đổi xanh.',
      source: 'Thủ tướng Chính phủ',
    },
    {
      id: '5',
      title: 'Quy định xuất khẩu thủy sản theo tiêu chuẩn EU',
      category: 'trade',
      status: 'updated',
      date: '28/10/2025',
      summary: 'Cập nhật yêu cầu truy xuất nguồn gốc và an toàn thực phẩm cho thủy sản xuất khẩu vào thị trường EU từ Q1/2026.',
      source: 'Bộ Công Thương',
    },
    {
      id: '6',
      title: 'Nghị định về Quản lý Chất thải Rắn trong Sản xuất',
      category: 'environment',
      status: 'new',
      date: '20/10/2025',
      summary: 'Quy định mới về phân loại, thu gom và xử lý chất thải rắn công nghiệp, yêu cầu doanh nghiệp báo cáo định kỳ.',
      source: 'Bộ Tài nguyên và Môi trường',
    },
  ];

  const internationalStandards = [
    {
      code: 'SA8000',
      name: 'Social Accountability International',
      description: 'Tiêu chuẩn quốc tế về trách nhiệm xã hội trong môi trường làm việc',
      areas: ['Lao động', 'Nhân quyền', 'An toàn'],
    },
    {
      code: 'BSCI',
      name: 'Business Social Compliance Initiative',
      description: 'Sáng kiến tuân thủ xã hội doanh nghiệp châu Âu',
      areas: ['Chuỗi cung ứng', 'Lao động', 'Đạo đức'],
    },
    {
      code: 'ASC',
      name: 'Aquaculture Stewardship Council',
      description: 'Tiêu chuẩn nuôi trồng thủy sản có trách nhiệm',
      areas: ['Thủy sản', 'Môi trường', 'Bền vững'],
    },
    {
      code: 'SRP',
      name: 'Sustainable Rice Platform',
      description: 'Nền tảng lúa gạo bền vững toàn cầu',
      areas: ['Nông nghiệp', 'Lúa gạo', 'Bền vững'],
    },
    {
      code: 'ISO 22000',
      name: 'Food Safety Management',
      description: 'Hệ thống quản lý an toàn thực phẩm',
      areas: ['An toàn thực phẩm', 'Chất lượng', 'Quản lý'],
    },
    {
      code: 'GRS',
      name: 'Global Reporting Initiative',
      description: 'Tiêu chuẩn báo cáo bền vững toàn cầu',
      areas: ['ESG', 'Báo cáo', 'Minh bạch'],
    },
  ];

  const expertQuotes = [
    {
      quote: 'Việc cập nhật và tuân thủ các quy định pháp lý về ESG không chỉ là nghĩa vụ mà còn là cơ hội để doanh nghiệp nâng cao năng lực cạnh tranh và tiếp cận thị trường quốc tế.',
      author: 'TS. Nguyễn Văn Minh',
      position: 'Chuyên gia Chính sách Phát triển Bền vững',
      organization: 'Viện Chiến lược và Chính sách Tài nguyên Môi trường',
    },
    {
      quote: 'Doanh nghiệp cần chủ động theo dõi và điều chỉnh hoạt động kinh doanh phù hợp với các tiêu chuẩn quốc tế như SA8000, BSCI để đảm bảo vị thế trong chuỗi giá trị toàn cầu.',
      author: 'Luật sư Trần Thị Hương',
      position: 'Giám đốc Pháp chế',
      organization: 'Phòng Thương mại và Công nghiệp Việt Nam (VCCI)',
    },
  ];

  const filteredPolicies = selectedCategory === 'all'
    ? policies
    : policies.filter(p => p.category === selectedCategory);

  const getStatusBadge = (status: string) => {
    const styles = {
      new: 'bg-blue-100 text-blue-800 border-blue-300',
      updated: 'bg-green-100 text-green-800 border-green-300',
      urgent: 'bg-red-100 text-red-800 border-red-300',
    };
    const labels = {
      new: 'Mới',
      updated: 'Cập nhật',
      urgent: 'Khẩn cấp',
    };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status as keyof typeof styles]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Navigation Bar */}
      <div className="relative z-50">
        <NavigationBar />
      </div>

      {/* Main Content */}
      <main className="pt-16">
        {/* Hero Section */}
        <section className="relative w-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 text-white py-20">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/vecteezy_topo_34242655.svg"
              alt="Background pattern"
              fill
              className="object-cover"
              priority={false}
            />
          </div>
          <div className="container mx-auto px-6 max-w-6xl relative z-10">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-6">
              Theo dõi Chính sách & Quy định
            </h1>
            <p className="text-lg md:text-xl text-blue-100 leading-relaxed max-w-4xl font-montserrat">
              Khám phá chuyên mục Theo dõi chính sách & quy định – nơi cập nhật những thay đổi pháp lý quan trọng
              trong lĩnh vực phát triển bền vững, báo cáo bền vững ESG, chuyển đổi xanh. Với tóm tắt ngắn gọn,
              công cụ lọc thông minh và bảng điều khiển trực quan, bạn dễ dàng nắm bắt tác động chính sách và
              tiếp cận bối cảnh thực tiễn từ các nghiên cứu, tiêu chuẩn quốc tế.
            </p>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 bg-gray-50 sticky top-16 z-40 shadow-sm">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex flex-wrap gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-montserrat font-semibold transition-all duration-200 flex items-center gap-2 ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-md scale-105'
                      : 'bg-white text-gray-700 hover:bg-blue-50 border border-gray-200'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Policies List */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="font-montserrat font-bold text-3xl text-gray-800 mb-8">
              Chính sách & Quy định nổi bật
            </h2>
            <div className="grid gap-6">
              {filteredPolicies.map((policy) => (
                <div
                  key={policy.id}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(policy.status)}
                        <span className="text-sm text-gray-500 font-montserrat">{policy.date}</span>
                      </div>
                      <h3 className="font-montserrat font-bold text-xl text-gray-800 mb-2">
                        {policy.title}
                      </h3>
                      <p className="text-gray-600 font-montserrat leading-relaxed mb-3">
                        {policy.summary}
                      </p>
                      <p className="text-sm text-gray-500 font-montserrat">
                        <span className="font-semibold">Nguồn:</span> {policy.source}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* International Standards Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="font-montserrat font-bold text-3xl text-gray-800 mb-4">
              Tiêu chuẩn Quốc tế
            </h2>
            <p className="text-gray-600 font-montserrat mb-8 text-lg">
              Các tiêu chuẩn quốc tế được áp dụng rộng rãi trong chuỗi giá trị bền vững
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internationalStandards.map((standard) => (
                <div
                  key={standard.code}
                  className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-montserrat font-bold text-2xl text-blue-600">
                      {standard.code}
                    </h3>
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📜</span>
                    </div>
                  </div>
                  <h4 className="font-montserrat font-semibold text-lg text-gray-800 mb-2">
                    {standard.name}
                  </h4>
                  <p className="text-gray-600 font-montserrat text-sm mb-4 leading-relaxed">
                    {standard.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {standard.areas.map((area) => (
                      <span
                        key={area}
                        className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold font-montserrat"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Expert Quotes Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="font-montserrat font-bold text-3xl text-gray-800 mb-8 text-center">
              Ý kiến Chuyên gia
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {expertQuotes.map((item, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-br from-blue-50 to-white border-l-4 border-blue-600 p-8 rounded-lg shadow-md"
                >
                  <div className="mb-4">
                    <svg
                      className="w-10 h-10 text-blue-600 opacity-50"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                    </svg>
                  </div>
                  <p className="text-gray-700 font-montserrat italic text-lg leading-relaxed mb-6">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                  <div className="border-t border-gray-200 pt-4">
                    <p className="font-montserrat font-bold text-gray-800">{item.author}</p>
                    <p className="font-montserrat text-sm text-gray-600">{item.position}</p>
                    <p className="font-montserrat text-sm text-blue-600">{item.organization}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12 bg-blue-900 text-white">
          <div className="container mx-auto px-6 max-w-6xl text-center">
            <h2 className="font-montserrat font-bold text-3xl mb-4">
              Cần hỗ trợ về chính sách và quy định?
            </h2>
            <p className="font-montserrat text-lg text-blue-100 mb-6">
              Liên hệ với chúng tôi để được tư vấn chi tiết về các chính sách, quy định và tiêu chuẩn quốc tế
            </p>
            <button className="px-8 py-3 bg-white text-blue-900 font-montserrat font-bold rounded-lg hover:bg-blue-50 transition-colors duration-200">
              Liên hệ ngay
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
