# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in duskglow, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Contact: open a [private security advisory](https://github.com/midnghtsapphire/cozy-haven-hub/security/advisories/new) on this repository.

Please include:
- A description of the vulnerability
- Steps to reproduce it
- The potential impact
- Any suggested mitigation (optional but appreciated)

We will acknowledge your report within **48 hours** and aim to provide a resolution timeline within **7 days** for critical issues.

---

## Supported Versions

| Version | Supported |
|---------|-----------|
| `main` branch | ✅ Actively maintained |
| Tagged releases | ✅ Critical fixes backported |
| Forks / derivatives | ❌ Not supported |

---

## Security Architecture

### Authentication

- **Supabase Auth** handles all authentication — email/password and Google OAuth
- Passwords are never stored in the duskglow application; they are managed entirely by Supabase's bcrypt-based password hashing
- JWT tokens are issued by Supabase and validated on every authenticated request via Row Level Security
- Password reset flows use time-limited, single-use tokens sent to the verified email address
- Email verification is required before sensitive actions (order placement, profile changes)

### Data Access — Row Level Security

All Supabase tables are protected by **Row Level Security (RLS) policies**:

- Users can only read/write their own profile data, orders, and wishlist
- Product catalog and categories are read-only to authenticated and anonymous users
- Reviews are readable by all; writable only by the authenticated review owner
- Admin-only operations (product management, order management, inventory) are gated by the `admin` role claim in the user's JWT

### API Keys

- The Supabase `anon` key is intentionally client-facing — it is safe to expose because all access is governed by RLS policies on the database
- The Supabase `service_role` key is **never exposed to the client**; it is server-only and must never be committed to the repository or included in any client-side build
- Environment variables prefixed with `VITE_` are included in the client bundle — only keys safe for public exposure should use this prefix

### Input Validation

- Form inputs use **React Hook Form + Zod** for client-side schema validation
- All database writes go through Supabase's parameterized query interface — direct SQL injection is not possible through the client SDK
- File uploads (avatars, review images) are restricted by MIME type and file size on both client and Supabase Storage policy

### Content Security

- Supabase Storage buckets (`avatars`, `review-images`) are configured as public-read — do not store sensitive files in these buckets
- Uploaded images are served through Supabase's CDN; original filenames are replaced with UUIDs on upload
- Review content is rendered via React's JSX (auto-escaped) — raw HTML is not rendered from user content

### HTTPS

- All production deployments must be served over HTTPS
- Never deploy to an HTTP-only origin in production
- Supabase connections always use TLS

---

## Dependency Security

Dependencies are managed with npm. To audit for known vulnerabilities:

```bash
npm audit
```

To fix automatically-resolvable issues:

```bash
npm audit fix
```

We aim to keep all dependencies up to date and address critical CVEs within 7 days of disclosure.

---

## Known Security Scope

The following are **in scope** for security reports:
- Authentication bypass or session hijacking
- Privilege escalation (accessing admin features as a regular user)
- Data exposure (accessing another user's orders, profile, or wishlist)
- Stored or reflected XSS vulnerabilities
- CSRF vulnerabilities on state-changing actions
- Insecure direct object references

The following are **out of scope**:
- Supabase platform vulnerabilities (report these to [Supabase Security](https://supabase.com/docs/company/security))
- Social engineering attacks
- Physical security
- Denial of service attacks
- Issues in outdated browsers (IE, legacy Safari)

---

*Maintained by MIDNGHTSAPPHIRE.*
