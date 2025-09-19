Claude Code CLI Prompt for Good Practices Platform Main Page
Project Context
You are tasked with generating the main page for the "Good Practices Platform" (Nền Tảng Tư Liệu Hóa), a Next.js 15 web app for sharing best practices in Vietnam’s shrimp and rice value chains. The platform targets farmers, businesses, researchers, and admins in provinces like An Giang and Cà Mau, under the Oxfam–VCCI-HCM initiative. It uses:

Next.js 15 (App Router, TypeScript)
Prisma ORM (SQLite for dev, plan PostgreSQL for prod)
NextAuth.js (credentials provider, OTP for phone/email)
Tailwind CSS (responsive, mobile-first)
next-intl (Vietnamese default, English support)

The main page design is inspired by https://saiplatform.org/, emphasizing a clean, mission-driven UI with bold visuals, clear CTAs, and community focus. The page must be user-friendly for non-tech-savvy users, multilingual (VI/EN), and align with the SRS sitemap: Home, About, Resource Library, Interactive Tools, Support & Deployment, Community Initiatives, News, and Membership.
Task
Generate the main page (/src/app/page.tsx) with reusable components, API routes, and necessary configurations. The page should reflect the SAI Platform’s aesthetic (modern, image-driven, card-based) while meeting the project’s requirements. Include bilingual support, responsive design, and secure data fetching.
Requirements
1. Hero Section

Content:
Full-width, mobile-optimized background image (shrimp/rice farming, e.g., /public/uploads/hero.jpg).
Headline: “Nền Tảng Tư Liệu Hóa: Thúc đẩy Thực hành Tốt cho Tôm và Lúa” (VI) / “Good Practices Platform: Advancing Best Practices for Shrimp and Rice” (EN).
Subheading: “Kết nối nông dân, doanh nghiệp, và chuyên gia để xây dựng chuỗi giá trị bền vững” (VI) / “Connecting farmers, businesses, and experts for sustainable value chains” (EN).
CTA: “Khám phá ngay” (VI) / “Explore Now” (EN) linking to /resources.


Tech:
Use next/image for optimized loading (priority, sizes="100vw").
Tailwind: bg-cover, text-white, text-4xl for headline.
next-intl for translations (useTranslations hook).
Sticky header with language toggle (VI/EN).



2. About Section

Content:
Text: “Nền tảng của chúng tôi hỗ trợ nông dân, doanh nghiệp, và nhà nghiên cứu tại An Giang, Cà Mau, và hơn thế nữa, chia sẻ thực hành tốt và câu chuyện điển hình” (VI) / English equivalent.
Small illustration/icon (e.g., shrimp/rice, /public/uploads/icon.png).
CTA: “Tìm hiểu thêm” (VI) / “Learn More” (EN) linking to /about.


Tech:
Tailwind: bg-gray-100, p-8, grid layout (grid grid-cols-1 md:grid-cols-2).
Prisma query for dynamic stats (e.g., “1000+ nông hộ nhỏ”).
next-intl for bilingual text.



3. Featured Content

Content:
Card with image (/public/uploads/featured.jpg), title (e.g., “Câu chuyện điển hình: Nuôi tôm bền vững ở Cà Mau”), and metric (e.g., “500+ lượt xem”).
CTA: “Xem ngay” (VI) / “View Now” (EN).


Tech:
Component: FeaturedContent.tsx.
Prisma query: Fetch Content model (type: STORY/VIDEO, state: PUBLISHED).
Tailwind: shadow-md, rounded-lg, hover effects.
Support multimedia (video <iframe>, PDF <embed>).



4. Interactive Tools

Content:
3-4 cards: Search, Policy Tracker, Feedback Form.
Text: “Tìm kiếm tài liệu, theo dõi chính sách, hoặc gửi câu chuyện của bạn” (VI) / English equivalent.
CTA: “Dùng ngay” (VI) / “Use Now” (EN) linking to /tools.


