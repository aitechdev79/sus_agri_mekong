'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function TomCaMauPage() {
  return (
    <div className="min-h-screen">
      <div className="relative z-50">
        <NavigationBar />
      </div>

      <main className="pt-16">
        <section className="relative w-full h-[420px] md:h-[520px]">
          <Image
            src="/esg_hero.jpg"
            alt="Vietnam Best Practices Hero Banner"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-6 max-w-6xl pb-12">
              <p className="text-sm uppercase tracking-[0.2em] text-white/70 font-montserrat mb-4">
                Vietnam Best Practices
              </p>
              <h1 className="text-3xl md:text-5xl font-bold text-white font-montserrat mb-4">
                Mô hình Tôm - Rừng Cà Mau
              </h1>
              <p className="text-base md:text-lg text-white/80 font-montserrat max-w-3xl">
                Nuôi tôm kết hợp bảo vệ rừng ngập mặn (ASC) với mục tiêu vừa tăng sinh kế địa phương,
                vừa nâng cao khả năng thích ứng khí hậu.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <header className="mb-8">
              <h2 className="font-montserrat font-bold text-2xl md:text-3xl text-gray-900 mb-4">
                Mô hình Tôm - Rừng Cà Mau: Nuôi tôm kết hợp bảo vệ rừng ngập mặn (ASC)
              </h2>
              <div className="flex flex-wrap gap-2 mb-4" aria-label="Chủ đề">
                <span className="px-3 py-1 bg-cyan-50 text-slate-900 rounded-full text-sm font-semibold border border-gray-200">
                  Nuôi trồng thủy sản bền vững
                </span>
                <span className="px-3 py-1 bg-cyan-50 text-slate-900 rounded-full text-sm font-semibold border border-gray-200">
                  Rừng ngập mặn
                </span>
                <span className="px-3 py-1 bg-cyan-50 text-slate-900 rounded-full text-sm font-semibold border border-gray-200">
                  Chứng nhận ASC
                </span>
                <span className="px-3 py-1 bg-cyan-50 text-slate-900 rounded-full text-sm font-semibold border border-gray-200">
                  Sinh kế &amp; thích ứng khí hậu
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-[180px_1fr] gap-x-4 gap-y-2 text-sm text-gray-700 font-montserrat mb-4">
                <div className="text-gray-500">Địa điểm:</div>
                <div>Cà Mau, Đồng bằng sông Cửu Long (Việt Nam)</div>
                <div className="text-gray-500">Mô hình:</div>
                <div>Nuôi tôm quảng canh/kết hợp dưới tán rừng ngập mặn (integrated mangrove-shrimp farming)</div>
                <div className="text-gray-500">Chứng nhận:</div>
                <div>ASC (bao gồm mô hình chứng nhận nhóm/ASC Group ở một số khu vực)</div>
              </div>

              <p className="text-sm text-gray-600 font-montserrat">
                Tài liệu tóm lược theo hướng học thuật - thực tiễn. Các số liệu nên được đối chiếu theo đúng phạm vi,
                năm báo cáo và phương pháp đo lường của đơn vị công bố.
              </p>
            </header>

            <section className="space-y-6 text-gray-700 font-montserrat leading-relaxed">
              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">1. Mô tả mô hình</h3>
                <p>
                  <strong>Mô hình tôm rừng</strong> là hệ thống nuôi tôm kết hợp duy trì tỷ lệ che phủ rừng ngập mặn trong
                  khu vực sản xuất. Về mặt sinh thái, rừng ngập mặn đóng vai trò như hạ tầng tự nhiên giúp ổn định nền đáy,
                  lọc nước, tạo nơi cư trú cho sinh vật, giảm xói lở và tăng khả năng chống chịu trước bão, triều cường và
                  xâm nhập mặn.
                </p>
                <p>
                  Về mặt kinh tế, mô hình thường định vị theo hướng <strong>giá trị gia tăng</strong> (premium) thông qua
                  chứng nhận/tiêu chuẩn (ví dụ ASC), truy xuất nguồn gốc và liên kết chuỗi với doanh nghiệp chế biến - xuất khẩu.
                </p>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">2. ASC trong bối cảnh tôm rừng</h3>
                <p>
                  ASC (Aquaculture Stewardship Council) là một hệ thống chứng nhận cho nuôi trồng thủy sản có trách nhiệm,
                  nhấn mạnh giảm tác động môi trường, bảo vệ hệ sinh thái, tuân thủ các yêu cầu xã hội - lao động và quản trị
                  chuỗi cung ứng. Với mô hình tôm rừng tại Cà Mau, chứng nhận ASC (bao gồm <em>ASC Group</em>) đã được triển
                  khai tại một số xã/huyện, nhằm đáp ứng yêu cầu thị trường nhập khẩu và tạo premium giá bán.
                  <span className="text-gray-500">
                    {' '} (Thông tin về sự kiện công bố ASC Group và quy mô khu vực chứng nhận có thể xem trong các nguồn tham khảo bên dưới.)
                  </span>
                </p>

                <div className="bg-slate-50 border-l-4 border-green-500 p-4 mt-4">
                  <strong>Điểm quan trọng về đo lường tác động:</strong> Tăng thu nhập trong các báo cáo dự án/doanh nghiệp
                  có thể đến từ nhiều cấu phần (giá thu mua cao hơn, giảm rủi ro dịch bệnh, ổn định sản lượng, đa dạng hóa
                  sản phẩm dưới tán rừng). Khi công bố trên web, nên ghi rõ <em>thu nhập ròng</em> hay <em>doanh thu</em>,
                  giai đoạn so sánh, mẫu khảo sát, và có/không kiểm soát yếu tố mùa vụ.
                </div>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">3. Kết quả và số liệu minh họa</h3>
                <figure>
                  <figcaption className="text-sm text-gray-600 mb-2">
                    <strong>Bảng 1.</strong> Chỉ tiêu minh họa (gợi ý trình bày theo chuẩn báo cáo ESG/impact)
                  </figcaption>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-2 text-left w-[38%]">Chỉ tiêu</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Mô tả / số liệu minh họa</th>
                          <th className="border border-gray-200 px-4 py-2 text-left w-[26%]">Ghi chú đo lường</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2">Thu nhập hộ nuôi</td>
                          <td className="border border-gray-200 px-4 py-2">
                            <strong>+40%</strong> (theo mô tả bạn cung cấp cho nội dung trang)
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-500">
                            Khuyến nghị: nêu rõ thu nhập ròng hay doanh thu; so sánh trước-sau; số hộ (n); năm; có/không nhóm đối chứng.
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2">Chứng nhận ASC cho tôm rừng</td>
                          <td className="border border-gray-200 px-4 py-2">
                            Có triển khai chứng nhận ASC/ASC Group tại một số khu vực tôm rừng ở Cà Mau
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-500">
                            Tham khảo các thông tin công bố địa phương và ngành về chứng nhận tôm rừng (ASC Group).
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2">Tác động sinh thái</td>
                          <td className="border border-gray-200 px-4 py-2">
                            Duy trì rừng ngập mặn trong hệ thống nuôi giúp bảo tồn hệ sinh thái và hỗ trợ thích ứng khí hậu
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-500">
                            Có thể bổ sung: tỷ lệ che phủ rừng (%), biến động đa dạng sinh học, chất lượng nước, xói lở bờ biển (nếu có dữ liệu).
                          </td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2">Rủi ro &amp; tuân thủ</td>
                          <td className="border border-gray-200 px-4 py-2">
                            Nghiên cứu cho thấy tuân thủ tỷ lệ rừng ao và thực hành canh tác có ảnh hưởng đáng kể đến năng suất và thu nhập
                          </td>
                          <td className="border border-gray-200 px-4 py-2 text-gray-500">
                            Có thể trích dẫn nghiên cứu định lượng (IV regression / khảo sát hộ) để minh họa cơ chế tác động.
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    <em>Ghi chú:</em> Dòng +40% thu nhập đang giữ đúng theo nội dung bạn đưa. Nếu bạn muốn chứng cứ hóa con
                    số này, nên gắn với 1 báo cáo dự án hoặc bài nghiên cứu cụ thể (nêu rõ mẫu, địa bàn, giai đoạn) để
                    tránh hiểu sai/overclaim.
                  </p>
                </figure>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">4. Cơ chế tạo tác động (logic tác động)</h3>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">4.1. Cơ chế sinh thái - sản xuất</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Rừng ngập mặn cải thiện điều kiện môi trường ao/đầm, hỗ trợ hệ vi sinh và chuỗi thức ăn tự nhiên.</li>
                  <li>Giảm xói lở, giảm tổn thất do thời tiết cực đoan, góp phần ổn định sản xuất trong dài hạn.</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">4.2. Cơ chế thị trường - thu nhập</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Chứng nhận (ASC/ASC Group) + truy xuất nguồn gốc giúp tiếp cận thị trường khó tính và tăng giá trị sản phẩm.</li>
                  <li>Liên kết chuỗi với doanh nghiệp thu mua/chuỗi xuất khẩu có thể giảm biến động giá và rủi ro đầu ra.</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">4.3. Cơ chế thể chế - bảo tồn</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Yêu cầu về tỷ lệ che phủ rừng và quản trị vùng nuôi tạo động lực duy trì rừng.</li>
                  <li>Tuy vậy, nghiên cứu cũng ghi nhận tồn tại tình trạng không tuân thủ tỷ lệ rừng ao ở một bộ phận hộ nuôi, liên quan đến động cơ kinh tế và thực thi quy định.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">5. Đánh giá theo góc nhìn nghiên cứu</h3>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">5.1. Điểm mạnh</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Giải pháp dựa vào thiên nhiên (nature-based) vừa bảo tồn hệ sinh thái, vừa hỗ trợ sinh kế ven biển.</li>
                  <li>Khả năng tích hợp với các công cụ thị trường (chứng nhận, truy xuất, premium pricing).</li>
                  <li>Phù hợp định hướng thích ứng khí hậu, giảm rủi ro thiên tai vùng ven biển ĐBSCL.</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mt-4 mb-2">5.2. Thách thức</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Đo lường tác động thu nhập dễ bị nhiễu bởi mùa vụ, biến động giá, khác biệt kỹ thuật nuôi và quy mô ao/đầm.</li>
                  <li>Chi phí tuân thủ chứng nhận và năng lực tổ chức (HTX/tổ hợp tác) có thể là rào cản.</li>
                  <li>Thực thi quy định tỷ lệ rừng ao và giám sát vùng nuôi cần nguồn lực và dữ liệu tốt.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">6. Tài liệu tham khảo</h3>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>
                    VietnamPlus (2024). Thông tin về công bố chứng nhận ASC nhóm cho mô hình tôm rừng tại Cà Mau.
                    <span className="text-gray-500"> (bài viết tường thuật sự kiện &amp; phạm vi triển khai)</span>
                  </li>
                  <li>
                    VASEP/Seafood.VASEP (2025). Thông tin ngành về mở rộng chứng nhận nuôi tôm và mô hình tôm rừng (ASC Group) tại Cà Mau.
                  </li>
                  <li>
                    World Bank (2022/2023). Báo cáo về tư nhân tham gia hoạt động nuôi trồng thủy sản, đề cập hệ thống tôm rừng và các giới hạn năng suất/quy mô.
                  </li>
                  <li>
                    Anh, H.H. et al. (2024). Nghiên cứu định lượng về tỷ lệ rừng ao và tác động tới năng suất/thu nhập trong hệ thống tôm rừng tại Cà Mau (ScienceDirect).
                  </li>
                  <li>
                    SNV (2014). <em>Organic Shrimp Certification and Carbon Financing</em> - tổng quan về tôm rừng, chứng nhận và bối cảnh thể chế tại Cà Mau.
                  </li>
                </ol>
                <p className="text-sm text-gray-600 mt-3">
                  Nguồn tham khảo trên là các tài liệu công khai liên quan trực tiếp đến ASC/tôm rừng và nghiên cứu định lượng ở Cà Mau.
                  Nếu bạn muốn, mình có thể chuẩn hóa lại mục tài liệu tham khảo theo APA/Harvard (kèm link/DOI/ngày truy cập) cho đúng chuẩn xuất bản.
                </p>
              </div>
            </section>

            <footer className="text-sm text-gray-600 font-montserrat mt-8">
              <strong>Địa điểm:</strong> Cà Mau, Đồng bằng sông Cửu Long
            </footer>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
