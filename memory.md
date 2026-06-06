# CortexCanvas Project Memory

This file serves as a persistent record of the architecture decisions, modifications, and infrastructure configuration for **CortexCanvas** to maintain consistency across future development sessions.

---

## 🚀 Deployed Production Environment
* **Platform:** Render (Free Tier - Web Service)
* **Live URL:** [https://cortex-canvas.onrender.com](https://cortex-canvas.onrender.com)
* **Architecture:** Stateless Docker Container (using `node:18-slim`)
* **Database:** Neon PostgreSQL Cloud Database
* **Object Storage:** Supabase Storage (`avatars` bucket - Public)

---

## 🛠️ Architecture & Configuration Decisions

### 1. Database (Prisma Schema)
* **File:** [schema.prisma](file:///home/ebendttl/portfolio-projects/CortexCanvas/prisma/schema.prisma)
* **Provider:** Configured to `postgresql` instead of `sqlite` for production database persistence.
* **Engine Compatibility:** Explicitly defined `binaryTargets` to support native development environments, alpine containers, and Debian slim containers:
  ```prisma
  binaryTargets = ["native", "debian-openssl-3.0.x", "linux-musl", "linux-musl-openssl-3.0.x"]
  ```

### 2. Containerization (Dockerfile)
* **File:** [Dockerfile](file:///home/ebendttl/portfolio-projects/CortexCanvas/Dockerfile)
* **Base Image:** Switched from `node:18-alpine` to `node:18-slim` (Debian-based) to resolve runtime query engine crashes caused by missing legacy Alpine shared libraries (`libssl.so.1.1`).
* **System Packages:** Added `RUN apt-get update -y && apt-get install -y openssl` to both builder and runner stages to support Prisma client execution.
* **Installer Flag:** Added `--legacy-peer-deps` to `npm install` to prevent build failures caused by React 18/19 peer dependency conflicts in Next.js 15.

### 3. Build & Static Compiling Safeguards
* **File:** [src/lib/ai.ts](file:///home/ebendttl/portfolio-projects/CortexCanvas/src/lib/ai.ts)
* **Safeguard:** Provided a mock fallback API key `"mock-api-key-for-build"` when initializing the `new OpenAI()` constructor. This prevents Next.js compiler/optimizer crashes during `next build` on Render when the actual `OPENAI_API_KEY` is not present in the build environment.

### 4. Hybrid Media Upload Strategy
* **File:** [src/app/api/profile/avatar/route.ts](file:///home/ebendttl/portfolio-projects/CortexCanvas/src/app/api/profile/avatar/route.ts)
* **Development Mode:** Writes to the local public directory.
* **Production Mode:** Detects `NEXT_PUBLIC_SUPABASE_URL` at runtime and uploads files directly to a Supabase Storage bucket named `avatars`.
* **Next.js Image Optimizations:** Updated [next.config.mjs](file:///home/ebendttl/portfolio-projects/CortexCanvas/next.config.mjs) `remotePatterns` to allow loading avatar URLs from `*.supabase.co` and `api.dicebear.com`.

### 5. Automated Startup Script
* **File:** [start.sh](file:///home/ebendttl/portfolio-projects/CortexCanvas/start.sh)
* **Actions:** Simplified entrypoint to run database schema synchronization (`npx prisma db push`) upon container launch before executing `next start`.

### 6. Unified Authentication Bridge
* **Files:** [src/app/(dashboard)/documents/actions.ts](file:///home/ebendttl/portfolio-projects/CortexCanvas/src/app/(dashboard)/documents/actions.ts) and [src/auth.ts](file:///home/ebendttl/portfolio-projects/CortexCanvas/src/auth.ts)
* **Problem:** NextAuth was configured for OAuth, but email/password registration used Supabase. This mismatch prevented database queries from resolving correctly and threw 500/unauthorized errors because Supabase users weren't in the PostgreSQL `User` table, and NextAuth session endpoint lacked a config secret.
* **Fix:**
  - Added `secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET` to the NextAuth initialization block in `src/auth.ts` to prevent runtime configuration failures.
  - Implemented a unified `getSession()` utility in `src/app/(dashboard)/documents/actions.ts` that tries NextAuth first, falls back to Supabase Auth, auto-upserts Supabase users into the PostgreSQL database, and falls back to development session on local environments.

---

## 🔑 Required Environment Variables
These are supplied dynamically at launch via Render's Blueprint (`render.yaml`):
* `DATABASE_URL`: Neon PostgreSQL connection string.
* `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (e.g. `https://your-id.supabase.co`).
* `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase public anon key.
* `NEXTAUTH_SECRET`: Secret key for authentication (generated automatically by Render).
* `NEXTAUTH_URL`: Canonical production deployment URL (`https://cortex-canvas.onrender.com`).
* `OPENAI_API_KEY`: API key for AI feature sets (optional fallback).

---

## 🔮 Future Development Recommendations
1. **Database Migrations:** As the schema grows, transition from `prisma db push` (declarative synchronization) to structured migrations (`prisma migrate dev`) for production history integrity.
2. **Supabase Bucket Security:** Ensure the `avatars` bucket remains set to **Public** in the Supabase Storage console.
