'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

export default function DaoTaoKiemKeKNKPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative z-50">
        <NavigationBar />
      </div>

      <main className="pt-24 pb-16">
        <section className="container mx-auto px-6 max-w-4xl">
          <div className="border border-gray-200 rounded-2xl p-6 md:p-8 bg-white shadow-sm">
            <header className="mb-6">
              <h1 className="font-montserrat font-bold text-2xl md:text-3xl text-gray-900 mb-4 leading-snug">
                Khóa đào tạo chuyên sâu: Quản lý năng lượng hiệu quả và Kiểm kê khí nhà kính - Hướng đến thực hành báo cáo bền vững ESG
              </h1>

              <div className="flex flex-wrap gap-2 mb-4" aria-label="Chủ đề">
                <span className="px-3 py-1 bg-slate-100 border border-gray-200 rounded-full text-sm font-semibold">
                  Quản lý năng lượng
                </span>
                <span className="px-3 py-1 bg-slate-100 border border-gray-200 rounded-full text-sm font-semibold">
                  Kiểm kê khí nhà kính (GHG)
                </span>
                <span className="px-3 py-1 bg-slate-100 border border-gray-200 rounded-full text-sm font-semibold">
                  Giảm phát thải
                </span>
                <span className="px-3 py-1 bg-slate-100 border border-gray-200 rounded-full text-sm font-semibold">
                  ESG / Báo cáo bền vững
                </span>
              </div>
            </header>

            <section className="text-gray-700 font-montserrat leading-relaxed space-y-4">
              <div className="text-[15px] md:text-base">
                <p>
                  Trong bối cảnh các thị trường lớn trên quốc tế như <strong>EU, Mỹ, Nhật</strong> ngày càng nâng cao yêu cầu đối với việc
                  <strong> kiểm soát môi trường</strong>, <strong>phát thải carbon</strong> và <strong>sử dụng năng lượng hiệu quả</strong>,
                  doanh nghiệp muốn duy trì khả năng cạnh tranh và tiết kiệm chi phí sản xuất cần xây dựng
                  <strong> hệ thống quản lý năng lượng</strong>, <strong>kiểm kê khí nhà kính</strong> để xây dựng phương án giảm phát thải.
                </p>
                <p>
                  Chính vì vậy, <strong>Liên đoàn Thương mại và Công nghiệp Việt Nam - Chi nhánh khu vực TP. Hồ Chí Minh (VCCI-HCM)</strong>
                  tổ chức khóa đào tạo chuyên sâu về chủ đề nêu trên nhằm hỗ trợ doanh nghiệp xây dựng chiến lược năng lượng và môi trường.
                </p>
              </div>

              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Nội dung chính của khóa học</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Xây dựng chiến lược và hệ thống quản lý năng lượng, sản xuất sạch hơn tại doanh nghiệp;</li>
                  <li>Phương pháp đánh giá, kiểm kê khí nhà kính;</li>
                  <li>Đánh giá việc sử dụng năng lượng và lập kế hoạch giảm phát thải.</li>
                </ul>
              </div>

              <div className="bg-slate-50 border-l-4 border-blue-600 rounded-lg p-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-3">Thông tin khóa đào tạo</h2>
                <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] gap-x-4 gap-y-2 text-sm md:text-base">
                  <div className="text-gray-500">Thời gian:</div>
                  <div><strong>08:30 - 17:00</strong>, ngày <strong>01/02/2026</strong></div>

                  <div className="text-gray-500">Địa điểm:</div>
                  <div>Hội trường Lầu 1, VCCI-HCM, 171 Võ Thị Sáu, P. Xuân Hòa, TP.HCM</div>

                  <div className="text-gray-500">Đối tượng:</div>
                  <div>Lãnh đạo doanh nghiệp, cán bộ phụ trách sản xuất, môi trường, HSE, tuân thủ,</div>

                  <div className="text-gray-500">Học phí:</div>
                  <div><strong>Miễn phí tham dự</strong></div>
                </div>
              </div>

              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Đăng ký tham dự</h2>
                <p className="text-sm md:text-base text-gray-700">
                  VCCI-HCM kính mời đại diện doanh nghiệp tham gia khóa đào tạo bằng cách đăng ký theo đường link dưới đây hoặc scan mã QR code
                  (nếu được hiển thị trên ấn phẩm) trước ngày <span className="font-bold">15/12/2025</span>.
                </p>

                <div className="flex flex-wrap gap-3 mt-4">
                  <a
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-blue-700 bg-blue-600 text-white font-semibold text-sm"
                    href="https://forms.gle/5Nq2LgQKXtT1TTY16"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Đăng ký ngay (Google Form)
                  </a>
                  <a
                    className="inline-flex items-center justify-center px-4 py-2 rounded-xl border border-blue-700 text-blue-700 bg-white font-semibold text-sm"
                    href="https://forms.gle/5Nq2LgQKXtT1TTY16"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Mở link đăng ký
                  </a>
                </div>

                <p className="text-sm text-gray-500 mt-3">
                  Link: <a className="underline" href="https://forms.gle/5Nq2LgQKXtT1TTY16" target="_blank" rel="noopener noreferrer">https://forms.gle/5Nq2LgQKXtT1TTY16</a>
                </p>
              </div>

              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-2">Liên hệ</h2>
                <p className="text-sm md:text-base text-gray-700">
                  Mọi thông tin chi tiết xin liên hệ qua email
                  {' '}
                  <a className="underline" href="mailto:bea@vcci-hcm.org.vn">bea@vcci-hcm.org.vn</a>
                  {' '}
                  hoặc theo số điện thoại:
                </p>
                <ul className="list-disc pl-5 space-y-1 mt-2">
                  <li><strong>0366 006 126</strong> (Ms. Minh Thư)</li>
                  <li><strong>0906 821 203</strong> (Ms. Phương Thảo)</li>
                </ul>
                <p className="text-sm md:text-base text-gray-700 mt-3">
                  Rất mong nhận được sự quan tâm và tham dự từ quý doanh nghiệp. <strong>Trân trọng cảm ơn.</strong>
                </p>
              </div>
            </section>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
