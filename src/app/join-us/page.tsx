'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

export default function JoinUsPage() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    companySize: '',
    industry: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden w-screen"
        style={{
          height: '60vh',
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
            height: '60vh',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}
        >
          <Image
            src="/hero/hero_members.jpg"
            alt="Tham gia mạng lưới hợp tác"
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
            <div className="max-w-3xl">
              <div className="mb-6">
                <h1 className="font-montserrat font-bold text-white text-left" style={{ lineHeight: '1.1', letterSpacing: '0.5px' }}>
                  <div className="text-3xl md:text-4xl lg:text-6xl">
                    Tham gia
                  </div>
                  <div className="text-3xl md:text-4xl lg:text-6xl">
                    Mạng lưới Hợp tác
                  </div>
                  <div className="text-3xl md:text-4xl lg:text-6xl">
                    Phát triển Bền vững
                  </div>
                </h1>
              </div>

              <div className="mb-6">
                <p className="font-montserrat font-normal text-white text-left max-w-2xl text-sm md:text-lg lg:text-xl" style={{ lineHeight: '1.5' }}>
                  Kết nối với các doanh nghiệp hàng đầu để cùng xây dựng tương lai bền vững cho ngành nông nghiệp Việt Nam.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Introduction Section */}
        <section className="mb-16">
          <div className="max-w-4xl">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-800 mb-6 text-left">
              Tham gia Mạng lưới Hợp tác của Chúng tôi
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="font-montserrat text-lg text-gray-600 leading-relaxed mb-6 text-left">
                Trở thành thành viên của mạng lưới hợp tác để thúc đẩy các mục tiêu kinh doanh trong lĩnh vực
                đổi mới và phát triển bền vững. Chúng tôi kết nối các nhà lãnh đạo ngành để tạo ra những
                giải pháp tích cực cho cộng đồng nông nghiệp Việt Nam.
              </p>
              <p className="font-montserrat text-lg text-gray-600 leading-relaxed mb-8 text-left">
                Bằng cách tham gia vào sáng kiến toàn cầu này, bạn sẽ có cơ hội hợp tác với các tổ chức
                hàng đầu, chia sẻ kiến thức và cùng nhau xây dựng một chuỗi cung ứng nông nghiệp bền vững.
              </p>

              {/* Benefits Call-to-Action */}
              <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-8">
                <h3 className="font-montserrat font-bold text-xl text-gray-800 mb-4">
                  Lợi ích Thành viên
                </h3>
                <p className="font-montserrat text-gray-600 mb-4">
                  Khám phá những lợi ích độc quyền dành cho các thành viên trong mạng lưới hợp tác của chúng tôi.
                </p>
                <Link
                  href="#benefits"
                  className="inline-flex items-center gap-2 font-montserrat font-semibold text-green-600 hover:text-green-700 transition-colors duration-300"
                >
                  Xem lợi ích thành viên
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="mb-16">
          <div className="bg-gray-50 rounded-2xl p-8 md:p-12">
            <h3 className="font-montserrat font-bold text-2xl md:text-3xl text-gray-800 mb-8 text-center">
              Lợi ích Thành viên
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-green-600">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h4 className="font-montserrat font-bold text-lg text-gray-800 mb-2">Mạng lưới Kết nối</h4>
                <p className="font-montserrat text-gray-600">Kết nối với các doanh nghiệp và chuyên gia hàng đầu trong ngành</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-blue-600">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </div>
                <h4 className="font-montserrat font-bold text-lg text-gray-800 mb-2">Chia sẻ Kiến thức</h4>
                <p className="font-montserrat text-gray-600">Tiếp cận các nghiên cứu, báo cáo và thực hành tốt nhất</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-purple-600">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    <polyline points="7.5,4.21 12,6.81 16.5,4.21" />
                    <polyline points="7.5,19.79 7.5,14.6 3,12" />
                    <polyline points="21,12 16.5,14.6 16.5,19.79" />
                  </svg>
                </div>
                <h4 className="font-montserrat font-bold text-lg text-gray-800 mb-2">Cơ hội Hợp tác</h4>
                <p className="font-montserrat text-gray-600">Tham gia các dự án hợp tác và sáng kiến phát triển bền vững</p>
              </div>
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section className="mb-16">
          <div className="max-w-4xl">
            <h2 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-800 mb-6 text-left">
              Đơn đăng ký Thành viên
            </h2>
            <p className="font-montserrat text-lg text-gray-600 leading-relaxed mb-8 text-left">
              Để bắt đầu đăng ký thành viên cho công ty của bạn, vui lòng hoàn thành biểu mẫu dưới đây.
            </p>

            {/* Application Form */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companyName" className="block text-sm font-montserrat font-semibold text-gray-700 mb-2">
                      Tên Công ty <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="companyName"
                      name="companyName"
                      required
                      value={formData.companyName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="Nhập tên công ty"
                    />
                  </div>

                  <div>
                    <label htmlFor="contactName" className="block text-sm font-montserrat font-semibold text-gray-700 mb-2">
                      Tên Người liên hệ <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="contactName"
                      name="contactName"
                      required
                      value={formData.contactName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="Nhập tên người liên hệ"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-montserrat font-semibold text-gray-700 mb-2">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="example@company.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-montserrat font-semibold text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      placeholder="+84 xxx xxx xxx"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="companySize" className="block text-sm font-montserrat font-semibold text-gray-700 mb-2">
                      Quy mô Công ty
                    </label>
                    <select
                      id="companySize"
                      name="companySize"
                      value={formData.companySize}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Chọn quy mô công ty</option>
                      <option value="1-10">1-10 nhân viên</option>
                      <option value="11-50">11-50 nhân viên</option>
                      <option value="51-200">51-200 nhân viên</option>
                      <option value="201-500">201-500 nhân viên</option>
                      <option value="500+">Trên 500 nhân viên</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-montserrat font-semibold text-gray-700 mb-2">
                      Lĩnh vực Hoạt động
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Chọn lĩnh vực</option>
                      <option value="agriculture">Nông nghiệp</option>
                      <option value="aquaculture">Thủy sản</option>
                      <option value="food-processing">Chế biến thực phẩm</option>
                      <option value="supply-chain">Chuỗi cung ứng</option>
                      <option value="technology">Công nghệ</option>
                      <option value="consulting">Tư vấn</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-montserrat font-semibold text-gray-700 mb-2">
                    Tin nhắn / Mô tả ngắn về công ty
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                    placeholder="Mô tả ngắn về công ty và mục tiêu hợp tác..."
                  />
                </div>

                <div className="pt-6">
                  <button
                    type="submit"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 font-montserrat font-bold text-lg text-white bg-green-600 hover:bg-green-700 transition-all duration-300 px-12 py-4 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    GỬI ĐĂNG KÝ
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-500 font-montserrat">
                    Bằng cách gửi đăng ký, bạn đồng ý với{' '}
                    <Link href="/terms" className="text-green-600 hover:text-green-700 underline">
                      Điều khoản sử dụng
                    </Link>{' '}
                    và{' '}
                    <Link href="/privacy" className="text-green-600 hover:text-green-700 underline">
                      Chính sách bảo mật
                    </Link>{' '}
                    của chúng tôi.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Contact Information Section */}
        <section className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 md:p-12">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="font-montserrat font-bold text-2xl md:text-3xl text-gray-800 mb-6">
              Cần hỗ trợ?
            </h3>
            <p className="font-montserrat text-lg text-gray-600 leading-relaxed mb-8">
              Nếu bạn có câu hỏi về việc đăng ký thành viên hoặc cần thêm thông tin,
              đội ngũ của chúng tôi sẵn sàng hỗ trợ bạn.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 font-montserrat font-semibold text-green-600 hover:text-green-700 border-2 border-green-600 hover:border-green-700 px-6 py-3 rounded-lg transition-all duration-300"
              >
                Liên hệ chúng tôi
              </Link>
              <Link
                href="mailto:info@example.com"
                className="inline-flex items-center justify-center gap-2 font-montserrat font-semibold text-blue-600 hover:text-blue-700 border-2 border-blue-600 hover:border-blue-700 px-6 py-3 rounded-lg transition-all duration-300"
              >
                Gửi email
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}