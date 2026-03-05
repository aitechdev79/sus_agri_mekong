'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { usePathname } from 'next/navigation';
import { getLocaleFromPathname, pickLocalizedText, withLocalePrefix } from '@/lib/content-locale';

interface PolicyItem {
  id: string;
  title: string;
  titleEn?: string | null;
  description?: string | null;
  descriptionEn?: string | null;
}

interface PolicyResponse {
  contents: PolicyItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function PolicyPage() {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname);
  const contentDetailPrefix = withLocalePrefix('/content', locale);
  const [policies, setPolicies] = useState<PolicyItem[]>([]);
  const [loadingPolicies, setLoadingPolicies] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPolicies, setTotalPolicies] = useState(0);
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchPolicies = async () => {
      setLoadingPolicies(true);

      try {
        const params = new URLSearchParams({
          type: 'POLICY',
          page: currentPage.toString(),
          limit: itemsPerPage.toString(),
        });

        if (searchTerm) {
          params.append('search', searchTerm);
        }

        const response = await fetch(`/api/content?${params.toString()}`);
        if (!response.ok) return;

        const data: PolicyResponse = await response.json();
        setPolicies(data.contents);
        setTotalPages(data.pagination.pages);
        setTotalPolicies(data.pagination.total);
      } catch (error) {
        console.error('Failed to load policies:', error);
      } finally {
        setLoadingPolicies(false);
      }
    };

    fetchPolicies();
  }, [currentPage, searchTerm]);

  const internationalStandards = [
    {
      code: 'SA8000',
      name: 'Social Accountability International',
      description: 'Tiêu chuẩn quốc tế về trách nhiệm xã hội trong môi trường làm việc',
      areas: ['Lao động', 'Nhân quyền', 'An toàn'],
      href: 'https://sa-intl.org/wp-content/uploads/2020/01/SA8000Standard2014-VietnameseFinal1.pdf',
    },
    {
      code: 'BSCI',
      name: 'Business Social Compliance Initiative',
      description: 'Sáng kiến tuân thủ xã hội doanh nghiệp châu Âu',
      areas: ['Chuỗi cung ứng', 'Lao động', 'Đạo đức'],
      href: 'https://clv.vn/tieu-chuan-bsci-la-gi/',
    },
    {
      code: 'ASC',
      name: 'Aquaculture Stewardship Council',
      description: 'Tiêu chuẩn nuôi trồng thủy sản có trách nhiệm',
      areas: ['Thủy sản', 'Môi trường', 'Bền vững'],
      href: 'https://times.seafoodlegacy.com/vi/words/asc/',
    },
    {
      code: 'SRP',
      name: 'Sustainable Rice Platform',
      description: 'Nền tảng lúa gạo bền vững toàn cầu',
      areas: ['Nông nghiệp', 'Lúa gạo', 'Bền vững'],
      href: 'https://tiasang.com.vn/srp-bo-tieu-chuan-san-xuat-lua-gao-ben-vung-4967298.html',
    },
    {
      code: 'ISO 22000',
      name: 'Food Safety Management',
      description: 'Hệ thống quản lý an toàn thực phẩm',
      areas: ['An toàn thực phẩm', 'Chất lượng', 'Quản lý'],
      href: 'https://tqc.vn/iso-22000-la-gi-cac-yeu-cau-va-loi-ich-khi-chung-nhan-iso-22000-2018.htm',
    },
    {
      code: 'GRS',
      name: 'Global Reporting Initiative',
      description: 'Tiêu chuẩn báo cáo bền vững toàn cầu',
      areas: ['ESG', 'Báo cáo', 'Minh bạch'],
      href: 'https://tqc.vn/grs-la-gi.htm',
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

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCurrentPage(1);
    setSearchTerm(searchInput.trim());
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    const endPage = Math.min(totalPages, startPage + maxButtons - 1);

    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key="1"
          onClick={() => goToPage(1)}
          className="rounded border px-3 py-1 hover:bg-gray-100"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="dots-1" className="px-2">...</span>);
      }
    }

    for (let page = startPage; page <= endPage; page += 1) {
      buttons.push(
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`rounded border px-3 py-1 ${
            page === currentPage ? 'border-blue-600 bg-blue-600 text-white' : 'hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="dots-2" className="px-2">...</span>);
      }
      buttons.push(
        <button
          key="last"
          onClick={() => goToPage(totalPages)}
          className="rounded border px-3 py-1 hover:bg-gray-100"
        >
          Trang cuối
        </button>
      );
    }

    return buttons;
  };

  return (
    <div className="min-h-screen">
      <div className="relative z-50">
        <NavigationBar />
      </div>

      <main className="pt-16">
        <section className="relative w-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-20 text-white">
          <div className="absolute inset-0 opacity-10">
            <Image
              src="/vecteezy_topo_34242655.svg"
              alt="Background pattern"
              fill
              className="object-cover"
              priority={false}
            />
          </div>
          <div className="container relative z-10 mx-auto max-w-6xl px-6">
            <h1 className="mb-6 font-montserrat text-4xl font-bold md:text-5xl">
              Theo dõi Chính sách & Quy định
            </h1>
            <p className="max-w-4xl font-montserrat text-lg leading-relaxed text-blue-100 md:text-xl">
              Khám phá chuyên mục Theo dõi chính sách & quy định, nơi cập nhật những thay đổi pháp lý quan trọng
              trong lĩnh vực phát triển bền vững, báo cáo bền vững ESG, chuyển đổi xanh. Với tóm tắt ngắn gọn,
              bạn dễ dàng nắm bắt tác động chính sách và tiếp cận bối cảnh thực tiễn từ các nghiên cứu, tiêu chuẩn quốc tế.
            </p>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-montserrat text-3xl font-bold text-gray-800">
              Chính sách & Quy định nổi bật
                </h2>
                {!loadingPolicies && (
                  <p className="mt-2 font-montserrat text-sm text-gray-500">
                    Tìm thấy {totalPolicies} nội dung chính sách
                    {searchTerm ? ` cho "${searchTerm}"` : ''}
                  </p>
                )}
              </div>

              <form onSubmit={handleSearchSubmit} className="w-full md:w-[380px]">
                <div className="flex items-center justify-end gap-2">
                  <div className="relative w-full">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      value={searchInput}
                      onChange={(event) => setSearchInput(event.target.value)}
                      placeholder="Tìm kiếm policy..."
                      className="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-4 font-montserrat text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-2.5 font-montserrat text-sm font-semibold text-white hover:bg-blue-700"
                  >
                    Tìm
                  </button>
                </div>
              </form>
            </div>

            {loadingPolicies ? (
              <div className="overflow-hidden border border-gray-200">
                {[...Array(4)].map((_, index) => (
                  <div key={index} className="grid animate-pulse grid-cols-[80px_minmax(0,1fr)] border-b border-gray-200">
                    <div className="bg-gray-100 p-4" />
                    <div className="space-y-3 p-4">
                      <div className="h-5 bg-gray-200" />
                      <div className="h-4 w-5/6 bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            ) : policies.length === 0 ? (
              <div className="border border-gray-200 bg-gray-50 p-12 text-center text-gray-500">
                Chưa có nội dung chính sách nào.
              </div>
            ) : (
              <div>
                <div className="overflow-hidden border border-gray-200 bg-white">
                  <div className="grid grid-cols-[80px_minmax(0,1.1fr)_minmax(0,0.9fr)] border-b border-gray-200 bg-gray-50 font-montserrat text-sm font-semibold uppercase tracking-wide text-gray-600">
                    <div className="p-4 text-center">STT</div>
                    <div className="border-l border-gray-200 p-4">Tiêu đề</div>
                    <div className="border-l border-gray-200 p-4">Mô tả ngắn</div>
                  </div>

                  {policies.map((policy, index) => (
                    (() => {
                      const localizedTitle = pickLocalizedText(locale, policy.title, policy.titleEn);
                      const localizedDescription = pickLocalizedText(locale, policy.description, policy.descriptionEn);
                      return (
                    <Link
                      key={policy.id}
                      href={`${contentDetailPrefix}/${policy.id}`}
                      className="grid grid-cols-[80px_minmax(0,1.1fr)_minmax(0,0.9fr)] border-b border-gray-200 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-center p-4 font-montserrat text-sm text-gray-500">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </div>
                      <div className="border-l border-gray-200 p-4">
                        <h3 className="font-montserrat text-lg font-bold text-gray-900">
                          {localizedTitle}
                        </h3>
                      </div>
                      <div className="border-l border-gray-200 p-4">
                        <p className="font-montserrat text-sm italic leading-relaxed text-gray-600">
                          {localizedDescription || 'Chưa có mô tả ngắn.'}
                        </p>
                      </div>
                    </Link>
                      );
                    })()
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`rounded border p-2 ${
                          currentPage === 1 ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-100'
                        }`}
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>

                      {renderPaginationButtons()}

                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className={`rounded border p-2 ${
                          currentPage === totalPages ? 'cursor-not-allowed text-gray-400' : 'hover:bg-gray-100'
                        }`}
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="bg-gray-50 py-16">
          <div className="container mx-auto max-w-6xl px-6">
            <h2 className="mb-4 font-montserrat text-3xl font-bold text-gray-800">
              Tiêu chuẩn Quốc tế
            </h2>
            <p className="mb-8 font-montserrat text-lg text-gray-600">
              Các tiêu chuẩn quốc tế được áp dụng rộng rãi trong chuỗi giá trị bền vững
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {internationalStandards.map((standard) => (
                <a
                  key={standard.code}
                  href={standard.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-montserrat text-2xl font-bold text-blue-600">
                      {standard.code}
                    </h3>
                  </div>
                  <h4 className="mb-2 font-montserrat text-lg font-semibold text-gray-800">
                    {standard.name}
                  </h4>
                  <p className="mb-4 font-montserrat text-sm leading-relaxed text-gray-600">
                    {standard.description}
                  </p>
                </a>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container mx-auto max-w-6xl px-6">
            <h2 className="mb-8 text-center font-montserrat text-3xl font-bold text-gray-800">
              Ý kiến Chuyên gia
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {expertQuotes.map((item, index) => (
                <div
                  key={index}
                  className="rounded-lg border-l-4 border-blue-600 bg-gradient-to-br from-blue-50 to-white p-8 shadow-md"
                >
                  <div className="mb-4">
                    <svg
                      className="h-10 w-10 text-blue-600 opacity-50"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
                    </svg>
                  </div>
                  <p className="mb-6 font-montserrat text-lg italic leading-relaxed text-gray-700">
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

        <section className="bg-blue-900 py-12 text-white">
          <div className="container mx-auto max-w-6xl px-6 text-center">
            <h2 className="mb-4 font-montserrat text-3xl font-bold">
              Cần hỗ trợ về chính sách và quy định?
            </h2>
            <p className="mb-6 font-montserrat text-lg text-blue-100">
              Liên hệ với chúng tôi để được tư vấn chi tiết về các chính sách, quy định và tiêu chuẩn quốc tế
            </p>
            <button className="rounded-lg bg-white px-8 py-3 font-montserrat font-bold text-blue-900 transition-colors duration-200 hover:bg-blue-50">
              Liên hệ ngay
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
