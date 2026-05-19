# Changelog

All notable changes to duskglow will be documented in this file.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added
- Floating label animations on all form inputs — labels now float to the top of the input on focus or when filled, providing clear affordance and a polished premium feel
- `FloatingLabelInput` component: drop-in replacement for `Input` + `Label` pairs, supports left icons and right action slots
- `FloatingLabelTextarea` component: same floating label behavior for multi-line review text areas
- Comprehensive README with full feature list, quick start, tech stack table, and project structure
- `DEPLOYMENT_GUIDE.md`: step-by-step production deployment for Netlify, Vercel, and self-hosted environments
- `CHANGELOG.md`: per revvel-standards, tracking all significant changes
- `GO_TO_MARKET.md`: market research, competitive analysis, and launch strategy

### Changed
- Auth page (login, signup, forgot password, reset password) — all inputs migrated to FloatingLabelInput; password fields retain eye toggle and "Forgot password?" link
- Profile page — email and display name inputs migrated to FloatingLabelInput
- ReviewForm — review title migrated to FloatingLabelInput; review body migrated to FloatingLabelTextarea

---

## [1.0.0] — 2026-01-06

### Added
- Full e-commerce product catalog with categories (Lighting, Organizers, Comfort, Bundles)
- Product detail pages with image gallery, variant selector, and quantity control
- Real-time inventory indicators (in stock / low stock / out of stock) via Supabase
- Persistent shopping cart with CartContext and CartDrawer
- Wishlist with WishlistContext
- User authentication: email/password and Google OAuth via Supabase Auth
- Forgot password + reset password flows
- User profile page with avatar upload to Supabase Storage
- Order history page
- Star-rated product reviews with photo upload (up to 4 images)
- Review editing and deletion
- Live search dialog with keyboard navigation, recent searches, and product thumbnails
- Sanctuary Quiz — 5-question personalization quiz recommending a desk archetype with product suggestions
- Admin panel: product management, category management, inventory management, order management, review moderation
- Dark mode support via CSS custom properties
- Dreamy Sanctuary color system: blush, lavender, cream, sage, plum
- Cormorant Garamond serif + Outfit sans-serif typography
- Custom animations: fadeInUp, shimmer, float, glow, slide-in
- Supabase Row Level Security policies on all tables
- Email verification banner for unverified accounts
- Newsletter subscription section
- Related products section on product detail page
- Responsive layout for mobile, tablet, and desktop
- 404 Not Found page

---

[Unreleased]: https://github.com/midnghtsapphire/cozy-haven-hub/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/midnghtsapphire/cozy-haven-hub/releases/tag/v1.0.0
