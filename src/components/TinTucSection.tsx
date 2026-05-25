import HomeContentGridSection from '@/components/HomeContentGridSection';
import { getHomeNewsItems } from '@/lib/home-content';

export default async function TinTucSection() {
  const initialItems = await getHomeNewsItems(3).catch((error) => {
    console.error('Failed to preload home news items:', error);
    return [];
  });

  return (
    <HomeContentGridSection
      titleVi="Tin tức"
      titleEn="News"
      descriptionVi="Cập nhật những thông tin mới, hoạt động nổi bật và các câu chuyện đáng chú ý trong hành trình phát triển nông nghiệp bền vững."
      descriptionEn="Stay updated with the latest stories, highlights and noteworthy updates from the sustainable agriculture journey."
      fetchUrl="/api/content/news"
      viewAllHref="/news"
      emptyVi="Chưa có nội dung tin tức."
      emptyEn="No news content yet."
      initialItems={initialItems}
    />
  );
}
