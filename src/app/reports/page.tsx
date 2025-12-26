'use client';

import { useState } from 'react';
import Link from 'next/link';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import Image from 'next/image';
import {
  BarChart3,
  Bookmark,
  BookOpen,
  Building2,
  Calendar,
  Download,
  FileSignature,
  Files,
  FileText,
  Globe2,
  Handshake,
  Inbox,
  Leaf,
  Library,
  LineChart,
  Link2,
  Landmark,
  Microscope,
  Search,
  ShieldCheck,
  Tag,
  Target,
  Users,
  Wheat,
} from 'lucide-react';

type ReportCategory = 'all' | 'esg' | 'agriculture' | 'climate' | 'supply-chain' | 'policy' | 'labor-safety' | 'responsible-business';
type ReportType = 'all' | 'research' | 'policy-brief' | 'case-study' | 'survey' | 'whitepaper';

interface Report {
  id: string;
  title: string;
  description: string;
  category: ReportCategory;
  type: ReportType;
  author: string;
  organization: string;
  publishDate: string;
  pages: number;
  downloads: number;
  tags: string[];
  fileSize: string;
  language: 'vi' | 'en' | 'both';
  thumbnail: string;
  link?: string;
}

export default function ReportsPage() {
  const [selectedCategory, setSelectedCategory] = useState<ReportCategory>('all');
  const [selectedType, setSelectedType] = useState<ReportType>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all' as ReportCategory, name: 'Tất cả', icon: <Library className="w-4 h-4" /> },
    { id: 'labor-safety' as ReportCategory, name: 'An toàn vệ sinh lao động', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'esg' as ReportCategory, name: 'ESG & Bền vững', icon: <Leaf className="w-4 h-4" /> },
    { id: 'policy' as ReportCategory, name: 'Chính sách ngành', icon: <FileText className="w-4 h-4" /> },
    { id: 'responsible-business' as ReportCategory, name: 'Kinh doanh có trách nhiệm', icon: <Handshake className="w-4 h-4" /> },
    { id: 'agriculture' as ReportCategory, name: 'Nông nghiệp', icon: <Wheat className="w-4 h-4" /> },
    { id: 'climate' as ReportCategory, name: 'Biến đổi khí hậu', icon: <Globe2 className="w-4 h-4" /> },
    { id: 'supply-chain' as ReportCategory, name: 'Chuỗi cung ứng', icon: <Link2 className="w-4 h-4" /> },
  ];

  const reportTypes = [
    { id: 'all' as ReportType, name: 'Tất cả loại', icon: <Files className="w-4 h-4" /> },
    { id: 'research' as ReportType, name: 'Nghiên cứu', icon: <Microscope className="w-4 h-4" /> },
    { id: 'policy-brief' as ReportType, name: 'Tóm tắt chính sách', icon: <FileSignature className="w-4 h-4" /> },
    { id: 'case-study' as ReportType, name: 'Nghiên cứu điển hình', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'survey' as ReportType, name: 'Khảo sát', icon: <LineChart className="w-4 h-4" /> },
    { id: 'whitepaper' as ReportType, name: 'Báo cáo chuyên đề', icon: <BookOpen className="w-4 h-4" /> },
  ];

  const reports: Report[] = [
    {
      id: 'age-care-report',
      title: 'Thị trường các sản phẩm, dịch vụ chăm sóc người cao tuổi tại Việt Nam',
      description: 'Báo cáo nghiên cứu về già hóa dân số, nhu cầu chăm sóc và cơ hội phát triển thị trường dịch vụ cho người cao tuổi. Tác giả: VCCI-HCM UNFPA.',
      category: 'policy',
      type: 'research',
      author: '',
      organization: 'VCCI-HCM',
      publishDate: '2021',
      pages: 0,
      downloads: 0,
      tags: ['Chinh sach nganh', 'Kinh doanh co trach nhiem'],
      fileSize: 'PDF',
      language: 'vi',
      thumbnail: '/VN-VCCIHCM-Report-Market-Mapping-on-Elderly-Care.jpg',
      link: '/AgeCareReport',
    },
    {
      id: '1',
      title: 'Báo cáo Phát triển Bền vững Việt Nam 2024',
      description: 'Tổng quan toàn diện về tình hình thực hiện các mục tiêu phát triển bền vững tại Việt Nam, bao gồm phân tích xu hướng, thách thức và cơ hội trong bối cảnh hội nhập quốc tế.',
      category: 'esg',
      type: 'research',
      author: 'TS. Nguyễn Văn Minh, ThS. Trần Thị Hương',
      organization: 'Viện Chiến lược và Chính sách Tài nguyên Môi trường',
      publishDate: '15/11/2024',
      pages: 156,
      downloads: 1247,
      tags: ['ESG', 'Phát triển bền vững', 'SDGs', 'Việt Nam'],
      fileSize: '8.5 MB',
      language: 'both',
      thumbnail: '/reports/esg-report.jpg',
    },
    {
      id: '2',
      title: 'Chuyển đổi Xanh trong Ngành Nông nghiệp: Thực trạng và Giải pháp',
      description: 'Nghiên cứu chuyên sâu về quá trình chuyển đổi xanh trong sản xuất nông nghiệp Việt Nam, với trọng tâm là nuôi trồng thủy sản và trồng lúa bền vững.',
      category: 'agriculture',
      type: 'research',
      author: 'GS.TS. Lê Văn Khoa',
      organization: 'Học viện Nông nghiệp Việt Nam',
      publishDate: '28/10/2024',
      pages: 89,
      downloads: 892,
      tags: ['Nông nghiệp xanh', 'Thủy sản', 'Lúa gạo', 'Chuyển đổi'],
      fileSize: '5.2 MB',
      language: 'vi',
      thumbnail: '/reports/agriculture.jpg',
    },
    {
      id: '3',
      title: 'Báo cáo ESG và Chuỗi Giá trị Toàn cầu',
      description: 'Phân tích tác động của các tiêu chuẩn ESG đối với chuỗi giá trị toàn cầu và khả năng cạnh tranh của doanh nghiệp Việt Nam trong thị trường quốc tế.',
      category: 'supply-chain',
      type: 'whitepaper',
      author: 'VCCI & PwC Vietnam',
      organization: 'Phòng Thương mại và Công nghiệp Việt Nam',
      publishDate: '10/10/2024',
      pages: 64,
      downloads: 1456,
      tags: ['ESG', 'Chuỗi giá trị', 'Xuất khẩu', 'Cạnh tranh'],
      fileSize: '4.8 MB',
      language: 'both',
      thumbnail: '/reports/supply-chain.jpg',
    },
    {
      id: '4',
      title: 'Khảo sát Doanh nghiệp về Báo cáo Bền vững 2024',
      description: 'Kết quả khảo sát 500 doanh nghiệp Việt Nam về nhận thức, thực tiễn và thách thức trong việc xây dựng và công bố báo cáo phát triển bền vững.',
      category: 'esg',
      type: 'survey',
      author: 'Nhóm Nghiên cứu VCCI',
      organization: 'Phòng Thương mại và Công nghiệp Việt Nam',
      publishDate: '05/10/2024',
      pages: 48,
      downloads: 678,
      tags: ['Khảo sát', 'Doanh nghiệp', 'Báo cáo bền vững', 'ESG'],
      fileSize: '3.1 MB',
      language: 'vi',
      thumbnail: '/reports/survey.jpg',
    },
    {
      id: '5',
      title: 'Biến đổi Khí hậu và Tác động đến Đồng bằng sông Cửu Long',
      description: 'Nghiên cứu về tác động của biến đổi khí hậu đến sản xuất nông nghiệp và sinh kế người dân tại khu vực Đồng bằng sông Cửu Long, kèm khuyến nghị chính sách.',
      category: 'climate',
      type: 'research',
      author: 'TS. Phạm Văn Toàn, TS. Nguyễn Thị Mai',
      organization: 'Viện Khoa học Khí tượng Thủy văn và Biến đổi Khí hậu',
      publishDate: '20/09/2024',
      pages: 112,
      downloads: 534,
      tags: ['Biến đổi khí hậu', 'ĐBSCL', 'Thích ứng', 'Nông nghiệp'],
      fileSize: '6.7 MB',
      language: 'both',
      thumbnail: '/reports/climate.jpg',
    },
    {
      id: '6',
      title: 'Chính sách Phát triển Bền vững tại ASEAN: Bài học cho Việt Nam',
      description: 'Tổng hợp và phân tích các chính sách phát triển bền vững của các quốc gia ASEAN, rút ra bài học kinh nghiệm áp dụng cho bối cảnh Việt Nam.',
      category: 'policy',
      type: 'policy-brief',
      author: 'Nhóm Chuyên gia UNDP Việt Nam',
      organization: 'Chương trình Phát triển Liên Hợp Quốc',
      publishDate: '15/09/2024',
      pages: 42,
      downloads: 789,
      tags: ['ASEAN', 'Chính sách', 'So sánh quốc tế', 'Bền vững'],
      fileSize: '2.9 MB',
      language: 'both',
      thumbnail: '/reports/policy.jpg',
    },
    {
      id: '7',
      title: 'Nghiên cứu Điển hình: Mô hình Nuôi Tôm Bền vững tại Cà Mau',
      description: 'Nghiên cứu chi tiết về mô hình nuôi tôm sinh thái tại Cà Mau, phân tích hiệu quả kinh tế, môi trường và xã hội, cung cấp khuyến nghị nhân rộng.',
      category: 'agriculture',
      type: 'case-study',
      author: 'ThS. Lê Thị Bình, KS. Trần Văn Nam',
      organization: 'Trung tâm Khuyến nông Cà Mau',
      publishDate: '01/09/2024',
      pages: 56,
      downloads: 623,
      tags: ['Nuôi tôm', 'Cà Mau', 'Mô hình điển hình', 'Bền vững'],
      fileSize: '4.3 MB',
      language: 'vi',
      thumbnail: '/reports/case-study.jpg',
    },
    {
      id: '8',
      title: 'Báo cáo Chuyên đề: Kinh tế Tuần hoàn trong Sản xuất Nông nghiệp',
      description: 'Phân tích tiềm năng và lộ trình áp dụng mô hình kinh tế tuần hoàn trong sản xuất nông nghiệp Việt Nam, từ lý thuyết đến thực hành.',
      category: 'agriculture',
      type: 'whitepaper',
      author: 'PGS.TS. Hoàng Văn Cường',
      organization: 'Bộ Nông nghiệp và Phát triển Nông thôn',
      publishDate: '25/08/2024',
      pages: 78,
      downloads: 845,
      tags: ['Kinh tế tuần hoàn', 'Nông nghiệp', 'Chất thải', 'Tái sử dụng'],
      fileSize: '5.6 MB',
      language: 'vi',
      thumbnail: '/reports/circular.jpg',
    },
    {
      id: '9',
      title: 'Khảo sát An toàn Vệ sinh Lao động trong Doanh nghiệp Việt Nam 2024',
      description: 'Khảo sát toàn diện về thực trạng ATVSLĐ tại 800 doanh nghiệp, phân tích các rủi ro nghề nghiệp và đề xuất giải pháp cải thiện điều kiện làm việc an toàn.',
      category: 'labor-safety',
      type: 'survey',
      author: 'Nhóm Nghiên cứu VNFU',
      organization: 'Tổng Liên đoàn Lao động Việt Nam',
      publishDate: '10/12/2024',
      pages: 94,
      downloads: 1523,
      tags: ['ATVSLĐ', 'An toàn lao động', 'Khảo sát', 'Doanh nghiệp'],
      fileSize: '7.2 MB',
      language: 'vi',
      thumbnail: '/reports/labor-safety.jpg',
    },
    {
      id: '10',
      title: 'Hướng dẫn Kinh doanh Có trách nhiệm theo Tiêu chuẩn Quốc tế',
      description: 'Tài liệu hướng dẫn thực hành về kinh doanh có trách nhiệm, tuân thủ các nguyên tắc UN Global Compact và ISO 26000 về trách nhiệm xã hội.',
      category: 'responsible-business',
      type: 'whitepaper',
      author: 'Nhóm Chuyên gia VCCI & ILO',
      organization: 'Phòng Thương mại và Công nghiệp Việt Nam',
      publishDate: '05/12/2024',
      pages: 68,
      downloads: 956,
      tags: ['Kinh doanh có trách nhiệm', 'CSR', 'ISO 26000', 'UN Global Compact'],
      fileSize: '5.8 MB',
      language: 'both',
      thumbnail: '/reports/responsible-business.jpg',
    },
    {
      id: '11',
      title: 'Chính sách Ngành Thủy sản: Định hướng Phát triển Bền vững đến 2030',
      description: 'Tổng hợp các chính sách ngành thủy sản Việt Nam, phân tích định hướng phát triển bền vững, chứng nhận quốc tế và hội nhập thị trường toàn cầu.',
      category: 'policy',
      type: 'policy-brief',
      author: 'Cục Khai thác và Bảo vệ Nguồn lợi Thủy sản',
      organization: 'Bộ Nông nghiệp và Phát triển Nông thôn',
      publishDate: '20/11/2024',
      pages: 52,
      downloads: 1134,
      tags: ['Chính sách', 'Thủy sản', 'Phát triển bền vững', 'Chứng nhận'],
      fileSize: '4.1 MB',
      language: 'vi',
      thumbnail: '/reports/fishery-policy.jpg',
    },
  ];

  const stats = [
    { label: 'Tài liệu', value: '150+', icon: <BookOpen className="w-6 h-6 text-white" /> },
    { label: 'Lượt tải xuống', value: '25,000+', icon: <Download className="w-6 h-6 text-white" /> },
    { label: 'Tổ chức đóng góp', value: '40+', icon: <Building2 className="w-6 h-6 text-white" /> },
    { label: 'Chủ đề nghiên cứu', value: '15+', icon: <Bookmark className="w-6 h-6 text-white" /> },
  ];

  const filteredReports = reports.filter((report) => {
    const matchesCategory = selectedCategory === 'all' || report.category === selectedCategory;
    const matchesType = selectedType === 'all' || report.type === selectedType;
    const matchesSearch = searchQuery === '' ||
      report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesType && matchesSearch;
  });

  const getLanguageBadge = (language: string) => {
    const labels = {
      vi: 'Tiếng Việt',
      en: 'English',
      both: 'Song ngữ',
    };
    return (
      <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded font-semibold">
        {labels[language as keyof typeof labels]}
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
        <section className="relative w-full bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 text-white py-20">
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Library className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="font-montserrat font-bold text-4xl md:text-5xl">
                  Thư viện Nghiên cứu & Báo cáo
                </h1>
              </div>
            </div>
            <p className="text-lg md:text-xl text-indigo-100 leading-relaxed max-w-4xl font-montserrat">
              Thư viện Nghiên cứu & Báo cáo là nơi tập hợp những tài liệu chính sách, phân tích, khảo sát và
              nghiên cứu chuyên sâu về chủ đề phát triển bền vững, báo cáo bền vững ESG, chuyển đổi xanh tại
              Việt Nam. Các tài liệu được chọn lọc và phân loại khoa học, giúp doanh nghiệp, tổ chức và nhà
              nghiên cứu dễ dàng tra cứu, tiếp cận tri thức tin cậy và ứng dụng vào thực tiễn.
            </p>
            <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    {stat.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white font-montserrat">
                      {stat.value}
                    </div>
                    <div className="text-sm text-indigo-100 font-montserrat">
                      {stat.label}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="py-6 bg-gray-50">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm theo tiêu đề, mô tả hoặc từ khóa..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none font-montserrat text-lg"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Search className="w-6 h-6" />
              </div>
            </div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-3 bg-gray-50 sticky top-16 z-40 shadow-sm border-b">
          <div className="container mx-auto px-6 max-w-6xl">
            {/* Category Filters */}
            <div className="mb-2">
              <h3 className="font-montserrat font-semibold text-xs text-gray-600 mb-2">Chủ đề:</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-3 py-1.5 rounded-lg font-montserrat font-semibold transition-all duration-200 flex items-center gap-2 text-sm ${
                      selectedCategory === category.id
                        ? 'bg-indigo-600 text-white shadow-md scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span>{category.icon}</span>
                    <span>{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filters */}
            <div>
              <h3 className="font-montserrat font-semibold text-xs text-gray-600 mb-2">Loại tài liệu:</h3>
              <div className="flex flex-wrap gap-2">
                {reportTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-3 py-1.5 rounded-lg font-montserrat font-semibold transition-all duration-200 flex items-center gap-2 text-sm ${
                      selectedType === type.id
                        ? 'bg-purple-600 text-white shadow-md scale-105'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <span>{type.icon}</span>
                    <span>{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Reports Grid */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6 max-w-6xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-montserrat font-bold text-2xl text-gray-800">
                Tìm thấy {filteredReports.length} tài liệu
              </h2>
            </div>

            {filteredReports.length === 0 ? (
              <div className="text-center py-16">
                <div className="flex justify-center mb-4">
                  <Inbox className="w-14 h-14 text-gray-400" />
                </div>
                <h3 className="font-montserrat font-bold text-xl text-gray-600 mb-2">
                  Không tìm thấy tài liệu
                </h3>
                <p className="text-gray-500 font-montserrat">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => {
                  const cardClasses =
                    'bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group';
                  const cardContent = (
                    <>
                    {/* Thumbnail */}
                    <div className="relative h-48 bg-gray-100 overflow-hidden">
                      {report.thumbnail ? (
                        <Image
                          src={report.thumbnail}
                          alt={report.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <FileText className="w-20 h-20 text-indigo-300" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                      <div className="absolute top-4 right-4">
                        {getLanguageBadge(report.language)}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <h3 className="font-montserrat font-bold text-lg text-gray-800 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {report.title}
                      </h3>
                      <p className="text-gray-600 font-montserrat text-sm mb-4 line-clamp-3 leading-relaxed">
                        {report.description}
                      </p>

                      {!report.link && (
                        <div className="space-y-2 mb-4">
                          {/* Meta Info */}
                          <div className="flex items-center text-sm text-gray-600 font-montserrat">
                            <span className="font-semibold mr-2">TA?c gi???:</span>
                            <span className="line-clamp-1">{report.author}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 font-montserrat">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>{report.publishDate}</span>
                            <span className="mx-2">???</span>
                            <span>{report.pages} trang</span>
                            <span className="mx-2">???</span>
                            <span>{report.fileSize}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600 font-montserrat">
                            <Download className="w-4 h-4 mr-2" />
                            <span>{report.downloads.toLocaleString()} l?????t t???i</span>
                          </div>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {report.tags.slice(0, 3).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-semibold font-montserrat flex items-center gap-1"
                          >
                            <Tag className="w-3 h-3" />
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Download Button */}
                      {report.link ? (
                        <span className="w-full px-4 py-3 bg-indigo-600 text-white font-montserrat font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2">
                          <FileText className="w-5 h-5" />
                          Xem tom tat
                        </span>
                      ) : (
                        <button className="w-full px-4 py-3 bg-indigo-600 text-white font-montserrat font-semibold rounded-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center gap-2">
                          <Download className="w-5 h-5" />
                          T???i xu??`ng PDF
                        </button>
                      )}
                    </div>
                    </>
                  );

                  if (report.link) {
                    return (
                      <Link key={report.id} href={report.link} className={cardClasses}>
                        {cardContent}
                      </Link>
                    );
                  }

                  return (
                    <div key={report.id} className={cardClasses}>
                      {cardContent}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Information Providers Section */}
        <section className="py-16 bg-white border-t">
          <div className="container mx-auto px-6 max-w-6xl">
            <h2 className="font-montserrat font-bold text-3xl text-gray-800 mb-4 text-center">
              Nguồn cung cấp tài liệu
            </h2>
            <p className="text-gray-600 font-montserrat text-center mb-12 max-w-3xl mx-auto">
              Thư viện được xây dựng từ sự đóng góp của các tổ chức uy tín và nhóm chuyên gia hàng đầu
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Provider 1 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border-l-4 border-blue-600 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                    <Landmark className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="font-montserrat font-bold text-xl text-gray-800">
                    VNFU
                  </h3>
                </div>
                <p className="text-gray-700 font-montserrat text-sm leading-relaxed">
                  Tổng Liên đoàn Lao động Việt Nam - Đơn vị cung cấp các nghiên cứu về an toàn vệ sinh lao động,
                  quyền lợi người lao động và phát triển bền vững trong doanh nghiệp.
                </p>
              </div>

              {/* Provider 2 */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-6 border-l-4 border-green-600 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center">
                    <Users className="w-7 h-7 text-green-600" />
                  </div>
                  <h3 className="font-montserrat font-bold text-xl text-gray-800">
                    Nhóm Chuyên gia
                  </h3>
                </div>
                <p className="text-gray-700 font-montserrat text-sm leading-relaxed">
                  Đội ngũ chuyên gia đầu ngành về ESG, phát triển bền vững, chính sách môi trường và trách nhiệm
                  xã hội doanh nghiệp từ các viện nghiên cứu và trường đại học hàng đầu.
                </p>
              </div>

              {/* Provider 3 */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-lg p-6 border-l-4 border-purple-600 hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center">
                    <Target className="w-7 h-7 text-purple-600" />
                  </div>
                  <h3 className="font-montserrat font-bold text-xl text-gray-800">
                    Tổ chức Tư vấn
                  </h3>
                </div>
                <p className="text-gray-700 font-montserrat text-sm leading-relaxed">
                  Các tổ chức tư vấn chính sách quốc tế và trong nước như UNDP, ILO, VCCI cung cấp báo cáo
                  phân tích chuyên sâu và hướng dẫn thực hành tốt nhất.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-16 bg-gradient-to-br from-indigo-900 to-purple-900 text-white">
          <div className="container mx-auto px-6 max-w-6xl text-center">
            <h2 className="font-montserrat font-bold text-3xl mb-4">
              Đóng góp tài liệu nghiên cứu
            </h2>
            <p className="font-montserrat text-lg text-indigo-100 mb-8 max-w-2xl mx-auto">
              Bạn có nghiên cứu, báo cáo hoặc tài liệu chất lượng về phát triển bền vững?
              Chia sẻ với cộng đồng để lan tỏa tri thức và tạo tác động tích cực.
            </p>
            <button className="px-8 py-4 bg-white text-indigo-900 font-montserrat font-bold rounded-lg hover:bg-indigo-50 transition-colors duration-200 shadow-lg">
              Đóng góp tài liệu
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
