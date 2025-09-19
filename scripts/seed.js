const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create sample users
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.create({
    data: {
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      province: 'An Giang',
      organization: 'Hợp tác xã nông nghiệp An Giang',
      isVerified: true,
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Trần Thị Bình',
      email: 'binh.tran@example.com',
      password: hashedPassword,
      role: 'MODERATOR',
      province: 'Cà Mau',
      organization: 'Trung tâm khuyến nông Cà Mau',
      isVerified: true,
    },
  });

  // Create featured content
  const featuredContent = await prisma.content.create({
    data: {
      title: 'Câu chuyện điển hình: Nuôi tôm bền vững ở Cà Mau',
      titleEn: 'Success Story: Sustainable Shrimp Farming in Ca Mau',
      description: 'Tìm hiểu cách anh Nguyễn Văn Thành đã áp dụng các thực hành nuôi tôm bền vững, tăng năng suất 40% và giảm chi phí 25% tại trang trại ở Cà Mau.',
      descriptionEn: 'Learn how Mr. Nguyen Van Thanh applied sustainable shrimp farming practices, increasing productivity by 40% and reducing costs by 25% at his farm in Ca Mau.',
      content: 'Nội dung chi tiết về thực hành nuôi tôm bền vững...',
      contentEn: 'Detailed content about sustainable shrimp farming practices...',
      type: 'STORY',
      category: 'Nuôi tôm',
      tags: 'nuôi tôm, bền vững, Cà Mau, thành công',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      isFeatured: true,
      status: 'PUBLISHED',
      viewCount: 1250,
      authorId: user1.id,
    },
  });

  // Create news articles
  const newsArticles = [
    {
      title: '50 doanh nghiệp tham gia dự án tôm bền vững',
      titleEn: '50 businesses join sustainable shrimp project',
      description: 'Dự án hợp tác với VCCI và Oxfam nhằm thúc đẩy chuỗi giá trị tôm bền vững tại đồng bằng sông Cửu Long.',
      descriptionEn: 'Project in cooperation with VCCI and Oxfam to promote sustainable shrimp value chains in the Mekong Delta.',
      content: 'Nội dung chi tiết về dự án...',
      contentEn: 'Detailed content about the project...',
      type: 'ARTICLE',
      category: 'Tin tức',
      tags: 'dự án, tôm bền vững, VCCI, Oxfam',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 850,
      authorId: user2.id,
    },
    {
      title: 'Hội thảo "Kỹ thuật canh tác lúa thông minh" tại An Giang',
      titleEn: 'Smart Rice Farming Techniques Workshop in An Giang',
      description: 'Sự kiện được tổ chức bởi Sở Nông nghiệp An Giang với sự tham gia của 200 nông dân và chuyên gia.',
      descriptionEn: 'Event organized by An Giang Department of Agriculture with participation of 200 farmers and experts.',
      content: 'Nội dung chi tiết về hội thảo...',
      contentEn: 'Detailed content about the workshop...',
      type: 'ARTICLE',
      category: 'Sự kiện',
      tags: 'hội thảo, lúa thông minh, An Giang',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 620,
      authorId: user1.id,
    },
    {
      title: 'Xuất khẩu tôm Việt Nam đạt 3.2 tỷ USD trong 9 tháng',
      titleEn: 'Vietnam shrimp exports reach 3.2 billion USD in 9 months',
      description: 'Ngành tôm Việt Nam tiếp tục tăng trưởng mạnh mẽ nhờ áp dụng các tiêu chuẩn quốc tế và thực hành bền vững.',
      descriptionEn: 'Vietnam\'s shrimp industry continues strong growth thanks to international standards and sustainable practices.',
      content: 'Nội dung chi tiết về xuất khẩu tôm...',
      contentEn: 'Detailed content about shrimp exports...',
      type: 'ARTICLE',
      category: 'Kinh tế',
      tags: 'xuất khẩu, tôm, kinh tế, thống kê',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 1120,
      authorId: user2.id,
    },
  ];

  for (const article of newsArticles) {
    await prisma.content.create({
      data: {
        ...article,
        authorId: article.authorId,
      },
    });
  }

  // Create community stories
  const communityStories = [
    {
      title: 'Mô hình liên kết sản xuất lúa hữu cơ tại An Giang',
      titleEn: 'Organic rice production linkage model in An Giang',
      description: 'Hợp tác xã An Phú liên kết với 50 hộ nông dân sản xuất lúa hữu cơ chất lượng cao.',
      descriptionEn: 'An Phu Cooperative links with 50 farming households to produce high-quality organic rice.',
      content: 'Chi tiết về mô hình liên kết...',
      contentEn: 'Details about the linkage model...',
      type: 'STORY',
      category: 'Cộng đồng',
      tags: 'liên kết, lúa hữu cơ, An Giang',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 450,
      authorId: user1.id,
    },
    {
      title: 'Chương trình đào tạo kỹ thuật nuôi tôm cho phụ nữ',
      titleEn: 'Shrimp farming training program for women',
      description: 'Oxfam và đối tác địa phương đào tạo kỹ thuật nuôi tôm cho 120 phụ nữ tại Cà Mau.',
      descriptionEn: 'Oxfam and local partners train 120 women in shrimp farming techniques in Ca Mau.',
      content: 'Chi tiết về chương trình đào tạo...',
      contentEn: 'Details about the training program...',
      type: 'GUIDE',
      category: 'Đào tạo',
      tags: 'đào tạo, phụ nữ, nuôi tôm, Cà Mau',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 680,
      authorId: user2.id,
    },
    {
      title: 'Ứng dụng công nghệ IoT trong quản lý ao nuôi tôm',
      titleEn: 'IoT technology application in shrimp pond management',
      description: 'Trang trại tôm hiện đại sử dụng cảm biến IoT để giám sát chất lượng nước 24/7.',
      descriptionEn: 'Modern shrimp farm uses IoT sensors to monitor water quality 24/7.',
      content: 'Chi tiết về ứng dụng công nghệ IoT...',
      contentEn: 'Details about IoT technology application...',
      type: 'STORY',
      category: 'Công nghệ',
      tags: 'IoT, công nghệ, nuôi tôm, quản lý',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 920,
      authorId: user1.id,
    },
  ];

  for (const story of communityStories) {
    await prisma.content.create({
      data: {
        ...story,
        authorId: story.authorId,
      },
    });
  }

  console.log('✅ Database seeded successfully!');
  console.log(`📊 Created:
  - 2 users
  - 1 featured content
  - 3 news articles
  - 3 community stories`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });