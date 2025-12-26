'use client';

import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';

export default function PolicyCircularEconomyPage() {
  return (
    <div className="min-h-screen">
      <div className="relative z-50">
        <NavigationBar />
      </div>

      <main className="pt-16">
        <div className="container mx-auto px-6 max-w-6xl">
          <section className="policy-brief mx-auto py-10" lang="vi">
            <style>{`
              .policy-brief { max-width: 980px; line-height: 1.65; font-family: system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif; }
              .policy-brief h1 { font-size: 1.85rem; margin: 0 0 0.4em; line-height: 1.25; }
              .policy-brief h2 { font-size: 1.25rem; margin: 1.1em 0 0.5em; border-top: 1px solid #e5e7eb; padding-top: 0.8em; }
              .policy-brief h3 { font-size: 1.05rem; margin: 0.9em 0 0.4em; }
              .policy-brief p { margin: 0.55em 0; }
              .policy-brief ul { margin: 0.35em 0 0.8em 1.2em; }
              .policy-brief .meta { color: #6b7280; font-size: 0.95rem; }
              .policy-brief .callout { background: #f8fafc; border-left: 4px solid #2563eb; padding: 0.9em 1em; border-radius: 10px; margin: 0.9em 0; }
              .policy-brief .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px,1fr)); gap: 0.9rem; margin-top: 0.6em; }
              .policy-brief .card { border: 1px solid #e5e7eb; border-radius: 14px; padding: 0.85em 1em; background: #fff; }
              .policy-brief table { width: 100%; border-collapse: collapse; margin: 0.6em 0 0.2em; }
              .policy-brief th, .policy-brief td { border: 1px solid #e5e7eb; padding: 0.55em; text-align: left; vertical-align: top; }
              .policy-brief th { background: #f9fafb; }
              .policy-brief .note { color: #374151; font-size: 0.95rem; }
              .policy-brief .muted { color: #6b7280; }
              .policy-brief .download-link {
                display: inline-flex;
                align-items: center;
                gap: 0.4rem;
                color: #2563eb;
                font-weight: 600;
                text-decoration: none;
              }
              .policy-brief .download-link:hover {
                text-decoration: underline;
              }
            `}</style>

            <header>
              <h1>Quyết định 222/QĐ-TTg (23/01/2025): Kế hoạch hành động quốc gia thực hiện kinh tế tuần hoàn đến năm 2035</h1>
              <p className="meta">
                Văn bản do Thủ tướng Chính phủ ban hành, định hướng và giao nhiệm vụ triển khai kinh tế tuần hoàn trên phạm vi quốc gia giai đoạn 2025–2035.
              </p>
              <p>
                <a className="download-link" href="/222-ttg.signed.pdf" download>
                  Tải văn bản gốc (PDF)
                </a>
              </p>
            </header>

            <section className="callout">
              <p style={{ margin: 0 }}>
                <strong>Thông điệp chính:</strong> Kinh tế tuần hoàn được xác định là hướng tiếp cận để nâng cao năng suất – hiệu quả sử dụng tài nguyên,
                giảm phát thải và rủi ro môi trường, đồng thời tăng sức cạnh tranh của nền kinh tế; triển khai theo lộ trình, có trọng tâm theo ngành/lĩnh vực,
                gắn đổi mới sáng tạo, chuyển đổi số và thúc đẩy thị trường. <span className="muted">(Xem phần “Bối cảnh/Quan điểm”)</span>
              </p>
            </section>

            <section>
              <h2>1) Bối cảnh và quan điểm triển khai</h2>
              <div className="grid">
                <div className="card">
                  <h3>Bối cảnh</h3>
                  <p>
                    Văn bản nhấn mạnh các thách thức về biến đổi khí hậu, suy giảm đa dạng sinh học, ô nhiễm và cạn kiệt tài nguyên,
                    đồng thời nêu xu hướng toàn cầu chuyển dịch sang mô hình tăng trưởng xanh – phát thải thấp và yêu cầu thị trường ngày càng cao.
                  </p>
                </div>
                <div className="card">
                  <h3>Quan điểm</h3>
                  <ul>
                    <li>Tuần hoàn là động lực đổi mới mô hình tăng trưởng; gắn với chuyển đổi xanh và mục tiêu phát thải ròng bằng “0”.</li>
                    <li>Triển khai theo lộ trình, trọng tâm theo ngành/lĩnh vực và theo chuỗi giá trị.</li>
                    <li>Khuyến khích sáng tạo, đổi mới công nghệ và chuyển đổi số; tăng phối hợp liên ngành – địa phương – doanh nghiệp.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2>2) Mục tiêu đến 2030 và tầm nhìn 2035</h2>
              <p className="note">
                Kế hoạch đặt mục tiêu thúc đẩy mô hình kinh tế tuần hoàn trong sản xuất – kinh doanh – tiêu dùng; nâng cao hiệu quả sử dụng tài nguyên;
                giảm chất thải, tăng tái chế/tái sử dụng và phát triển thị trường liên quan.
              </p>

              <table aria-label="Mục tiêu theo mốc thời gian">
                <thead>
                  <tr>
                    <th style={{ width: '18%' }}>Mốc</th>
                    <th>Mục tiêu trọng tâm (tóm lược)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>Đến 2030</strong></td>
                    <td>
                      <ul style={{ margin: '0.2em 0 0.2em 1.2em' }}>
                        <li>Nâng cao hiệu quả sử dụng tài nguyên, đặc biệt với năng lượng và các nguồn tài nguyên quan trọng.</li>
                        <li>Thúc đẩy phân loại – thu gom – xử lý chất thải, tăng tái chế/tái sử dụng; giảm chất thải đưa đi chôn lấp.</li>
                        <li>Khuyến khích mô hình tuần hoàn tại doanh nghiệp/chuỗi ngành; hình thành thị trường cho sản phẩm – dịch vụ tuần hoàn.</li>
                      </ul>
                      <p className="muted" style={{ margin: '0.3em 0 0' }}>(Văn bản có nêu một số chỉ tiêu định lượng theo nhóm tài nguyên/chất thải.)</p>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>Đến 2035</strong></td>
                    <td>
                      <ul style={{ margin: '0.2em 0 0.2em 1.2em' }}>
                        <li>Thực hành tuần hoàn trở thành phổ biến hơn trong sản xuất và tiêu dùng; mở rộng quy mô mô hình, chuỗi giá trị tuần hoàn.</li>
                        <li>Tăng cường năng lực đổi mới sáng tạo, công nghệ và quản trị để duy trì hiệu quả giảm phát thải – giảm chất thải dài hạn.</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h2>3) Nhóm nhiệm vụ – giải pháp chính</h2>
              <div className="grid">
                <div className="card">
                  <h3>(i) Nâng cao nhận thức &amp; tri thức</h3>
                  <ul>
                    <li>Truyền thông, phổ biến kiến thức, nhân rộng thực hành tốt.</li>
                    <li>Lồng ghép nội dung kinh tế tuần hoàn vào giáo dục/đào tạo.</li>
                    <li>Xây dựng – vận hành nền tảng/kênh chia sẻ thông tin và dữ liệu phục vụ áp dụng mô hình.</li>
                  </ul>
                </div>

                <div className="card">
                  <h3>(ii) Hoàn thiện thể chế – chính sách</h3>
                  <ul>
                    <li>Xây dựng kế hoạch/lộ trình theo ngành và theo địa phương.</li>
                    <li>Rà soát, hoàn thiện quy định, tiêu chuẩn/quy chuẩn kỹ thuật; cơ chế khuyến khích.</li>
                    <li>Nâng cao hiệu lực quản lý chất thải theo hướng tuần hoàn.</li>
                  </ul>
                </div>

                <div className="card">
                  <h3>(iii) Thúc đẩy áp dụng trong sản xuất &amp; tiêu dùng</h3>
                  <ul>
                    <li>Hỗ trợ thiết kế sinh thái (eco-design) và đổi mới mô hình kinh doanh tuần hoàn.</li>
                    <li>Phát triển thị trường sản phẩm/dịch vụ tuần hoàn; mua sắm xanh.</li>
                    <li>Thúc đẩy liên kết chuỗi, hợp tác công–tư, cụm liên kết ngành.</li>
                  </ul>
                </div>

                <div className="card">
                  <h3>(iv) Khoa học–công nghệ &amp; đổi mới sáng tạo</h3>
                  <ul>
                    <li>Ưu tiên R&amp;D, chuyển giao công nghệ giảm phát thải, tái chế, vật liệu mới.</li>
                    <li>Ứng dụng chuyển đổi số, dữ liệu để tối ưu tài nguyên và quản trị dòng vật chất.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2>4) Ngành/lĩnh vực ưu tiên</h2>
              <p>
                Kế hoạch nêu các ngành/lĩnh vực trọng điểm cần thúc đẩy tuần hoàn, bao gồm (tóm lược): nông nghiệp &amp; thủy sản; năng lượng;
                khai khoáng &amp; chế biến khoáng sản; công nghiệp chế biến, chế tạo; hóa chất; xây dựng; giao thông vận tải; dịch vụ và du lịch;
                quản lý chất thải; phát triển khu đô thị/khu công nghiệp/cụm công nghiệp…
                <span className="muted"> (Danh mục cụ thể nằm trong nội dung kế hoạch.)</span>
              </p>
            </section>

            <section>
              <h2>5) Tổ chức thực hiện, nguồn lực và báo cáo</h2>
              <ul>
                <li><strong>Phân công nhiệm vụ:</strong> Bộ, ngành trung ương và UBND cấp tỉnh xây dựng kế hoạch thực hiện theo chức năng/nhiệm vụ.</li>
                <li><strong>Nguồn lực:</strong> Kết hợp ngân sách nhà nước, vốn ODA/vay ưu đãi, vốn tư nhân (tín dụng xanh, trái phiếu xanh, FDI…), và nguồn lực cộng đồng/xã hội hóa.</li>
                <li><strong>Báo cáo – giám sát:</strong> Có chế độ tổng hợp, theo dõi và báo cáo định kỳ về tiến độ thực hiện các mục tiêu, nhiệm vụ của Kế hoạch.</li>
              </ul>
            </section>

            <footer className="meta">
              <p>
                Nguồn: Quyết định số 222/QĐ-TTg ngày 23/01/2025 của Thủ tướng Chính phủ (Kế hoạch hành động quốc gia thực hiện kinh tế tuần hoàn đến năm 2035).
              </p>
            </footer>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
