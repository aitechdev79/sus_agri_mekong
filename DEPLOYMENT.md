# Vercel Deployment Guide for Good Practices Platform

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **PostgreSQL Database**: Set up a production database (recommended providers below)
3. **GitHub Repository**: Push your code to GitHub

## Step 1: Set Up Production Database

### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Create a new project or select existing
3. Go to Storage → Create Database → Postgres
4. Copy the connection string provided

### Option B: Railway (Free tier available)
1. Go to [railway.app](https://railway.app)
2. Create new project → Add PostgreSQL
3. Copy the connection string from Variables tab

### Option C: Supabase (Free tier available)
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database → Connection string

## Step 2: Deploy to Vercel

### Method 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
vercel

# Follow prompts:
# - Link to existing project? No
# - Project name: good-practices-platform
# - Directory: ./
# - Override settings? No
```

### Method 2: GitHub Integration
1. Push code to GitHub repository
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repository
4. Configure project settings (keep defaults)
5. Deploy

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to Settings → Environment Variables and add:

```
DATABASE_URL=postgresql://username:password@host:5432/database
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=your-production-secret-minimum-32-characters
```

Optional variables:
```
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token
TWILIO_PHONE_NUMBER=your-twilio-number
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@goodpractices.vn
```

## Step 4: Set Up Database Schema

After deployment, run these commands to set up your production database:

```bash
# Set your DATABASE_URL environment variable locally for migration
export DATABASE_URL="your-production-database-url"

# Run migrations
npx prisma migrate deploy

# Seed the database with initial content
npm run db:seed
```

## Step 5: Verify Deployment

1. Visit your Vercel app URL
2. Check that content loads properly
3. Test user registration/login
4. Verify admin functionality with:
   - Email: an.nguyen@example.com
   - Password: password123

## Important Notes

### Database Persistence
- ✅ PostgreSQL ensures all data persists between deployments
- ✅ User content, comments, and uploads are preserved
- ✅ Database schema updates are handled via migrations

### File Uploads
- Vercel has read-only filesystem except for `/tmp`
- For persistent file uploads, consider:
  - Vercel Blob Storage
  - AWS S3
  - Cloudinary
  - Or update upload handling to use external storage

### Environment Management
- Development: Uses SQLite (`.env.local`)
- Production: Uses PostgreSQL (Vercel env vars)
- Prisma automatically handles database differences

## Troubleshooting

### Common Issues:

1. **Build Fails**: Ensure all dependencies are in `package.json`
2. **Database Connection**: Verify `DATABASE_URL` format and credentials
3. **NextAuth Errors**: Ensure `NEXTAUTH_URL` matches your domain exactly
4. **Missing Content**: Run `npm run db:seed` after migration

### ⚠️ **CRITICAL: Environment variable not found: DATABASE_URL**

If you see this error in Vercel logs:
```
Error [PrismaClientInitializationError]:
Invalid prisma.content.findMany() invocation:
error: Environment variable not found: DATABASE_URL.
```

**Immediate Fix Steps:**
1. Go to your Vercel project dashboard
2. Click **Settings** → **Environment Variables**
3. Add `DATABASE_URL` with your PostgreSQL connection string
4. **Important**: Add for all environments (Production, Preview, Development)
5. Click **Redeploy** to apply the changes

**Database URL Format:**
```
postgresql://username:password@hostname:port/database_name?sslmode=require
```

**Quick Database Setup Options:**

### Option 1: Neon PostgreSQL (Recommended - Free)
1. Go to [console.neon.tech/signup](https://console.neon.tech/signup)
2. Sign up with GitHub or email
3. Create a new project (name: `good-practices-platform`)
4. Copy the connection string from the dashboard
   Format: `postgresql://username:password@host/database?sslmode=require`

### Option 2: Supabase (Free)
- **Supabase** (Free): https://supabase.com - Full backend platform

### Option 3: Railway (Free tier)
- **Railway** (Free tier): https://railway.app - Simple deployment

### Build Commands:
- Build: `prisma generate && next build`
- Start: `next start`
- Install: `npm install && prisma generate`

## Post-Deployment

1. **Custom Domain**: Add your domain in Vercel project settings
2. **Analytics**: Enable Vercel Analytics for usage insights
3. **Monitoring**: Set up error tracking and performance monitoring
4. **Backups**: Configure regular database backups

Your Good Practices Platform will be live at: `https://your-app-name.vercel.app`