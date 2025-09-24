#!/bin/bash
echo "Setting up production database..."

# Set your DATABASE_URL here (replace with your actual Neon connection string)
export DATABASE_URL="postgresql://username:password@ep-xxx.region.aws.neon.tech/database_name?sslmode=require"

echo "Generating Prisma client..."
npx prisma generate

echo "Deploying database schema..."
npx prisma migrate deploy

echo "Seeding database with initial content..."
npm run db:seed

echo "Production database setup complete!"
echo "Visit your Vercel app URL to test the deployment."