#!/bin/sh

# Sync database schema (e.g. Postgres on Neon/Supabase)
echo "📦 Running database schema sync..."
npx prisma db push

# Start Next.js server in production
echo "🚀 Starting Next.js Web Service..."
exec npm run start
