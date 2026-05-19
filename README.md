# duskglow ✨

**A curated cozy desk essentials marketplace** — where ambient lighting, tactile organizers, and comfort accessories meet a dreamy sanctuary aesthetic.

[![MIT License](https://img.shields.io/badge/license-MIT-blush)](LICENSE)
[![React](https://img.shields.io/badge/React-18-lavender)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-Backend-green)](https://supabase.com)

---

## What is duskglow?

duskglow is a full-stack e-commerce experience for desk sanctuary enthusiasts — those who believe a thoughtfully curated workspace transforms how they think, create, and rest. The platform sells ambient lamps, textured organizers, scented candles, comfort accessories, and curated bundles.

Built on Vite + React + TypeScript with a Supabase backend, duskglow is production-ready, fully responsive, and ships with dark mode, animated UI, personalization quiz, and a complete admin panel.

---

## Features

### 🛍️ Shopping Experience
- **Curated product catalog** with categories: Lighting, Organizers, Comfort, Bundles
- **Product variants** — color and style options per product
- **Quick Add** from the shop grid, full detail page with image gallery
- **Real-time inventory indicators** — in stock / low stock / out of stock
- **Persistent cart** with quantity controls, live subtotal
- **Wishlist** — save favorites, sync across sessions

### 🧠 Personalization
- **Sanctuary Quiz** — 5-question quiz that recommends a sanctuary archetype (Cozy Gamer, Soft Study, Night Owl) with product suggestions

### 👤 Auth & Profiles
- Email/password sign-up and sign-in with validation
- Google OAuth
- Forgot/reset password flow via email
- Floating-label animated form inputs
- User profile with avatar upload (Supabase Storage)

### ⭐ Reviews
- Star ratings + text reviews
- Photo upload on reviews (up to 4 images)
- Helpful vote counter
- Edit/delete own reviews

### 🔍 Search
- Live search dialog with keyboard navigation (↑↓ Enter Esc)
- Recent searches (persisted to localStorage)
- Popular searches
- Product image thumbnails in results

### 🔧 Admin Panel
- Product management (create, edit, archive)
- Category management
- Inventory management (per-variant stock levels)
- Order management
- Review moderation

### 🎨 Design System
- Custom "Dreamy Sanctuary" color palette (blush, lavender, cream, sage, plum)
- Cormorant Garamond serif + Outfit sans-serif typography
- Dark mode support
- Smooth animations: fade-in-up, float, shimmer, glow
- Tailwind CSS + shadcn/ui components

---

## Quick Start

### Prerequisites
- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) project

### 1. Clone & install

```bash
git clone https://github.com/midnghtsapphire/cozy-haven-hub.git
cd cozy-haven-hub
npm install
```

### 2. Configure environment variables

Copy the example and fill in your Supabase credentials:

```bash
cp .env.example .env
```

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Set up the database

Apply all migrations using the Supabase CLI:

```bash
npx supabase db push
```

Or apply the SQL files in `supabase/migrations/` in order via the Supabase dashboard SQL editor.

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite dev server with HMR |
| `npm run build` | Build for production |
| `npm run build:dev` | Build with development mode settings |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + Vite 5 |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 3 + shadcn/ui |
| Routing | React Router v6 |
| Forms | React Hook Form + Zod |
| Backend | Supabase (Auth, Database, Storage, RLS) |
| Data Fetching | TanStack Query v5 |
| Animations | tailwindcss-animate + custom keyframes |
| Icons | Lucide React |

---

## Project Structure

```
src/
├── components/
│   ├── ui/           # shadcn/ui base components + floating-label inputs
│   ├── product/      # ProductGallery, ProductInfo, Reviews, ReviewForm
│   ├── quiz/         # Sanctuary quiz components
│   ├── admin/        # Admin panel sub-components
│   └── ...           # Navbar, Footer, CartDrawer, etc.
├── contexts/         # AuthContext, CartContext, WishlistContext
├── hooks/            # useProducts, useInventory, useOrders, etc.
├── integrations/     # Supabase client
├── pages/            # Route-level pages
└── data/             # Static product seed data
supabase/
├── migrations/       # Database schema migrations
└── config.toml
```

---

## Deployment

See [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md) for full step-by-step production deployment instructions.

**Supported platforms:** Netlify, Vercel, Cloudflare Pages, or any static host.

---

## Brand & Security

- [BRAND_GUIDELINES.md](BRAND_GUIDELINES.md) — color palette, typography, voice, photography, do's & don'ts
- [SECURITY.md](SECURITY.md) — vulnerability reporting and security architecture

---

## License

MIT © Audrey Evans / MIDNGHTSAPPHIRE

