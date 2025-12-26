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
              <h1>Quy?t ??nh 222/Q?-TTg (23/01/2025): K? ho?ch h?nh ??ng qu?c gia th?c hi?n kinh t? tu?n ho?n ??n n?m 2035</h1>
              <p className="meta">
                V?n b?n do Th? t??ng Ch?nh ph? ban h?nh, ??nh h??ng v? giao nhi?m v? tri?n khai kinh t? tu?n ho?n tr?n ph?m vi qu?c gia giai ?o?n 2025?2035.
              </p>
              <p>
                <a className="download-link" href="/222-ttg.signed.pdf" download>
                  T?i v?n b?n g?c (PDF)
                </a>
              </p>
            </header>

            <section className="callout">
              <p style={{ margin: 0 }}>
                <strong>Th?ng ?i?p ch?nh:</strong> Kinh t? tu?n ho?n ???c x?c ??nh l? h??ng ti?p c?n ?? n?ng cao n?ng su?t ? hi?u qu? s? d?ng t?i nguy?n,
                gi?m ph?t th?i v? r?i ro m?i tr??ng, ??ng th?i t?ng s?c c?nh tranh c?a n?n kinh t?; tri?n khai theo l? tr?nh, c? tr?ng t?m theo ng?nh/l?nh v?c,
                g?n ??i m?i s?ng t?o, chuy?n ??i s? v? th?c ??y th? tr??ng. <span className="muted">(Xem ph?n ?B?i c?nh/Quan ?i?m?)</span>
              </p>
            </section>

            <section>
              <h2>1) B?i c?nh v? quan ?i?m tri?n khai</h2>
              <div className="grid">
                <div className="card">
                  <h3>B?i c?nh</h3>
                  <p>
                    V?n b?n nh?n m?nh c?c th?ch th?c v? bi?n ??i kh? h?u, suy gi?m ?a d?ng sinh h?c, ? nhi?m v? c?n ki?t t?i nguy?n,
                    ??ng th?i n?u xu h??ng to?n c?u chuy?n d?ch sang m? h?nh t?ng tr??ng xanh ? ph?t th?i th?p v? y?u c?u th? tr??ng ng?y c?ng cao.
                  </p>
                </div>
                <div className="card">
                  <h3>Quan ?i?m</h3>
                  <ul>
                    <li>Tu?n ho?n l? ??ng l?c ??i m?i m? h?nh t?ng tr??ng; g?n v?i chuy?n ??i xanh v? m?c ti?u ph?t th?i r?ng b?ng ?0?.</li>
                    <li>Tri?n khai theo l? tr?nh, tr?ng t?m theo ng?nh/l?nh v?c v? theo chu?i gi? tr?.</li>
                    <li>Khuy?n kh?ch s?ng t?o, ??i m?i c?ng ngh? v? chuy?n ??i s?; t?ng ph?i h?p li?n ng?nh ? ??a ph??ng ? doanh nghi?p.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2>2) M?c ti?u ??n 2030 v? t?m nh?n 2035</h2>
              <p className="note">
                K? ho?ch ??t m?c ti?u th?c ??y m? h?nh kinh t? tu?n ho?n trong s?n xu?t ? kinh doanh ? ti?u d?ng; n?ng cao hi?u qu? s? d?ng t?i nguy?n;
                gi?m ch?t th?i, t?ng t?i ch?/t?i s? d?ng v? ph?t tri?n th? tr??ng li?n quan.
              </p>

              <table aria-label="M?c ti?u theo m?c th?i gian">
                <thead>
                  <tr>
                    <th style={{ width: '18%' }}>M?c</th>
                    <th>M?c ti?u tr?ng t?m (t?m l??c)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><strong>??n 2030</strong></td>
                    <td>
                      <ul style={{ margin: '0.2em 0 0.2em 1.2em' }}>
                        <li>N?ng cao hi?u qu? s? d?ng t?i nguy?n, ??c bi?t v?i n?ng l??ng v? c?c ngu?n t?i nguy?n quan tr?ng.</li>
                        <li>Th?c ??y ph?n lo?i ? thu gom ? x? l? ch?t th?i, t?ng t?i ch?/t?i s? d?ng; gi?m ch?t th?i ??a ?i ch?n l?p.</li>
                        <li>Khuy?n kh?ch m? h?nh tu?n ho?n t?i doanh nghi?p/chu?i ng?nh; h?nh th?nh th? tr??ng cho s?n ph?m ? d?ch v? tu?n ho?n.</li>
                      </ul>
                      <p className="muted" style={{ margin: '0.3em 0 0' }}>(V?n b?n c? n?u m?t s? ch? ti?u ??nh l??ng theo nh?m t?i nguy?n/ch?t th?i.)</p>
                    </td>
                  </tr>
                  <tr>
                    <td><strong>??n 2035</strong></td>
                    <td>
                      <ul style={{ margin: '0.2em 0 0.2em 1.2em' }}>
                        <li>Th?c h?nh tu?n ho?n tr? th?nh ph? bi?n h?n trong s?n xu?t v? ti?u d?ng; m? r?ng quy m? m? h?nh, chu?i gi? tr? tu?n ho?n.</li>
                        <li>T?ng c??ng n?ng l?c ??i m?i s?ng t?o, c?ng ngh? v? qu?n tr? ?? duy tr? hi?u qu? gi?m ph?t th?i ? gi?m ch?t th?i d?i h?n.</li>
                      </ul>
                    </td>
                  </tr>
                </tbody>
              </table>
            </section>

            <section>
              <h2>3) Nh?m nhi?m v? ? gi?i ph?p ch?nh</h2>
              <div className="grid">
                <div className="card">
                  <h3>(i) N?ng cao nh?n th?c &amp; tri th?c</h3>
                  <ul>
                    <li>Truy?n th?ng, ph? bi?n ki?n th?c, nh?n r?ng th?c h?nh t?t.</li>
                    <li>L?ng gh?p n?i dung kinh t? tu?n ho?n v?o gi?o d?c/??o t?o.</li>
                    <li>X?y d?ng ? v?n h?nh n?n t?ng/k?nh chia s? th?ng tin v? d? li?u ph?c v? ?p d?ng m? h?nh.</li>
                  </ul>
                </div>

                <div className="card">
                  <h3>(ii) Ho?n thi?n th? ch? ? ch?nh s?ch</h3>
                  <ul>
                    <li>X?y d?ng k? ho?ch/l? tr?nh theo ng?nh v? theo ??a ph??ng.</li>
                    <li>R? so?t, ho?n thi?n quy ??nh, ti?u chu?n/quy chu?n k? thu?t; c? ch? khuy?n kh?ch.</li>
                    <li>N?ng cao hi?u l?c qu?n l? ch?t th?i theo h??ng tu?n ho?n.</li>
                  </ul>
                </div>

                <div className="card">
                  <h3>(iii) Th?c ??y ?p d?ng trong s?n xu?t &amp; ti?u d?ng</h3>
                  <ul>
                    <li>H? tr? thi?t k? sinh th?i (eco-design) v? ??i m?i m? h?nh kinh doanh tu?n ho?n.</li>
                    <li>Ph?t tri?n th? tr??ng s?n ph?m/d?ch v? tu?n ho?n; mua s?m xanh.</li>
                    <li>Th?c ??y li?n k?t chu?i, h?p t?c c?ng?t?, c?m li?n k?t ng?nh.</li>
                  </ul>
                </div>

                <div className="card">
                  <h3>(iv) Khoa h?c?c?ng ngh? &amp; ??i m?i s?ng t?o</h3>
                  <ul>
                    <li>?u ti?n R&amp;D, chuy?n giao c?ng ngh? gi?m ph?t th?i, t?i ch?, v?t li?u m?i.</li>
                    <li>?ng d?ng chuy?n ??i s?, d? li?u ?? t?i ?u t?i nguy?n v? qu?n tr? d?ng v?t ch?t.</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2>4) Ng?nh/l?nh v?c ?u ti?n</h2>
              <p>
                K? ho?ch n?u c?c ng?nh/l?nh v?c tr?ng ?i?m c?n th?c ??y tu?n ho?n, bao g?m (t?m l??c): n?ng nghi?p &amp; th?y s?n; n?ng l??ng;
                khai kho?ng &amp; ch? bi?n kho?ng s?n; c?ng nghi?p ch? bi?n, ch? t?o; h?a ch?t; x?y d?ng; giao th?ng v?n t?i; d?ch v? v? du l?ch;
                qu?n l? ch?t th?i; ph?t tri?n khu ?? th?/khu c?ng nghi?p/c?m c?ng nghi?p?
                <span className="muted"> (Danh m?c c? th? n?m trong n?i dung k? ho?ch.)</span>
              </p>
            </section>

            <section>
              <h2>5) T? ch?c th?c hi?n, ngu?n l?c v? b?o c?o</h2>
              <ul>
                <li><strong>Ph?n c?ng nhi?m v?:</strong> B?, ng?nh trung ??ng v? UBND c?p t?nh x?y d?ng k? ho?ch th?c hi?n theo ch?c n?ng/nhi?m v?.</li>
                <li><strong>Ngu?n l?c:</strong> K?t h?p ng?n s?ch nh? n??c, v?n ODA/vay ?u ??i, v?n t? nh?n (t?n d?ng xanh, tr?i phi?u xanh, FDI?), v? ngu?n l?c c?ng ??ng/x? h?i h?a.</li>
                <li><strong>B?o c?o ? gi?m s?t:</strong> C? ch? ?? t?ng h?p, theo d?i v? b?o c?o ??nh k? v? ti?n ?? th?c hi?n c?c m?c ti?u, nhi?m v? c?a K? ho?ch.</li>
              </ul>
            </section>

            <footer className="meta">
              <p>
                Ngu?n: Quy?t ??nh s? 222/Q?-TTg ng?y 23/01/2025 c?a Th? t??ng Ch?nh ph? (K? ho?ch h?nh ??ng qu?c gia th?c hi?n kinh t? tu?n ho?n ??n n?m 2035).
              </p>
            </footer>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
