# Hero Section Images

This directory contains the background images for the hero section of the homepage.

## Current Structure

```
public/hero/
├── hero-main.jpg       # Desktop hero image (1920x1080 or larger)
├── hero-mobile.jpg     # Mobile hero image (768x1024 or larger)
└── README.md          # This file
```

## Adding New Hero Images

### 1. Image Requirements
- **Format**: JPG, PNG, or SVG
- **Resolution**: Minimum 1920x1080 (Full HD)
- **Aspect Ratio**: 16:9 recommended
- **File Size**: Optimize for web (< 500KB recommended)

### 2. Naming Convention
- Use descriptive names with hyphens: `hero-[topic].jpg`
- Examples: `hero-shrimp-farming.jpg`, `hero-sustainable-agriculture.jpg`

### 3. Adding Images to the Component

Edit `/src/components/HeroSection.tsx` and add your image to the `heroImages` array:

```typescript
const heroImages = [
  {
    src: '/hero/hero-main.svg',
    alt: 'Nuôi tôm bền vững',
    fallback: '/uploads/hero.jpg'
  },
  {
    src: '/hero/your-new-image.jpg',  // Add your new image here
    alt: 'Your image description',
    fallback: '/uploads/hero.jpg'
  }
];
```

### 4. Image Optimization Tips

- **WebP Format**: Consider using WebP for better compression
- **Responsive Images**: Create multiple sizes for different devices
- **Alt Text**: Always provide descriptive alt text for accessibility

### 5. Current Placeholder Images

The current SVG files are placeholders. Replace them with actual photos of:
- Shrimp farming operations
- Rice cultivation fields
- Modern agricultural technology
- Sustainable farming practices

### 6. Fallback Image

The component includes a fallback system that uses `/uploads/hero.jpg` if the primary image fails to load.

## Technical Details

- Images are loaded using Next.js Image component for optimization
- Auto-rotation every 5 seconds
- Clickable indicators for manual navigation
- Smooth transitions between images
- Responsive design for all screen sizes