import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Search } from 'lucide-react';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { pickLocalizedText, withLocalePrefix } from '@/lib/content-locale';
import { getPublicPoliciesPage } from '@/lib/public-content-list';

export const revalidate = 60;

interface PageProps {
  params?: Promise<{ locale?: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

function getParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function pageHref(page: number, searchTerm: string, locale: string) {
  const path = withLocalePrefix('/policy', locale);
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (searchTerm) params.set('search', searchTerm);
  const query = params.toString();
  return query ? `${path}?${query}` : path;
}

export default async function PolicyPage({ params, searchParams }: PageProps) {
  const routeParams = await params;
  const queryParams = await searchParams;
  const locale = routeParams?.locale === 'en' ? 'en' : 'vi';
  const isEn = locale === 'en';
  const contentDetailPrefix = withLocalePrefix('/content', locale);
  const currentPage = Math.max(1, Number(getParam(queryParams?.page) || '1') || 1);
  const searchTerm = (getParam(queryParams?.search) || '').trim();
  const itemsPerPage = 10;

  const { contents: policies, pagination } = await getPublicPoliciesPage(currentPage, itemsPerPage, searchTerm).catch((error) => {
    console.error('Failed to preload policies:', error);
    return { contents: [], pagination: { page: 1, limit: itemsPerPage, total: 0, pages: 1 } };
  });

  const internationalStandards = [
    {
      code: 'SA8000',
      name: 'Social Accountability International',
      description: isEn ? 'International social accountability standard for workplaces' : 'Tiêu chuẩn quốc tế về trách nhiệm xã hội trong môi trường làm việc',
      href: 'https://sa-intl.org/wp-content/uploads/2020/01/SA8000Standard2014-VietnameseFinal1.pdf',
    },
    {
      code: 'BSCI',
      name: 'Business Social Compliance Initiative',
      description: isEn ? 'European social compliance initiative for business supply chains' : 'Sáng kiến tuân thủ xã hội doanh nghiệp châu Âu',
      href: 'https://clv.vn/tieu-chuan-bsci-la-gi/',
    },
    {
      code: 'ASC',
      name: 'Aquaculture Stewardship Council',
      description: isEn ? 'Responsible aquaculture standard' : 'Tiêu chuẩn nuôi trồng thủy sản có trách nhiệm',
      href: 'https://times.seafoodlegacy.com/vi/words/asc/',
    },
    {
      code: 'SRP',
      name: 'Sustainable Rice Platform',
      description: isEn ? 'Global platform for sustainable rice production' : 'Nền tảng lúa gạo bền vững toàn cầu',
      href: 'https://tiasang.com.vn/srp-bo-tieu-chuan-san-xuat-lua-gao-ben-vung-4967298.html',
    },
    {
      code: 'ISO 22000',
      name: 'Food Safety Management',
      description: isEn ? 'Food safety management system standard' : 'Hệ thống quản lý an toàn thực phẩm',
      href: 'https://tqc.vn/iso-22000-la-gi-cac-yeu-cau-va-loi-ich-khi-chung-nhan-iso-22000-2018.htm',
    },
    {
      code: 'GRS',
      name: 'Global Reporting Initiative',
      description: isEn ? 'Global sustainability reporting framework' : 'Tiêu chuẩn báo cáo bền vững toàn cầu',
      href: 'https://tqc.vn/grs-la-gi.htm',
    },
  ];

  const pageNumbers = Array.from({ length: pagination.pages }, (_, index) => index + 1).slice(
    Math.max(0, pagination.page - 3),
    Math.max(5, pagination.page + 2)
  );

  return (
    <div className="min-h-screen">
      <div className="relative z-50">
        <NavigationBar />
      </div>

      <main className="pt-16">
        <section className="relative w-full bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 py-20 text-white">
          <div className="absolute inset-0 opacity-10">
            <Image src="/vecteezy_topo_34242655.svg" alt="Background pattern" fill className="object-cover" priority={false} />
          </div>
          <div className="container relative z-10 mx-auto max-w-6xl px-6">
            <h1 className="mb-6 font-montserrat text-4xl font-bold md:text-5xl">
              {isEn ? 'Policy & Regulation Watch' : 'Theo dõi Chính sách & Quy định'}
            </h1>
            <p className="max-w-4xl font-montserrat text-lg leading-relaxed text-blue-100 md:text-xl">
              {isEn
                ? 'Track key legal and compliance updates across sustainability, ESG reporting, and green transition.'
                : 'Cập nhật những thay đổi pháp lý quan trọng trong phát triển bền vững, báo cáo ESG và chuyển đổi xanh.'}
            </p>
          </div>
        </section>

        <section className="bg-white py-12">
          <div className="container mx-auto max-w-6xl px-6">
            <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <h2 className="font-montserrat text-3xl font-bold text-gray-800">
                  {isEn ? 'Featured Policies & Regulations' : 'Chính sách & Quy định nổi bật'}
                </h2>
                <p className="mt-2 font-montserrat text-sm text-gray-500">
                  {isEn ? `Found ${pagination.total} policy items` : `Tìm thấy ${pagination.total} nội dung chính sách`}
                  {searchTerm ? (isEn ? ` for "${searchTerm}"` : ` cho "${searchTerm}"`) : ''}
                </p>
              </div>

              <form action={withLocalePrefix('/policy', locale)} className="w-full md:w-[380px]">
                <div className="flex items-center justify-end gap-2">
                  <div className="relative w-full">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      name="search"
                      defaultValue={searchTerm}
                      placeholder={isEn ? 'Search policy...' : 'Tìm kiếm policy...'}
                      className="w-full rounded-md border border-gray-300 py-2.5 pl-10 pr-4 font-montserrat text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                  <button type="submit" className="rounded-md bg-blue-600 px-4 py-2.5 font-montserrat text-sm font-semibold text-white hover:bg-blue-700">
                    {isEn ? 'Search' : 'Tìm'}
                  </button>
                </div>
              </form>
            </div>

            {policies.length === 0 ? (
              <div className="border border-gray-200 bg-gray-50 p-12 text-center text-gray-500">
                {isEn ? 'No policy content available yet.' : 'Chưa có nội dung chính sách nào.'}
              </div>
            ) : (
              <div>
                <div className="overflow-hidden border border-gray-200 bg-white">
                  <div className="grid grid-cols-[80px_minmax(0,0.55fr)_minmax(0,1.45fr)] border-b border-gray-200 bg-gray-50 font-montserrat text-sm font-semibold uppercase tracking-wide text-gray-600">
                    <div className="p-4 text-center">STT</div>
                    <div className="border-l border-gray-200 p-4">{isEn ? 'Title' : 'Tiêu đề'}</div>
                    <div className="border-l border-gray-200 p-4">{isEn ? 'Description' : 'Mô tả'}</div>
                  </div>

                  {policies.map((policy, index) => {
                    const localizedTitle = pickLocalizedText(locale, policy.title, policy.titleEn);
                    const localizedDescription = pickLocalizedText(locale, policy.description, policy.descriptionEn);
                    return (
                      <Link key={policy.id} href={`${contentDetailPrefix}/${policy.id}`} className="grid grid-cols-[80px_minmax(0,0.55fr)_minmax(0,1.45fr)] border-b border-gray-200 transition-colors hover:bg-gray-50">
                        <div className="flex items-center justify-center p-4 font-montserrat text-sm text-gray-500">
                          {(pagination.page - 1) * itemsPerPage + index + 1}
                        </div>
                        <div className="border-l border-gray-200 p-4">
                          <h3 className="font-montserrat text-lg font-bold text-gray-900">{localizedTitle}</h3>
                        </div>
                        <div className="border-l border-gray-200 p-4">
                          <p className="font-montserrat text-sm italic leading-relaxed text-gray-600">
                            {localizedDescription || (isEn ? 'No short description.' : 'Chưa có mô tả ngắn.')}
                          </p>
                        </div>
                      </Link>
                    );
                  })}
                </div>

                {pagination.pages > 1 && (
                  <div className="mt-8 flex justify-center">
                    <div className="flex items-center space-x-2">
                      <Link href={pageHref(Math.max(1, pagination.page - 1), searchTerm, locale)} className={`rounded border p-2 ${pagination.page === 1 ? 'pointer-events-none text-gray-400' : 'hover:bg-gray-100'}`}>
                        <ChevronLeft className="h-5 w-5" />
                      </Link>
                      {pageNumbers.map((page) => (
                        <Link key={page} href={pageHref(page, searchTerm, locale)} className={`rounded border px-3 py-1 ${page === pagination.page ? 'border-blue-600 bg-blue-600 text-white' : 'hover:bg-gray-100'}`}>
                          {page}
                        </Link>
                      ))}
                      <Link href={pageHref(Math.min(pagination.pages, pagination.page + 1), searchTerm, locale)} className={`rounded border p-2 ${pagination.page === pagination.pages ? 'pointer-events-none text-gray-400' : 'hover:bg-gray-100'}`}>
                        <ChevronRight className="h-5 w-5" />
                      </Link>
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
              {isEn ? 'International Standards' : 'Tiêu chuẩn Quốc tế'}
            </h2>
            <p className="mb-8 font-montserrat text-lg text-gray-600">
              {isEn ? 'International standards widely applied in sustainable value chains' : 'Các tiêu chuẩn quốc tế được áp dụng rộng rãi trong chuỗi giá trị bền vững'}
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {internationalStandards.map((standard) => (
                <a key={standard.code} href={standard.href} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
                  <h3 className="mb-4 font-montserrat text-2xl font-bold text-blue-600">{standard.code}</h3>
                  <h4 className="mb-2 font-montserrat text-lg font-semibold text-gray-800">{standard.name}</h4>
                  <p className="font-montserrat text-sm leading-relaxed text-gray-600">{standard.description}</p>
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