Tech:
Component: ToolsGrid.tsx.
Tailwind: grid grid-cols-1 md:grid-cols-3.
API route: /api/content/search for search (consider Algolia integration).



5. Community Initiatives

Content:
Carousel of 2-3 stories/events (e.g., “Hội thảo Nuôi tôm 2025”).
Text: “Tham gia cộng đồng của chúng tôi để học hỏi và chia sẻ thực hành tốt” (VI) / English equivalent.
CTA: “Tham gia ngay” (VI) / “Join Now” (EN).


Tech:
Component: CommunityCarousel.tsx.
Prisma: Fetch Content (type: STORY/EVENT).
Tailwind: overflow-x-auto, snap-x for carousel.



6. Sign-Up Section

Content:
Text: “Đăng ký để truy cập tài liệu độc quyền và nhận thông báo” (VI) / English equivalent.
Partner logos (e.g., VCCI, Oxfam, /public/uploads/logos/).
CTA: “Đăng ký miễn phí” (VI) / “Sign Up Free” (EN) linking to /auth/signin.


Tech:
Component: SignUpSection.tsx.
NextAuth: Registration with OTP (/src/lib/otp.ts).
Tailwind: flex flex-wrap for logos, bg-primary for CTA.



7. News Section

Content:
2-3 news cards with title, snippet, and “Đọc thêm” (VI) / “Read More” (EN).
Example: “50 doanh nghiệp tham gia dự án tôm bền vững”.


Tech:
Component: NewsSection.tsx.
Prisma: Fetch Content (type: NEWS).
Tailwind: Grid layout; Cache with revalidate.



Technical Constraints

File Storage: Use /public/uploads/ for images; Validate with Multer.
Database: Prisma with SQLite; Models: Users, Content, Analytics.
Auth: NextAuth with RBAC (USER, MODERATOR, ADMIN); Custom sign-in at /auth/signin.
Accessibility: ARIA labels for buttons/links; Tooltips for guides.
Performance: Optimize images (next/image); Cache API responses (revalidate: 3600).
Security: Secure API routes with NextAuth; Validate uploads.

Deliverables

Main Page: /src/app/page.tsx with Tailwind-styled sections and next-intl for VI/EN.
Components (in /src/components/):
HeroSection.tsx
AboutSection.tsx
FeaturedContent.tsx
ToolsGrid.tsx
CommunityCarousel.tsx
SignUpSection.tsx
NewsSection.tsx


API Routes (in /src/app/api/):
/api/content/featured: Fetch featured content.
/api/content/news: Fetch news.
/api/content/community: Fetch stories/events.


Translations: Update /messages/vi.json and /messages/en.json.
Assets: Placeholder images in /public/uploads/ (hero, icons, logos).

Guidelines

Use TypeScript for type safety.
Follow Next.js App Router conventions.
Ensure mobile-first design with Tailwind (sm:, md:).
Avoid external dependencies beyond project stack (Next.js, Prisma, etc.).
Include comments for clarity.
No <form> onSubmit (use button events due to sandbox restrictions).
Use className for JSX styling.

Example Structure
// /src/app/page.tsx
import { useTranslations } from 'next-intl';
import HeroSection from '@/components/HeroSection';
import AboutSection from '@/components/AboutSection';
// ...other imports

export default function Home() {
  const t = useTranslations('Home');
  return (
    <main className="min-h-screen">
      <HeroSection />
      <AboutSection />
      <FeaturedContent />
      <ToolsGrid />
      <CommunityCarousel />
      <SignUpSection />
      <NewsSection />
    </main>
  );
}

Notes

Prioritize Vietnamese (lang="vi") with English toggle.
Use local storage (/public/uploads/) for now; Plan S3 for prod.
Test responsiveness (mobile, tablet, desktop).
Ensure Prisma queries are optimized (e.g., select specific fields).
Add ARIA labels for accessibility (e.g., aria-label="Explore resources").

Generate the code and structure as specified, ensuring alignment with the SAI Platform’s clean, image-driven aesthetic and the project’s SRS requirements.