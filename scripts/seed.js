const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Check if data already exists
  const existingContent = await prisma.content.count();
  if (existingContent > 0) {
    console.log('📊 Database already has content, skipping seed.');
    return;
  }

  // Create sample users
  const bcrypt = require('bcryptjs');
  const hashedPassword = await bcrypt.hash('password123', 12);

  const user1 = await prisma.user.upsert({
    where: { email: 'an.nguyen@example.com' },
    update: {},
    create: {
      name: 'Nguyễn Văn An',
      email: 'an.nguyen@example.com',
      password: hashedPassword,
      role: 'ADMIN',
      province: 'An Giang',
      organization: 'Hợp tác xã nông nghiệp An Giang',
      isVerified: true,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'binh.tran@example.com' },
    update: {},
    create: {
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
      description: 'Tìm hiểu cách anh Nguyễn Văn Thành đã áp dụng các thực hành nuôi tôm bền vững, tăng năng suất 40% và giảm chi phí 25% tại trang trại ở Cà Mau.',
      content: 'Nội dung chi tiết về thực hành nuôi tôm bền vững...',
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
      description: 'Dự án hợp tác với VCCI và Oxfam nhằm thúc đẩy chuỗi giá trị tôm bền vững tại đồng bằng sông Cửu Long.',
      content: 'Nội dung chi tiết về dự án...',
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
      description: 'Sự kiện được tổ chức bởi Sở Nông nghiệp An Giang với sự tham gia của 200 nông dân và chuyên gia.',
      content: 'Nội dung chi tiết về hội thảo...',
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
      description: 'Ngành tôm Việt Nam tiếp tục tăng trưởng mạnh mẽ nhờ áp dụng các tiêu chuẩn quốc tế và thực hành bền vững.',
      content: 'Nội dung chi tiết về xuất khẩu tôm...',
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
      description: 'Hợp tác xã An Phú liên kết với 50 hộ nông dân sản xuất lúa hữu cơ chất lượng cao.',
      content: 'Chi tiết về mô hình liên kết...',
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
      description: 'Oxfam và đối tác địa phương đào tạo kỹ thuật nuôi tôm cho 120 phụ nữ tại Cà Mau.',
      content: 'Chi tiết về chương trình đào tạo...',
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
      description: 'Trang trại tôm hiện đại sử dụng cảm biến IoT để giám sát chất lượng nước 24/7.',
      content: 'Chi tiết về ứng dụng công nghệ IoT...',
      type: 'STORY',
      category: 'Công nghệ',
      tags: 'IoT, công nghệ, nuôi tôm, quản lý',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 920,
      authorId: user1.id,
    },
    {
      title: 'Mô hình nuôi cá tra sinh thái tại Đồng Tháp',
      description: 'Trang trại cá tra áp dụng công nghệ sinh thái, giảm 50% chi phí thức ăn và nâng cao chất lượng sản phẩm.',
      content: 'Chi tiết về mô hình nuôi cá tra sinh thái...',
      type: 'STORY',
      category: 'Aquaculture',
      tags: 'cá tra,sinh thái,đồng tháp',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 678,
      authorId: user1.id,
    },
    {
      title: 'Thành công từ mô hình trồng lúa hữu cơ',
      description: 'Hợp tác xã Tân Thành đã xây dựng thành công chuỗi giá trị lúa hữu cơ từ sản xuất đến tiêu thụ.',
      content: 'Chi tiết về mô hình trồng lúa hữu cơ...',
      type: 'STORY',
      category: 'Rice Production',
      tags: 'lúa hữu cơ,hợp tác xã',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 892,
      authorId: user1.id,
    },
    {
      title: 'Ứng dụng AI trong theo dõi sức khỏe tôm',
      description: 'Startup công nghệ phát triển hệ thống AI giúp phát hiện sớm bệnh tật ở tôm, tăng tỷ lệ sống sót 35%.',
      content: 'Chi tiết về ứng dụng AI...',
      type: 'STORY',
      category: 'Technology',
      tags: 'AI,tôm,công nghệ',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 1156,
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