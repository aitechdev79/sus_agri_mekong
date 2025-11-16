# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application called "Good Practices Platform" (Nền Tảng Tư Liệu Hóa) - a bilingual platform for sharing and learning good practices in shrimp and rice value chains. The app uses:

- **Next.js 15** with App Router and React 19
- **TypeScript** with strict type checking
- **Prisma ORM** with PostgreSQL database (configured for production, can use SQLite for local dev)
- **NextAuth.js v4** for authentication with JWT strategy
- **next-intl** for internationalization (Vietnamese and English locales)
- **Tailwind CSS v4** for styling

## Development Commands

```bash
# Development server
npm run dev

# Build for production (includes Prisma generate)
npm run build

# Start production server
npm start

# Run linting (ESLint v9 with Next.js config)
npm run lint

# TypeScript compilation check
npx tsc --noEmit

# Database migration for deployment
npm run db:migrate

# Seed database with sample data
npm run db:seed

# Admin user management
npm run db:reset-admin     # Reset admin password
npm run db:ensure-admin    # Ensure admin user exists

# Combined pre-commit checks
npm run lint && npx tsc --noEmit && npm run build
```

## Database Management

The application uses Prisma with PostgreSQL (configured by default). You can switch to SQLite for local development by changing DATABASE_URL:

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Run database migrations (development)
npx prisma migrate dev

# Deploy migrations (production)
npx prisma migrate deploy

# Reset database (use with caution - dangerous operation)
PRISMA_USER_CONSENT_FOR_DANGEROUS_AI_ACTION="yes" npx prisma migrate reset --force

# View database in Prisma Studio
npx prisma studio

