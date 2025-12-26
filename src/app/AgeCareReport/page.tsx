'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

export default function AgeCareReportPage() {
  return (
    <div className="min-h-screen">
      <div className="relative z-50">
        <NavigationBar />
      </div>

      <main className="pt-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <section className="report-summary mx-auto py-10" lang="vi">
          <style>{`
            .report-summary { max-width: 980px; line-height: 1.65; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
            .report-summary h1 { font-size: 1.9rem; margin-bottom: 0.4em; }
            .report-summary h2 { font-size: 1.35rem; margin-top: 1.2em; }
            .report-summary p { margin: 0.6em 0; }
            .report-summary ul { margin: 0.4em 0 0.8em 1.2em; }
            .report-summary .meta { color: #6b7280; font-size: 0.95rem; }
            .report-summary .highlight {
              background: #f8fafc;
              border-left: 4px solid #2563eb;
              padding: 0.9em 1em;
              margin: 1em 0;
              border-radius: 8px;
            }
            .report-summary .grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
              gap: 1rem;
              margin-top: 0.8em;
            }
            .report-summary .card {
              border: 1px solid #e5e7eb;
              border-radius: 14px;
              padding: 0.9em 1em;
              background: #ffffff;
            }
            .report-summary .download-link {
              display: inline-flex;
              align-items: center;
              gap: 0.4rem;
              color: #2563eb;
              font-weight: 600;
              text-decoration: none;
            }
            .report-summary .download-link:hover {
              text-decoration: underline;
            }
          `}</style>

          <header>
            <h1>Thị trường các sản phẩm, dịch vụ chăm sóc người cao tuổi tại Việt Nam</h1>
            <p className="meta">
              Báo cáo nghiên cứu do VCCI-HCM phối hợp UNFPA thực hiện, với sự hỗ trợ của Chính phủ Nhật Bản (2021).
            </p>
            <p>
              <a
                className="download-link"
                href="/VN-VCCIHCM-Report-Market-Mapping-on-Elderly-Care.pdf"
                download
              >
                Tải báo cáo gốc (PDF)
              </a>
            </p>
          </header>

          <section>
            <h2>Bối cảnh và vấn đề đặt ra</h2>
            <p>
              Việt Nam đang bước vào giai đoạn <strong>già hóa dân số với tốc độ rất nhanh</strong>.
              Chỉ trong vòng 10 năm (2009–2019), số người từ 60 tuổi trở lên đã tăng hơn 5 triệu người,
              và dự báo đến năm 2038–2039, cứ 5 người dân thì có 1 người cao tuổi.
              Xu hướng này đặt ra áp lực lớn đối với hệ thống an sinh xã hội, y tế, và đặc biệt là
              <strong> hệ thống dịch vụ chăm sóc người cao tuổi</strong>.
            </p>
            <p>
              Trong khi đó, thị trường dịch vụ dành cho người cao tuổi tại Việt Nam hiện vẫn còn
              <strong> manh mún, thiếu hụt và chưa theo kịp nhu cầu ngày càng đa dạng</strong>, nhất là trong bối cảnh
              gia đình hạt nhân, di cư lao động và già hóa nhanh tại khu vực nông thôn.
            </p>
          </section>

          <section className="highlight">
            <p>
              <strong>Thông điệp chính của báo cáo:</strong><br />
              Già hóa dân số không chỉ là thách thức an sinh, mà còn là <strong>một thị trường dịch vụ đầy tiềm năng</strong>
              nếu có sự tham gia phù hợp, có trách nhiệm của khu vực tư nhân, cùng với khung chính sách hỗ trợ hiệu quả.
            </p>
          </section>

          <section>
            <h2>Nhu cầu nổi bật của người cao tuổi</h2>
            <div className="grid">
              <div className="card">
                <h3>Sức khỏe &amp; chăm sóc y tế</h3>
                <p>
                  Nhu cầu lớn nhất tập trung vào các bệnh không lây nhiễm (cao huyết áp, tim mạch, tiểu đường,
                  xương khớp), chăm sóc dài hạn và phục hồi chức năng. Khoảng 15% người cao tuổi cần hỗ trợ
                  trong sinh hoạt hằng ngày, nhưng hơn 1/4 trong số đó chưa nhận được dịch vụ phù hợp.
                </p>
              </div>

              <div className="card">
                <h3>Chăm sóc tại gia &amp; cộng đồng</h3>
                <p>
                  Xu hướng sống độc lập tăng lên, đặc biệt ở đô thị. Nhu cầu chăm sóc tại gia, hỗ trợ vận động,
                  tư vấn y tế, và kết nối cộng đồng ngày càng rõ nét, nhất là với nhóm cao lão (80+).
                </p>
              </div>

              <div className="card">
                <h3>Đời sống tinh thần &amp; xã hội</h3>
                <p>
                  Người cao tuổi có nhu cầu cao về giao tiếp, giảm cô đơn, tham gia câu lạc bộ, hoạt động văn hóa – xã hội,
                  và được tiếp tục cống hiến, làm việc phù hợp với khả năng.
                </p>
              </div>

              <div className="card">
                <h3>Tài chính &amp; an sinh</h3>
                <p>
                  Phần lớn người cao tuổi không có tích lũy đáng kể; thu nhập phụ thuộc nhiều vào con cháu.
                  Điều này ảnh hưởng trực tiếp đến khả năng chi trả cho các dịch vụ chăm sóc chất lượng.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2>Khoảng trống thị trường và cơ hội phát triển</h2>
            <p>
              Báo cáo chỉ ra sự <strong>mất cân đối rõ rệt giữa nhu cầu và khả năng cung ứng dịch vụ</strong>,
              đặc biệt tại khu vực nông thôn và với nhóm người cao tuổi thu nhập trung bình – thấp.
            </p>
            <ul>
              <li>Thiếu dịch vụ chăm sóc dài hạn và chăm sóc tại gia có chất lượng;</li>
              <li>Thiếu đội ngũ nhân lực được đào tạo bài bản về chăm sóc người cao tuổi;</li>
              <li>Thiếu mô hình dịch vụ tích hợp (y tế – xã hội – tinh thần – công nghệ);</li>
              <li>Thiếu cơ chế tài chính và chính sách đủ hấp dẫn để thu hút đầu tư tư nhân.</li>
            </ul>
          </section>

          <section>
            <h2>Định hướng và khuyến nghị</h2>
            <p>
              Trên cơ sở phân tích trong nước và tham khảo kinh nghiệm quốc tế (Nhật Bản, Hàn Quốc, châu Âu),
              báo cáo khuyến nghị:
            </p>
            <ul>
              <li>Phát triển các mô hình <strong>chăm sóc tại gia, chăm sóc cộng đồng</strong> kết hợp dịch vụ y tế;</li>
              <li>Khuyến khích khu vực tư nhân tham gia cung cấp dịch vụ chăm sóc người cao tuổi;</li>
              <li>Đẩy mạnh ứng dụng <strong>công nghệ thông tin và nền tảng số</strong> trong quản lý, kết nối dịch vụ;</li>
              <li>Đầu tư đào tạo nhân lực chăm sóc người cao tuổi theo hướng chuyên nghiệp;</li>
              <li>Xây dựng chính sách tài chính – an sinh hỗ trợ nhóm người cao tuổi dễ bị tổn thương.</li>
            </ul>
          </section>

          <footer className="meta">
            <p>
              Nguồn: Báo cáo “Thị trường các sản phẩm, dịch vụ chăm sóc người cao tuổi tại Việt Nam”, VCCI-HCM &amp; UNFPA, 2021.
            </p>
          </footer>
        </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
