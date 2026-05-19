# Deployment Guide

Step-by-step instructions for deploying duskglow to production.

---

## Prerequisites

Before deploying, ensure you have:

- A [Supabase](https://supabase.com) project (free tier is sufficient to start)
- A domain name (optional but recommended)
- A static hosting account — Netlify, Vercel, or Cloudflare Pages (all have free tiers)

---

## 1. Supabase Setup

### 1.1 Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your **Project URL** and **anon/public API key** from Project Settings → API

### 1.2 Apply database migrations

Option A — Supabase CLI (recommended):

```bash
npm install -g supabase
supabase login
supabase link --project-ref YOUR_PROJECT_REF
supabase db push
```

Option B — Supabase SQL Editor:

Copy the contents of each file in `supabase/migrations/` in chronological order and run them in the Supabase dashboard SQL editor.

### 1.3 Configure Storage buckets

In the Supabase dashboard → Storage, create two public buckets:

| Bucket name | Public |
|-------------|--------|
| `avatars` | Yes |
| `review-images` | Yes |

### 1.4 Configure Auth providers

In the Supabase dashboard → Authentication → Providers:

- **Email** — enabled by default; set "Confirm email" to true for production
- **Google** — enable and provide your Google OAuth Client ID and Secret (from [Google Cloud Console](https://console.cloud.google.com))

Add your production domain to **Redirect URLs** under Authentication → URL Configuration:

```
https://yourdomain.com/
https://yourdomain.com/auth
```

---

## 2. Environment Variables

Create a `.env` file (never commit this) or configure these variables in your hosting platform's dashboard:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> **Security note:** The `VITE_` prefix exposes these variables to client-side JavaScript. The anon key is safe to expose — it is protected by Supabase Row Level Security policies. Never expose your service role key on the client.

---

## 3. Build

```bash
npm install
npm run build
```

The production build outputs to `dist/`. This directory is what you deploy.

---

## 4. Deploy

### Option A — Netlify

1. Connect your GitHub repository to Netlify
2. Set build settings:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
3. Add environment variables in Site Settings → Environment Variables
4. Deploy

To handle React Router's client-side routing, add a `public/_redirects` file:

```
/*  /index.html  200
```

### Option B — Vercel

1. Connect your GitHub repository to Vercel
2. Vercel auto-detects Vite — no extra configuration needed
3. Add environment variables in Project Settings → Environment Variables
4. Deploy

Vercel handles SPA routing automatically.

### Option C — Cloudflare Pages

1. Connect your GitHub repository to Cloudflare Pages
2. Set build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Add environment variables in Settings → Environment Variables
4. For SPA routing, add a `public/_redirects` file (same as Netlify)

### Option D — Self-hosted (nginx)

```bash
# Build
npm run build

# Copy dist/ to your web root
cp -r dist/ /var/www/duskglow/

# nginx config
server {
    listen 80;
    server_name yourdomain.com;
    root /var/www/duskglow;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|svg|ico|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Use Certbot for HTTPS:
```bash
certbot --nginx -d yourdomain.com
```

---

## 5. Post-Deployment Checklist

- [ ] Site loads at your domain
- [ ] Sign up with email works and sends confirmation email
- [ ] Google OAuth redirect lands on the correct URL
- [ ] Products load from Supabase
- [ ] Add to cart and checkout flow works
- [ ] Avatar upload works (Supabase Storage bucket configured)
- [ ] Review image upload works
- [ ] Admin panel accessible only to admin role users
- [ ] HTTPS enforced (no mixed content warnings)
- [ ] `console.log` and debug output removed or suppressed

---

## 6. Ongoing Operations

### Database backups

Supabase Pro plan includes daily automated backups. On the free tier, export your schema and data regularly from the dashboard.

### Monitoring

Consider adding:
- [Sentry](https://sentry.io) for frontend error tracking
- Supabase built-in database logs for query monitoring

### Updating dependencies

```bash
npm outdated          # Check for outdated packages
npm update            # Update within semver ranges
npm run build         # Verify build still passes after updates
```