# Seed database with sample data
node scripts/seed.js
```

## Architecture Overview

### Authentication System
- Uses NextAuth.js with credentials provider
- Custom auth configuration in `src/lib/auth.ts`
- Role-based access control (USER, MODERATOR, ADMIN)
- Phone number verification with OTP system
- Auth provider wrapper in `src/providers/auth-provider.tsx`
- Middleware-based route protection in `src/middleware.ts` with role-based guards
- Public routes: `/`, `/auth/*`, `/about-us`, `/join-us`, `/members`, `/news`, `/stories`, `/library`, `/content/*`, `/guidance-policy`
- Protected routes: `/admin/*` (ADMIN/MODERATOR only)

### Database Schema
The Prisma schema defines a comprehensive content management system with:
- **Users**: Registration with email/phone, role-based permissions (USER, MODERATOR, ADMIN), province/organization tracking
- **Content**: Multi-type content with 8 types (ARTICLE, VIDEO, INFOGRAPHIC, DOCUMENT, STORY, GUIDE, POLICY, NEWS)
- **Comments**: Threaded commenting system with approval workflow
- **Submissions**: User-submitted content with review workflow (PENDING → APPROVED/REJECTED/NEEDS_REVISION)
- **Analytics**: Event tracking for content interactions and metadata
- **Notifications**: System and user notifications with scheduling support
- **OTP Verification**: Phone number verification system
- **Bookmarks**: User content bookmarking functionality

### File Structure
- `/src/app/` - Next.js App Router pages and API routes
  - `/[locale]/` - Internationalized routes for Vietnamese and English
  - `/api/` - API endpoints for CRUD operations, auth, and file uploads
- `/src/lib/` - Utility libraries (auth, database, file upload, OTP)
- `/src/components/` - Reusable UI components
- `/src/providers/` - React context providers
- `/src/types/` - TypeScript type definitions
- `/src/middleware.ts` - NextAuth middleware for route protection
- `/prisma/` - Database schema and migrations
- `/public/uploads/` - User uploaded files
- `/scripts/` - Database seeding and admin management scripts

### API Routes
Key API endpoints:
- `/api/auth/*` - Authentication (NextAuth, registration, OTP verification)
- `/api/content/*` - Content CRUD operations
- `/api/upload/*` - File upload handling
- `/api/admin/*` - Admin-only operations
- `/api/analytics` - Event tracking

### Content Management
The platform supports multiple content types (ARTICLE, VIDEO, INFOGRAPHIC, DOCUMENT, STORY, GUIDE, POLICY, NEWS) with:
- Bilingual content (Vietnamese primary, English optional)
- File attachments with type validation
- Category-based organization
- Tag system
- View/download analytics
- Publishing workflow (DRAFT → PUBLISHED → ARCHIVED)

### Key Features
- User registration with phone verification
- Content submission and moderation workflow
- Bookmarking system
- Role-based content management
- File upload with multer integration
- Responsive design with Tailwind CSS

## Environment Setup

Copy `.env.example` to `.env.local` and configure required environment variables:
```bash
cp .env.example .env.local
```

Key variables for local development:
```
DATABASE_URL="file:./dev.db"  # SQLite for development
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

For production deployment (PostgreSQL):
```
DATABASE_URL="postgresql://username:password@localhost:5432/good_practices_db"
```

Optional services (for full functionality):
- **SMS/OTP**: Twilio credentials for phone verification
- **Email**: SMTP settings for notifications
- **File Upload**: Upload directory and size limits
- **Admin Settings**: Admin email configuration

## Testing and Quality Assurance

Before committing changes, always run:
```bash
npm run lint           # Check code style
npx tsc --noEmit      # Type checking
npm run build         # Ensure build passes
```

## Important Technical Details

- **React/Next.js Version**: Uses React 19 with Next.js 15 and experimental SWC transforms
- **Internationalization**: Bilingual support (Vietnamese and English) using next-intl
  - Routes structured as `/[locale]/*` for language-specific pages
  - Default locale is Vietnamese
- **Database**: Uses PostgreSQL by default (can use SQLite for local dev with DATABASE_URL="file:./dev.db")
- **File Storage**: Uploads stored in `/public/uploads/` directory with multer integration
- **Authentication**: NextAuth.js v4 with JWT strategy, custom sign-in page at `/auth/signin`, and OTP verification
- **Route Protection**: Next-auth middleware in `src/middleware.ts` handles authentication and role-based authorization
- **Image Optimization**:
  - Configured for Vietnamese media domains (vnmediacdn.com, vnexpress.net, tuoitre.vn, thanhnien.vn)
  - Supports common image services (Unsplash, Google Drive, GitHub, CloudFlare)
  - SVG support enabled with content security policy
- **Webpack Config**: Includes fallbacks for Node.js modules (fs, net, tls disabled for browser compatibility)
- **API Structure**: RESTful API with role-based access control and comprehensive error handling
- **TypeScript Paths**: Uses `@/*` alias for `./src/*` imports
- **ESLint**: Uses ESLint v9 with Next.js configuration
- **Tailwind**: Uses Tailwind CSS v4 with PostCSS integration (no separate config file - uses @tailwindcss/postcss)

## Content Management Workflow

The platform implements a complete content lifecycle:
1. **Content Creation**: Authors create content with multiple supported types
2. **Submission System**: Users can submit content for review via UserSubmission model
3. **Moderation**: Moderators review submissions (PENDING → APPROVED/REJECTED/NEEDS_REVISION)
4. **Publishing**: Approved content moves through status workflow (DRAFT → PUBLISHED → ARCHIVED)
5. **Analytics**: Track views, downloads, and user interactions
6. **User Engagement**: Comments (with approval), bookmarks, and notifications

## Common Development Tasks

### Database Seeding
The project includes a comprehensive seed script for development:
```bash
# Seed database with sample users and content
npm run db:seed

# Reset and reseed database
npx prisma migrate reset && npm run db:seed
```

### Running tests
The project doesn't have a test suite configured yet. When implementing tests, consider:
```bash
# Install testing dependencies first
npm install --save-dev jest @testing-library/react @testing-library/jest-dom

# Run tests (after setup)
npm test
```

### Creating new API endpoints
Follow the existing pattern in `/src/app/api/`:
1. Create route file: `route.ts` in appropriate directory
2. Implement HTTP methods (GET, POST, PUT, DELETE)
3. Add authentication check using `getServerSession(authOptions)`
4. Include proper error handling and validation

### Adding new content types
To add a new content type:
1. Update Prisma schema enum `ContentType` in `/prisma/schema.prisma`
2. Run `npx prisma migrate dev` to update database
3. Update TypeScript types in `/src/types/`
4. Add corresponding UI components and API handlers