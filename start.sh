#!/bin/sh

# Ensure persistent directories exist
mkdir -p /data/uploads/avatars

# Create symlink from persistent path to public static assets folder
rm -rf /app/public/uploads/avatars
mkdir -p /app/public/uploads
ln -sf /data/uploads/avatars /app/public/uploads/avatars
echo "🔗 Created symlink: /app/public/uploads/avatars -> /data/uploads/avatars"

# Sync SQLite DB schema on the persistent disk
echo "📦 Running database schema sync..."
npx prisma db push

# Start Next.js server in production
echo "🚀 Starting Next.js Web Service..."
exec npm run start
