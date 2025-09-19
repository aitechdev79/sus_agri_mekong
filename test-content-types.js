const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testContentTypes() {
  console.log('🧪 Testing all content type updates...\n');

  const contentTypes = [
    { value: 'ARTICLE', label: 'Bài viết' },
    { value: 'DOCUMENT', label: 'Tài liệu' },
    { value: 'STORY', label: 'Điển hình' },
    { value: 'GUIDE', label: 'Hướng dẫn' },
    { value: 'POLICY', label: 'Chính sách' },
    { value: 'NEWS', label: 'Tin tức' }
  ];

  try {
    // Get first content item for testing
    const testContent = await prisma.content.findFirst();

    if (!testContent) {
      console.log('❌ No content found in database to test with');

      // Create a test content item
      console.log('📝 Creating test content...');
      const newContent = await prisma.content.create({
        data: {
          title: 'Test Content for Type Updates',
          content: 'This is test content',
          type: 'ARTICLE',
          category: 'shrimp_farming',
          tags: 'test',
          status: 'DRAFT',
          authorId: (await prisma.user.findFirst())?.id || ''
        }
      });

      console.log('✅ Test content created with ID:', newContent.id);
      console.log('');

      // Test updating each type
      for (const contentType of contentTypes) {
        console.log(`Testing type: ${contentType.label} (${contentType.value})`);

        const updated = await prisma.content.update({
          where: { id: newContent.id },
          data: { type: contentType.value }
        });

        if (updated.type === contentType.value) {
          console.log(`✅ Successfully updated to ${contentType.label}`);
        } else {
          console.log(`❌ Failed to update to ${contentType.label}`);
        }
      }

      // Clean up test content
      await prisma.content.delete({
        where: { id: newContent.id }
      });
      console.log('\n🧹 Test content cleaned up');

    } else {
      console.log('📝 Using existing content ID:', testContent.id);
      console.log('Original type:', testContent.type);
      console.log('');

      // Test updating each type
      for (const contentType of contentTypes) {
        console.log(`Testing type: ${contentType.label} (${contentType.value})`);

        const updated = await prisma.content.update({
          where: { id: testContent.id },
          data: { type: contentType.value }
        });

        if (updated.type === contentType.value) {
          console.log(`✅ Successfully updated to ${contentType.label}`);
        } else {
          console.log(`❌ Failed to update to ${contentType.label}`);
        }
      }

      // Restore original type
      await prisma.content.update({
        where: { id: testContent.id },
        data: { type: testContent.type }
      });
      console.log(`\n🔄 Restored original type: ${testContent.type}`);
    }

    // Check if there are any contents with old types that need migration
    console.log('\n📊 Checking for legacy content types...');

    const videoContents = await prisma.content.count({ where: { type: 'VIDEO' }});
    const infographicContents = await prisma.content.count({ where: { type: 'INFOGRAPHIC' }});

    if (videoContents > 0) {
      console.log(`⚠️  Found ${videoContents} VIDEO contents - consider migrating to ARTICLE or DOCUMENT`);
    }

    if (infographicContents > 0) {
      console.log(`⚠️  Found ${infographicContents} INFOGRAPHIC contents - consider migrating to DOCUMENT`);
    }

    if (videoContents === 0 && infographicContents === 0) {
      console.log('✅ No legacy content types found');
    }

    // Show content type distribution
    console.log('\n📈 Current content type distribution:');
    for (const contentType of contentTypes) {
      const count = await prisma.content.count({ where: { type: contentType.value }});
      console.log(`   ${contentType.label}: ${count} items`);
    }

    console.log('\n✅ All content type tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testContentTypes();