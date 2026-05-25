import HomeContentGridSection from '@/components/HomeContentGridSection';
import { getHomeStoryItems } from '@/lib/home-content';

export default async function DienHinhSection() {
  const initialItems = await getHomeStoryItems(3).catch((error) => {
    console.error('Failed to preload home story items:', error);
    return [];
  });

  return (
    <HomeContentGridSection
      titleVi="Thực hành điển hình - Lan tỏa giá trị"
      titleEn="Best Practices - Stories that inspire"
      descriptionVi="Khám phá những câu chuyện thành công và mô hình, sáng kiến điển hình trong phát triển bền vững tại Việt Nam."
      descriptionEn="Discover successful stories, models and initiatives for sustainable development in Viet Nam."
      fetchUrl="/api/sections/home/dien-hinh"
      viewAllHref="/tat-ca-dien-hinh"
      emptyVi="Chưa có nội dung điển hình."
      emptyEn="No best-practice content yet."
      initialItems={initialItems}
    />
  );
}
