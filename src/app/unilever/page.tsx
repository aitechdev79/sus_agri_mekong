'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';

export default function UnileverPage() {
  return (
    <div className="min-h-screen">
      <div className="relative z-50">
        <NavigationBar />
      </div>

      <main className="pt-16">
        <section className="relative w-full h-[400px] md:h-[500px]">
          <Image
            src="/esg_hero.jpg"
            alt="Global Best Practices Hero Banner"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </section>

        <section className="py-16 bg-white">
          <div className="container mx-auto px-6 max-w-4xl">
            <header className="mb-8">
              <h1 className="font-montserrat font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                Thực hành tốt trên thế giới: Trường hợp Unilever - Kế hoạch Sống Bền vững
              </h1>
              <div className="flex flex-wrap gap-2 mb-4" aria-label="Chủ đề">
                <span className="px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full text-sm font-semibold">
                  Giảm carbon
                </span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full text-sm font-semibold">
                  Chuỗi cung ứng bền vững
                </span>
                <span className="px-3 py-1 bg-indigo-50 text-indigo-800 rounded-full text-sm font-semibold">
                  Trách nhiệm xã hội
                </span>
              </div>
              <p className="text-sm text-gray-600 font-montserrat">
                Tài liệu tóm lược theo hướng học thuật - thực tiễn, phục vụ mục đích tham khảo, giảng dạy và xây dựng
                nội dung ESG.
              </p>
            </header>

            <section className="space-y-6 text-gray-700 font-montserrat leading-relaxed">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">1. Giới thiệu chung</h2>
                <p>
                  Unilever là tập đoàn hàng tiêu dùng nhanh (FMCG) hoạt động toàn cầu với danh mục thương hiệu lớn.
                  Nhằm ứng phó các thách thức như biến đổi khí hậu, suy giảm tài nguyên và bất bình đẳng xã hội, Unilever
                  triển khai <strong>Unilever Sustainable Living Plan (USLP)</strong> từ năm 2010, sau đó nâng cấp thành
                  <strong> Unilever Compass</strong> từ năm 2021.
                </p>
                <p>
                  Mục tiêu trung tâm là <strong>tách rời tăng trưởng kinh doanh khỏi tác động tiêu cực đến môi trường</strong>,
                  đồng thời <strong>tăng tác động xã hội tích cực</strong> đối với sức khỏe, sinh kế và phúc lợi con người.
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">2. Mục tiêu và cam kết chính</h2>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">2.1. Mục tiêu môi trường</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Giảm <strong>50% tác động môi trường</strong> của sản phẩm vào năm <strong>2030</strong> (tùy chỉ tiêu có đường cơ sở khác nhau).</li>
                  <li>Hướng tới <strong>Net Zero</strong>: Scope 1-2 (2030) và Scope 3 (2039).</li>
                  <li>100% bao bì nhựa có thể <strong>tái sử dụng, tái chế hoặc phân hủy sinh học</strong>.</li>
                  <li>Giảm một nửa lượng <strong>nhựa nguyên sinh</strong> sử dụng.</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">2.2. Mục tiêu xã hội</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Cải thiện <strong>sức khỏe và phúc lợi cho hơn 1 tỷ người</strong> thông qua các chương trình vệ sinh, dinh dưỡng và hành vi.</li>
                  <li>Thúc đẩy <strong>living wage</strong> cho nhân viên và <strong>living income</strong> trong chuỗi cung ứng.</li>
                  <li>Tăng cường bình đẳng giới, an toàn lao động và quyền con người trong toàn bộ chuỗi giá trị.</li>
                </ul>

                <div className="bg-slate-50 border-l-4 border-blue-300 p-4 mt-4">
                  <strong>Gợi ý triển khai nội bộ (best practice):</strong> Nên gắn KPI bền vững với mục tiêu kinh doanh,
                  có baseline rõ ràng, và cơ chế đo lường/báo cáo định kỳ (ESG disclosure).
                </div>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">3. Trụ cột triển khai</h2>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">3.1. Giảm phát thải carbon và tác động môi trường</h3>
                <p>
                  Unilever áp dụng cách tiếp cận <strong>đánh giá vòng đời sản phẩm (Life Cycle Assessment - LCA)</strong>,
                  bao gồm: khai thác nguyên liệu, sản xuất, phân phối, giai đoạn sử dụng và xử lý sau sử dụng.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Tăng sử dụng điện tái tạo trong vận hành nhà máy.</li>
                  <li>Cải tiến công thức sản phẩm để giảm năng lượng trong giai đoạn sử dụng (ví dụ: giặt nước lạnh).</li>
                  <li>Thiết kế bao bì nhẹ hơn và tăng tỷ lệ vật liệu tái chế.</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">3.2. Chuỗi cung ứng bền vững</h3>
                <p>
                  Triển khai chính sách mua hàng có trách nhiệm (ví dụ: <em>Responsible Sourcing Policy</em>) cho nhà cung
                  cấp, tập trung vào nông nghiệp bền vững, không phá rừng, bảo tồn đa dạng sinh học và điều kiện lao động công bằng.
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Khuyến khích chứng nhận/tiêu chuẩn bền vững (ví dụ: Rainforest Alliance, RSPO, Fairtrade).</li>
                  <li>Tăng minh bạch và truy xuất nguồn gốc nguyên liệu.</li>
                  <li>Giám sát rủi ro ESG trong chuỗi cung ứng (lao động, an toàn, môi trường).</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">3.3. Trách nhiệm xã hội và cộng đồng</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Chương trình vệ sinh (ví dụ: rửa tay với xà phòng) nhằm giảm bệnh truyền nhiễm tại nhiều quốc gia.</li>
                  <li>Trao quyền kinh tế cho phụ nữ thông qua các mô hình phân phối/kinh doanh vi mô (ví dụ: tại Ấn Độ).</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">4. Kết quả và số liệu minh họa</h2>
                <figure>
                  <figcaption className="text-sm text-gray-600 mb-2">
                    <strong>Bảng 1.</strong> Một số kết quả nổi bật (tổng hợp theo báo cáo bền vững của Unilever)
                  </figcaption>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-gray-200 text-sm">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-2 text-left">Chỉ tiêu</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Kết quả minh họa (đến 2023)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2">Giảm phát thải CO2 từ vận hành nội bộ</td>
                          <td className="border border-gray-200 px-4 py-2">~64% so với 2015 <span className="text-gray-500">(mức minh họa theo báo cáo tiến độ)</span></td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2">Tỷ lệ điện tái tạo trong sản xuất</td>
                          <td className="border border-gray-200 px-4 py-2">~100% tại nhiều đơn vị/địa bàn vận hành</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2">Bao bì nhựa có thể tái chế/tái sử dụng</td>
                          <td className="border border-gray-200 px-4 py-2">&gt;70% <span className="text-gray-500">(tùy định nghĩa và phạm vi báo cáo)</span></td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2">Người hưởng lợi từ chương trình sức khỏe &amp; vệ sinh</td>
                          <td className="border border-gray-200 px-4 py-2">&gt;1,3 tỷ người (lũy kế)</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-200 px-4 py-2">Nguyên liệu nông nghiệp bền vững</td>
                          <td className="border border-gray-200 px-4 py-2">~79% <span className="text-gray-500">(tỷ trọng theo các tiêu chí/chuẩn bền vững được công bố)</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">
                    <em>Lưu ý:</em> Con số có thể khác nhau theo năm báo cáo, phạm vi (scope), phương pháp luận và định nghĩa chỉ tiêu.
                    Khi xuất bản chính thức, nên thay bằng số liệu exact quote kèm đường dẫn/DOI hoặc trang báo cáo tương ứng.
                  </p>
                </figure>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">5. Đánh giá học thuật và thực tiễn</h2>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">5.1. Đóng góp tích cực</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>USLP thường được xem là một mô hình ESG doanh nghiệp đa quốc gia mang tính tiên phong, tích hợp vào chiến lược tăng trưởng.</li>
                  <li>Cách tiếp cận LCA/Scope 3 cho phép can thiệp sâu vào giai đoạn sử dụng của người tiêu dùng nơi thường chiếm tỷ trọng tác động đáng kể.</li>
                  <li>Tạo đòn bẩy lan tỏa chuẩn mực ESG tới nhà cung cấp và đối tác trong chuỗi cung ứng.</li>
                </ul>

                <h3 className="text-lg font-semibold text-gray-900 mt-4 mb-2">5.2. Thách thức và phê bình</h3>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Scope 3 khó kiểm soát do phụ thuộc vào hành vi người tiêu dùng và cấu trúc chuỗi cung ứng toàn cầu.</li>
                  <li>Mục tiêu giảm tác động có thể bị đánh giá là chưa đủ tham vọng nếu đối chiếu các kịch bản 1,5C (tùy quan điểm nghiên cứu).</li>
                  <li>Rủi ro truyền thông vượt kết quả thực tế (greenwashing) nếu thiếu minh bạch phương pháp đo lường và kiểm chứng độc lập.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">6. Bài học rút ra cho doanh nghiệp và nhà hoạch định chính sách</h2>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Tích hợp bền vững vào mô hình kinh doanh cốt lõi; tránh tách rời thành hoạt động CSR bên lề.</li>
                  <li>Thiết kế mục tiêu định lượng, có mốc thời gian, baseline và cơ chế đo lường/đảm bảo chất lượng dữ liệu.</li>
                  <li>Phối hợp chặt chẽ giữa doanh nghiệp - nhà cung cấp - người tiêu dùng - nhà nước để mở rộng tác động hệ thống.</li>
                  <li>Ưu tiên các can thiệp có hiệu quả cao: năng lượng tái tạo, thiết kế bao bì tuần hoàn, và đổi mới công thức sản phẩm giảm phát thải.</li>
                </ul>
                <p>
                  Với bối cảnh Việt Nam, mô hình Unilever gợi ý vai trò của doanh nghiệp lớn trong việc dẫn dắt chuỗi cung ứng xanh,
                  thúc đẩy đổi mới công nghệ sạch và đóng góp vào các mục tiêu phát triển bền vững (SDGs).
                </p>
              </div>

              <div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">7. Tài liệu tham khảo</h2>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>Unilever. (2023). <em>Unilever Sustainability Progress Report</em>.</li>
                  <li>Unilever. (2021). <em>The Unilever Compass: Strategy for Sustainable Growth</em>.</li>
                  <li>Porter, M. E., &amp; Kramer, M. R. (2011). Creating Shared Value. <em>Harvard Business Review</em>, 89(12), 62-77.</li>
                  <li>Bansal, P., &amp; DesJardine, M. R. (2014). Business sustainability: It is about time. <em>Strategic Organization</em>, 12(1), 70-78.</li>
                  <li>United Nations. (2015). <em>Transforming our world: the 2030 Agenda for Sustainable Development</em>.</li>
                </ol>
                <p className="text-sm text-gray-600 mt-3">
                  Gợi ý: Nếu bạn cần chuẩn APA/Harvard hoàn chỉnh (kèm URL/DOI và ngày truy cập), mình có thể chuẩn hóa lại danh mục theo đúng style bạn dùng.
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
