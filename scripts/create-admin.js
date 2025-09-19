const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function createAdmin() {
  try {
    console.log('Creating admin user...')

    // Check if admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@goodpractices.local' }
    })

    if (existingAdmin) {
      console.log('Admin user already exists!')
      return
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12)

    // Create admin user
    const admin = await prisma.user.create({
      data: {
        name: 'Administrator',
        email: 'admin@goodpractices.local',
        phone: '0901234567',
        password: hashedPassword,
        role: 'ADMIN',
        province: 'TP. Hồ Chí Minh',
        organization: 'Good Practices Platform',
        isVerified: true
      }
    })

    console.log('Admin user created successfully!')
    console.log('Email: admin@goodpractices.local')
    console.log('Password: admin123')
    console.log('Role: ADMIN')

    // Create some sample content
    console.log('\nCreating sample content...')

    const sampleContent = await prisma.content.create({
      data: {
        title: 'Hướng dẫn nuôi tôm sinh thái tại An Giang',
        titleEn: 'Ecological Shrimp Farming Guide in An Giang',
        description: 'Mô hình nuôi tôm sinh thái bền vững, thân thiện với môi trường và mang lại hiệu quả kinh tế cao.',
        descriptionEn: 'Sustainable ecological shrimp farming model that is environmentally friendly and economically efficient.',
        content: `
## Giới thiệu

Nuôi tôm sinh thái là phương pháp nuôi tôm tiên tiến, kết hợp giữa công nghệ hiện đại và các nguyên tắc sinh thái tự nhiên. Phương pháp này không chỉ bảo vệ môi trường mà còn mang lại hiệu quả kinh tế cao cho người nông dân.

## Các bước thực hiện

### 1. Chuẩn bị ao nuôi
- Làm sạch ao, loại bỏ bùn thải
- Phơi ao 7-10 ngày
- Vôi sát trùng ao

### 2. Thả tôm giống
- Chọn tôm giống chất lượng cao
- Mật độ thả phù hợp: 15-20 con/m²
- Thời điểm thả: buổi sáng sớm hoặc chiều mát

### 3. Quản lý chất lượng nước
- Kiểm tra pH: 7.5-8.5
- Độ mặn: 15-25‰
- Hàm lượng oxy: > 5mg/l

## Lợi ích

- Giảm thiểu tác động môi trường
- Tăng năng suất và chất lượng tôm
- Giảm chi phí thuốc và hóa chất
- Đảm bảo an toàn thực phẩm
        `,
        contentEn: `
## Introduction

Ecological shrimp farming is an advanced shrimp cultivation method that combines modern technology with natural ecological principles. This method not only protects the environment but also brings high economic efficiency to farmers.

## Implementation Steps

### 1. Pond Preparation
- Clean the pond, remove waste mud
- Dry the pond for 7-10 days
- Disinfect the pond with lime

### 2. Stocking Shrimp
- Choose high-quality shrimp seeds
- Appropriate stocking density: 15-20 pieces/m²
- Stocking time: early morning or cool afternoon

### 3. Water Quality Management
- Check pH: 7.5-8.5
- Salinity: 15-25‰
- Oxygen content: > 5mg/l

## Benefits

- Minimize environmental impact
- Increase shrimp productivity and quality
- Reduce costs of medicine and chemicals
- Ensure food safety
        `,
        type: 'GUIDE',
        category: 'shrimp_farming',
        tags: 'nuôi tôm, sinh thái, bền vững, An Giang',
        status: 'PUBLISHED',
        isPublic: true,
        isFeatured: true,
        authorId: admin.id
      }
    })

    const sampleContent2 = await prisma.content.create({
      data: {
        title: 'Câu chuyện thành công: HTX Nông nghiệp Sóc Trăng',
        titleEn: 'Success Story: Soc Trang Agricultural Cooperative',
        description: 'Mô hình liên kết sản xuất lúa hữu cơ mang lại thu nhập ổn định cho nông dân.',
        descriptionEn: 'Organic rice production linkage model brings stable income for farmers.',
        content: 'HTX Nông nghiệp Sóc Trăng đã thành công trong việc áp dụng mô hình trồng lúa hữu cơ, giúp nông dân tăng thu nhập gấp 1.5 lần so với trồng lúa thông thường...',
        contentEn: 'Soc Trang Agricultural Cooperative has been successful in applying organic rice cultivation model, helping farmers increase income by 1.5 times compared to conventional rice farming...',
        type: 'STORY',
        category: 'rice_cultivation',
        tags: 'lúa hữu cơ, HTX, Sóc Trăng, thành công',
        status: 'PUBLISHED',
        isPublic: true,
        isFeatured: false,
        authorId: admin.id
      }
    })

    console.log('Sample content created successfully!')

    // Create analytics records
    await prisma.analytics.createMany({
      data: [
        {
          event: 'content_view',
          contentId: sampleContent.id,
          userId: admin.id,
          metadata: { source: 'direct' }
        },
        {
          event: 'content_view',
          contentId: sampleContent2.id,
          userId: admin.id,
          metadata: { source: 'search' }
        }
      ]
    })

    console.log('Sample analytics created!')

  } catch (error) {
    console.error('Error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createAdmin()