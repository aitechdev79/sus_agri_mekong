# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Next.js 15 application called "Good Practices Platform" (Nền Tảng Tư Liệu Hóa) - a Vietnamese language platform for sharing and learning good practices in shrimp and rice value chains. The app uses:

- **Next.js 15** with App Router and React 19
- **TypeScript** with strict type checking
- **Prisma ORM** with SQLite database (SQLite for dev, consider PostgreSQL for production)
- **NextAuth.js v4** for authentication with JWT strategy
- **Tailwind CSS v4** for styling
- **next-intl** for internationalization (Vietnamese primary)

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting (ESLint v9 with Next.js config)
npm run lint

# TypeScript compilation check
npx tsc --noEmit

# Combined pre-commit checks
npm run lint && npx tsc --noEmit && npm run build
```

## Database Management

The application uses Prisma with SQLite:

```bash
# Generate Prisma client after schema changes
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Reset database
npx prisma migrate reset

# View database in Prisma Studio
npx prisma studio
```

## Architecture Overview

### Authentication System
- Uses NextAuth.js with credentials provider
- Custom auth configuration in `src/lib/auth.ts`
- Role-based access control (USER, MODERATOR, ADMIN)
- Phone number verification with OTP system
- Auth provider wrapper in `src/providers/auth-provider.tsx`

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
- `/src/lib/` - Utility libraries (auth, database, file upload, OTP)
- `/src/components/` - Reusable UI components
- `/src/providers/` - React context providers
- `/src/types/` - TypeScript type definitions
- `/prisma/` - Database schema and migrations
- `/public/uploads/` - User uploaded files

### API Routes
Key API endpoints:
- `/api/auth/*` - Authentication (NextAuth, registration, OTP verification)
- `/api/content/*` - Content CRUD operations
- `/api/upload/*` - File upload handling
- `/api/admin/*` - Admin-only operations
- `/api/analytics` - Event tracking

### Content Management
The platform supports multiple content types (ARTICLE, VIDEO, INFOGRAPHIC, DOCUMENT, STORY, GUIDE, POLICY) with:
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
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

Optional services (for full functionality):
- **SMS/OTP**: Twilio credentials for phone verification
- **Email**: SMTP settings for notifications
- **File Upload**: Upload directory and size limits

## Testing and Quality Assurance

Before committing changes, always run:
```bash
npm run lint           # Check code style
npx tsc --noEmit      # Type checking
npm run build         # Ensure build passes
```

## Important Technical Details

- **React/Next.js Version**: Uses React 19 with Next.js 15 and experimental SWC transforms
- **Locale Configuration**: App is configured for Vietnamese locale (`lang="vi"`) with next-intl support
- **Database**: Uses SQLite for development (file:./dev.db), consider PostgreSQL for production
- **File Storage**: Uploads stored in `/public/uploads/` directory with multer integration
- **Authentication**: NextAuth.js v4 with JWT strategy, custom sign-in page at `/auth/signin`, and OTP verification
- **Image Handling**: Configured for Vietnamese media domains (vnmediacdn.com, vnexpress.net, tuoitre.vn, thanhnien.vn) plus common services
- **Webpack Config**: Includes fallbacks for Node.js modules (fs, net, tls disabled for browser compatibility)
- **API Structure**: RESTful API with role-based access control and comprehensive error handling
- **Internationalization**: Primary Vietnamese with optional English content support
- **TypeScript Paths**: Uses `@/*` alias for `./src/*` imports
- **ESLint**: Uses ESLint v9 with Next.js configuration
- **Tailwind**: Uses Tailwind CSS v4 with PostCSS integration

## Content Management Workflow

The platform implements a complete content lifecycle:
1. **Content Creation**: Authors create content with multiple supported types
2. **Submission System**: Users can submit content for review via UserSubmission model
3. **Moderation**: Moderators review submissions (PENDING → APPROVED/REJECTED/NEEDS_REVISION)
4. **Publishing**: Approved content moves through status workflow (DRAFT → PUBLISHED → ARCHIVED)
5. **Analytics**: Track views, downloads, and user interactions
6. **User Engagement**: Comments (with approval), bookmarks, and notifications