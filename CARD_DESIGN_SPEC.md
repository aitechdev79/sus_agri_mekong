# Mission Vision Cards Design Specification

## Overview
This document describes the design specification for the three feature cards in the Mission Vision section of the main page (AboutSection component).

## Card Structure

### Layout
- **Grid System**: 3 columns on desktop (`md:grid-cols-3`), 1 column on mobile
- **Gap**: 32px between cards (`gap-8`)
- **Alignment**: Cards aligned at bottom (`items-end`) to ensure border rules align
- **Container**: Flexbox layout (`flex flex-col`) to maintain equal heights

### Image Container
- **Aspect Ratio**: 4:3 (`aspect-[4/3]`)
- **Corners**: Sharp edges (no rounded corners)
- **Overlay**: None - clean image display
- **Spacing**: 16px margin below image (`mb-4`)
- **Overflow**: Hidden to contain zoom effect

### Text Content Area
- **Minimum Height**: 120px to ensure alignment across all cards
- **Padding Bottom**: 16px (`pb-4`)
- **Layout**: Flexbox column with flex-1 for consistent sizing

### Typography

#### Title
- **Font Family**: Montserrat
- **Font Size**:
  - Mobile: `text-lg` (18px)
  - Desktop: `text-xl` (20px)
- **Font Weight**: Bold (700)
- **Color**: Deep Charcoal `#3C3C3B`
- **Margin Bottom**: 8px (`mb-2`)

#### Description
- **Font Family**: Montserrat
- **Font Size**:
  - Mobile: `text-sm` (14px)
  - Desktop: `text-base` (16px)
- **Color**: Gray `#6B7280`
- **Layout**: Flex-1 to fill available space

## Border Design

### Base Border (Always Visible)
- **Position**: Bottom of card
- **Width**: Full width
- **Height**: 2px (`h-0.5`)
- **Color**: Light Green `#E8F5E9` (vn-green-light)

### Animated Border (Hover State)
- **Position**: Overlays base border at bottom
- **Initial Width**: 0
- **Hover Width**: 100% (full width)
- **Height**: 2px (`h-0.5`)
- **Color**: Dark Green `#0A7029` (vn-green)
- **Animation**: Left-to-right sweep
- **Duration**: 500ms
- **Easing**: `ease-out`

## Hover Effects

### Image
- **Transform**: Scale up to 110% (`group-hover:scale-110`)
- **Duration**: 500ms
- **Effect**: Smooth zoom confined within image container

### Card Container
- **Movement**: None - card stays in place
- **Shadow**: None
- **Transform**: None

### Text
- **Position**: Fixed - no movement
- **Color**: No change
- **Opacity**: No change

### Border
- **Animation**: Sweeps from left to right
- **Color Transition**: Light green → Dark green
- **Creates a subtle, elegant interaction**

## Color Palette

### Primary Colors Used
- **Deep Charcoal** (Text): `#3C3C3B`
- **Gray** (Description): `#6B7280`
- **Light Green** (Base Border): `#E8F5E9`
- **Dark Green** (Hover Border): `#0A7029`

## Accessibility

### Semantic HTML
- Uses `<Link>` for navigation
- Proper `aria-label` with card title and description
- Semantic heading hierarchy with `<h3>` for titles

### Keyboard Navigation
- Fully keyboard accessible via Link component
- Focus states inherit from Next.js Link defaults

## Responsive Behavior

### Mobile (< 768px)
- Single column layout
- Cards stack vertically
- Same hover effects apply
- Smaller font sizes

### Desktop (≥ 768px)
- Three column grid layout
- Cards side-by-side
- Border rules align horizontally
- Larger font sizes

## Implementation Notes

### Key Features
1. **Equal Height Cards**: Achieved through flexbox with `flex-1` and `minHeight`
2. **Aligned Border Rules**: Grid uses `items-end` alignment
3. **Zoom Contained**: Image overflow is hidden, zoom stays within bounds
4. **Progressive Border**: Two-layer border system (base + animated overlay)
5. **No External Dependencies**: Pure CSS transitions, no animation libraries

### Performance Considerations
- Image optimization via Next.js Image component
- CSS transitions (hardware accelerated)
- No JavaScript for hover effects
- Lazy loading for images with proper sizes attribute

## File Location
**Component**: `src/components/AboutSection.tsx`
**Lines**: 120-160 (Info Cards Section)

## Design Philosophy
The design follows a clean, magazine-style layout:
- **Minimalist**: No unnecessary decorations or overlays
- **Content-First**: Image and text clearly separated
- **Subtle Interactions**: Refined hover effects that enhance without distracting
- **Consistent**: All cards maintain the same dimensions and spacing
- **Elegant**: Progressive border animation adds sophistication

## Future Enhancements (Optional)
- Add fade-in animation on scroll
- Consider adding subtle box shadow on hover
- Implement skeleton loading states
- Add transition for title color on hover
