# Vercel Deployment Guide

## Quick Deploy (2 minutes)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click "Import Git Repository"
3. Select `ai-budgeting-app` from your GitHub repos
4. Click "Deploy"

That's it! Your waitlist will be live at `https://your-app-name.vercel.app`

## Environment Variables (Required for full app)

After deployment, go to Project Settings → Environment Variables and add:

| Variable | Value | Where to get it |
|----------|-------|-----------------|
| `DATABASE_URL` | `postgresql://...` | [Get from Supabase](https://supabase.com) - Settings → Database → Connection String |
| `JWT_SECRET` | Any random string | Make one up: `my-secret-key-12345` |
| `NODE_ENV` | `production` | Just type this |
| `JWT_EXPIRES_IN` | `7d` | Just type this |
| `FRONTEND_URL` | Your Vercel URL | Will be shown after first deploy |

## Supabase Setup (Optional - for database)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Get connection string from Settings → Database
4. Add to Vercel environment variables
5. Redeploy

## What works without setup:
- ✅ Waitlist page

## What needs Supabase:
- User registration/login
- File uploads
- Transaction processing
