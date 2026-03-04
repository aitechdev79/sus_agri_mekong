const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const DEFAULT_CATEGORIES = [
  { slug: 'shrimp_farming', nameVi: 'Nuôi tôm', nameEn: 'Shrimp Farming', displayOrder: 10 },
  { slug: 'shrimp_processing', nameVi: 'Chế biến tôm', nameEn: 'Shrimp Processing', displayOrder: 20 },
  { slug: 'shrimp_export', nameVi: 'Xuất khẩu tôm', nameEn: 'Shrimp Export', displayOrder: 30 },
  { slug: 'rice_cultivation', nameVi: 'Trồng lúa', nameEn: 'Rice Cultivation', displayOrder: 40 },
  { slug: 'rice_processing', nameVi: 'Chế biến lúa', nameEn: 'Rice Processing', displayOrder: 50 },
  { slug: 'rice_marketing', nameVi: 'Tiếp thị lúa', nameEn: 'Rice Marketing', displayOrder: 60 },
  { slug: 'sustainable_practices', nameVi: 'Thực hành bền vững', nameEn: 'Sustainable Practices', displayOrder: 70 },
  { slug: 'technology_innovation', nameVi: 'Công nghệ và đổi mới', nameEn: 'Technology & Innovation', displayOrder: 80 },
  { slug: 'financial_support', nameVi: 'Hỗ trợ tài chính', nameEn: 'Financial Support', displayOrder: 90 },
  { slug: 'market_access', nameVi: 'Tiếp cận thị trường', nameEn: 'Market Access', displayOrder: 100 },
  { slug: 'policy_guidelines', nameVi: 'Chính sách và hướng dẫn', nameEn: 'Policy & Guidelines', displayOrder: 110 },
  { slug: 'success_stories', nameVi: 'Câu chuyện thành công', nameEn: 'Success Stories', displayOrder: 120 }
]

async function syncCategories() {
  for (const category of DEFAULT_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {
        nameVi: category.nameVi,
        nameEn: category.nameEn,
        displayOrder: category.displayOrder
      },
      create: {
        ...category,
        isActive: true
      }
    })
  }
}

async function main() {
  console.log('Seeding database...')

  await syncCategories()

  const existingContent = await prisma.content.count()
  if (existingContent > 0) {
    console.log('Categories synced. Database already has content, skipping sample content seed.')
    return
  }

  const bcrypt = require('bcryptjs')
  const hashedPassword = await bcrypt.hash('password123', 12)

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
      isVerified: true
    }
  })

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
      isVerified: true
    }
  })

  await prisma.content.create({
    data: {
      title: 'Câu chuyện điển hình: Nuôi tôm bền vững ở Cà Mau',
      description:
        'Tìm hiểu cách anh Nguyễn Văn Thành đã áp dụng các thực hành nuôi tôm bền vững, tăng năng suất 40% và giảm chi phí 25% tại trang trại ở Cà Mau.',
      content: 'Nội dung chi tiết về thực hành nuôi tôm bền vững...',
      type: 'STORY',
      category: 'shrimp_farming',
      tags: 'nuôi tôm, bền vững, Cà Mau, thành công',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      isFeatured: true,
      status: 'PUBLISHED',
      viewCount: 1250,
      authorId: user1.id
    }
  })

  const sampleContents = [
    {
      title: '50 doanh nghiệp tham gia dự án tôm bền vững',
      description:
        'Dự án hợp tác với VCCI và Oxfam nhằm thúc đẩy chuỗi giá trị tôm bền vững tại đồng bằng sông Cửu Long.',
      content: 'Nội dung chi tiết về dự án...',
      type: 'ARTICLE',
      category: 'market_access',
      tags: 'dự án, tôm bền vững, VCCI, Oxfam',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 850,
      authorId: user2.id
    },
    {
      title: 'Hội thảo "Kỹ thuật canh tác lúa thông minh" tại An Giang',
      description:
        'Sự kiện được tổ chức bởi Sở Nông nghiệp An Giang với sự tham gia của 200 nông dân và chuyên gia.',
      content: 'Nội dung chi tiết về hội thảo...',
      type: 'ARTICLE',
      category: 'rice_cultivation',
      tags: 'hội thảo, lúa thông minh, An Giang',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 620,
      authorId: user1.id
    },
    {
      title: 'Xuất khẩu tôm Việt Nam đạt 3.2 tỷ USD trong 9 tháng',
      description:
        'Ngành tôm Việt Nam tiếp tục tăng trưởng mạnh mẽ nhờ áp dụng các tiêu chuẩn quốc tế và thực hành bền vững.',
      content: 'Nội dung chi tiết về xuất khẩu tôm...',
      type: 'ARTICLE',
      category: 'shrimp_export',
      tags: 'xuất khẩu, tôm, kinh tế, thống kê',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 1120,
      authorId: user2.id
    },
    {
      title: 'Mô hình liên kết sản xuất lúa hữu cơ tại An Giang',
      description: 'Hợp tác xã An Phú liên kết với 50 hộ nông dân sản xuất lúa hữu cơ chất lượng cao.',
      content: 'Chi tiết về mô hình liên kết...',
      type: 'STORY',
      category: 'success_stories',
      tags: 'liên kết, lúa hữu cơ, An Giang',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 450,
      authorId: user1.id
    },
    {
      title: 'Chương trình đào tạo kỹ thuật nuôi tôm cho phụ nữ',
      description: 'Oxfam và đối tác địa phương đào tạo kỹ thuật nuôi tôm cho 120 phụ nữ tại Cà Mau.',
      content: 'Chi tiết về chương trình đào tạo...',
      type: 'GUIDE',
      category: 'policy_guidelines',
      tags: 'đào tạo, phụ nữ, nuôi tôm, Cà Mau',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 680,
      authorId: user2.id
    },
    {
      title: 'Ứng dụng công nghệ IoT trong quản lý ao nuôi tôm',
      description: 'Trang trại tôm hiện đại sử dụng cảm biến IoT để giám sát chất lượng nước 24/7.',
      content: 'Chi tiết về ứng dụng công nghệ IoT...',
      type: 'STORY',
      category: 'technology_innovation',
      tags: 'IoT, công nghệ, nuôi tôm, quản lý',
      thumbnailUrl: '/uploads/featured.jpg',
      isPublic: true,
      status: 'PUBLISHED',
      viewCount: 920,
      authorId: user1.id
    }
  ]

  for (const item of sampleContents) {
    await prisma.content.create({ data: item })
  }

  console.log('Database seeded successfully')
}

main()
  .catch((error) => {
    console.error('Error seeding database:', error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
