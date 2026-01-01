# 🚀 Vercel Deployment Guide - NicheScribe AI

## Prerequisites

Before deploying, ensure you have accounts for:
- ✅ [Vercel](https://vercel.com) - Hosting platform
- ✅ [Clerk](https://clerk.com) - Authentication
- ✅ [Neon](https://neon.tech) - PostgreSQL database
- ✅ [Stripe](https://stripe.com) - Payment processing
- ✅ [OpenAI](https://platform.openai.com) - AI content generation
- ✅ [Upstash](https://upstash.com) - Redis for rate limiting (recommended)

---

## Step 1: Prepare Your Codebase

### 1.1 Install Vercel CLI (optional but recommended)
```bash
npm i -g vercel
```

### 1.2 Verify Build Works Locally
```bash
npm install
npm run build
```

You should see output like:
```
vite v5.x.x building for production...
✓ built in XXXms
```

---

## Step 2: Set Up External Services

### 2.1 Clerk (Authentication)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Create a new application (or use existing)
3. Get your keys:
   - **API Keys** → Copy `Secret Key` (starts with `sk_live_` or `sk_test_`)
   - **API Keys** → Copy `Publishable Key` (starts with `pk_live_` or `pk_test_`)
4. Configure allowed redirect URLs:
   - Add `https://your-domain.vercel.app` to **Allowed redirect URLs**
   - Add `https://your-domain.vercel.app` to **Allowed origins**

### 2.2 Neon (Database)

1. Go to [Neon Console](https://console.neon.tech)
2. Create a new project or use existing
3. Copy the **Connection String** (starts with `postgresql://`)
4. Make sure it includes `?sslmode=require` at the end

### 2.3 Stripe (Payments)

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get API keys from **Developers** → **API keys**:
   - Copy **Secret key** (starts with `sk_live_` or `sk_test_`)
   - Copy **Publishable key** (starts with `pk_live_` or `pk_test_`)
3. Set up webhook:
   - Go to **Developers** → **Webhooks**
   - Click **Add endpoint**
   - URL: `https://your-domain.vercel.app/api/webhooks/stripe`
   - Events to listen: `checkout.session.completed`, `customer.subscription.created`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_failed`
   - Copy the **Signing secret** (starts with `whsec_`)

### 2.4 OpenAI (AI)

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)
4. **Important**: Add credits to your OpenAI account!

### 2.5 Upstash Redis (Rate Limiting - Recommended)

1. Go to [Upstash Console](https://console.upstash.com)
2. Create a new Redis database (select region close to your users)
3. Copy:
   - **UPSTASH_REDIS_REST_URL** (the HTTPS endpoint)
   - **UPSTASH_REDIS_REST_TOKEN** (the token)

---

## Step 3: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended for First Time)

1. Push your code to GitHub/GitLab/Bitbucket
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click **Add New** → **Project**
4. Import your repository
5. Configure build settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

### Option B: Deploy via CLI

```bash
vercel
```

Follow the prompts and link to your Vercel project.

---

## Step 4: Configure Environment Variables in Vercel

Go to your project in Vercel Dashboard → **Settings** → **Environment Variables**

Add the following variables (all environments: Production, Preview, Development):

### Required Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@hostname/database?sslmode=require

# Authentication (Clerk)
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx

# Payments (Stripe)
STRIPE_SECRET_KEY=sk_live_xxxxxxxxxxxxxxxxxxxxx
VITE_STRIPE_PUBLIC_KEY=pk_live_xxxxxxxxxxxxxxxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxxxxxxxxxx

# AI (OpenAI)
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxxx

# Environment
NODE_ENV=production
```

### Recommended Variables (Rate Limiting)

```bash
# Upstash Redis
UPSTASH_REDIS_REST_URL=https://xxxxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=xxxxxxxxxxxxxxxxxxxxx
```

**⚠️ IMPORTANT**: Without Upstash, rate limiting will be DISABLED. This is a security risk!

---

## Step 5: Run Database Migrations

After deploying, run migrations to create database tables:

```bash
# Install dependencies locally if not done
npm install

# Push schema to database
npm run db:push
```

You should see:
```
✓ Applying migrations...
✓ Done!
```

---

## Step 6: Verify Deployment

### 6.1 Check Build Logs
- Go to Vercel Dashboard → **Deployments** → Click latest deployment
- Verify build completed successfully (green checkmark)

### 6.2 Test Key Endpoints

Visit your deployment URL (e.g., `https://your-app.vercel.app`):

1. **Frontend loads**: Open the URL in browser
2. **Auth works**: Try signing in with Clerk
3. **API responds**: Open `https://your-app.vercel.app/api/holiday-presets` (should return JSON)

### 6.3 Test Stripe Webhook

1. Go to Stripe Dashboard → **Developers** → **Webhooks**
2. Find your webhook and click **Send test webhook**
3. Select `checkout.session.completed`
4. Check Vercel logs for successful processing

---

## Step 7: Update Stripe Product Settings (Optional)

If you want to enable actual subscriptions:

1. Go to Stripe Dashboard → **Products**
2. Create a product: "NicheScribe AI Premium"
3. Set price: €4.99/month recurring
4. Copy the Price ID
5. Update your frontend to use this Price ID when creating checkout sessions

---

## Troubleshooting

### Build Fails

**Error**: `Module not found: '@clerk/clerk-react'`
- **Fix**: Run `npm install` locally and commit `package-lock.json`

**Error**: `DATABASE_URL must be set`
- **Fix**: Add `DATABASE_URL` to Vercel environment variables

### Runtime Errors

**Error**: `Invalid token` when calling API
- **Fix**: Ensure `CLERK_SECRET_KEY` is set in Vercel
- **Fix**: Check Clerk → **API Keys** → Verify you're using the correct key

**Error**: `Webhook signature verification failed`
- **Fix**: Ensure `STRIPE_WEBHOOK_SECRET` matches the webhook in Stripe Dashboard
- **Fix**: Webhook URL must be exactly: `https://yourdomain.vercel.app/api/webhooks/stripe`

**Error**: `Too many requests` returns 429
- **Fix**: Configure Upstash Redis (rate limiting is working!)
- **Temporary workaround**: Rate limiting falls back to "allow all" if Upstash not configured

### Database Issues

**Error**: `timeout acquiring connection`
- **Fix**: Check Neon console → ensure database is active (not hibernating)
- **Fix**: Verify `DATABASE_URL` includes `?sslmode=require`

---

## Security Checklist Before Going Live

- [ ] All environment variables are set in Vercel (not hardcoded)
- [ ] Stripe webhook secret is configured
- [ ] Clerk redirect URLs include your Vercel domain
- [ ] Database connection uses SSL (`sslmode=require`)
- [ ] Upstash Redis is configured for rate limiting
- [ ] OpenAI API key has appropriate usage limits set
- [ ] Tested authentication flow end-to-end
- [ ] Tested payment flow with Stripe test cards
- [ ] Reviewed Vercel logs for errors

---

## Post-Deployment

### Monitor Your App

1. **Vercel Analytics**: Enable in Vercel Dashboard → **Analytics**
2. **Vercel Logs**: Check **Deployments** → **Functions** for real-time logs
3. **Stripe Dashboard**: Monitor payments and webhooks
4. **OpenAI Usage**: Check [OpenAI Usage Page](https://platform.openai.com/usage)

### Custom Domain (Optional)

1. Go to Vercel Dashboard → **Settings** → **Domains**
2. Add your custom domain
3. Update DNS records as instructed
4. Update Clerk allowed URLs with your custom domain
5. Update Stripe webhook URL with your custom domain

---

## Need Help?

- **Vercel Docs**: https://vercel.com/docs
- **Clerk Docs**: https://clerk.com/docs
- **Stripe Docs**: https://stripe.com/docs
- **Neon Docs**: https://neon.tech/docs

---

🎉 **Congratulations! Your app is now deployed on Vercel!**
