# System Overview — Coop Platform

How the system is built, the technology it uses, and how the business flows work.

---

## 1. Technology Stack

| Layer | Choice | Notes |
|-------|--------|-------|
| **Framework** | Next.js (App Router) | React Server Components by default; client components only where interactivity is needed. |
| **Language** | TypeScript | Strict typing across the codebase. |
| **UI** | Tailwind CSS v4 | Utility-first; design tokens defined as CSS variables in `globals.css`. |
| **Fonts** | Fraunces (serif display), Inter (sans), IBM Plex Mono (data) | Loaded via `next/font`. |
| **Database** | SQLite (via Prisma ORM) | File-based `coop_dev.db`; `prisma/schema.prisma` defines all models. Easy to swap to Postgres later. |
| **Auth** | NextAuth (Auth.js) | Two Credentials providers: `member-login` (phone) and `admin-login` (email). JWT sessions, 8h timeout. |
| **Password security** | bcrypt | Hashes stored as `passwordHash`; never plaintext. |
| **Payments** | MTN Mobile Money API | Custom `MTNMoMoProvider` with sandbox + production environments; initiate / status / webhook routes. |
| **Rate limiting** | In-house utility (`lib/rate-limit.ts`) | Protects sensitive endpoints. |
| **Styling system** | Global CSS component classes + Tailwind | `.glass`, `.glass-card`, `.panel-accent`, `.panel-brand`, `.reveal`, `.surface`, status badges, etc. |

---

## 2. Architecture

```
src/
├── app/
│   ├── (marketing)/      # Public site: home, about, produce, news, gallery, contact
│   ├── (shop)/           # E-commerce: produce/[id], cart, checkout  (layout currently pass-through)
│   ├── portal/           # Member area: login, dashboard, profile, contributions, payments
│   ├── admin/            # Back office: login, dashboard, members, listings, orders, payments, content, reports
│   └── api/              # Route handlers (REST)
├── components/ui/        # Button, Input, Card, Reveal, StatusBadge, cart-badge
└── lib/                  # prisma, auth-options, payments (mtn-momo, provider), rate-limit
```

Route groups `(marketing)`, `(shop)`, `portal`, `admin` keep URLs clean (no `/marketing` prefix) while separating layouts.

---

## 3. Data Model (Prisma)

| Entity | Key Fields | Purpose |
|--------|-----------|---------|
| `Member` | membershipNo, name, phone, email, farmLocation, status, passwordHash | Cooperative members; login via phone. |
| `Contribution` | memberId, produceType, grade, quantityKg, deliveredAt | Produce delivered by a member (recorded by staff). |
| `Payout` | memberId, amount, status (PENDING/PAID), paidAt | Payments made to members. |
| `ProduceListing` | name, category, grade, price, quantityKg, images, status | Items for sale in the shop. |
| `Order` | reference, buyerName/Phone/Email, isBulk, status, totalAmount | A buyer's purchase. |
| `OrderItem` | orderId, listingId, quantityKg, unitPrice | Line items. |
| `Payment` | orderId, provider, providerRef, amount, status | MoMo transaction record. |
| `AdminUser` | name, email, role (SUPER_ADMIN/CONTENT_EDITOR/SALES_MANAGER), passwordHash, lastLogin | Platform staff. |
| `ContentPage` | slug, title, body, images, published | CMS for news/pages. |
| `AuditLog` | actorId, action, entity, entityId | Audit trail (model present; not yet wired to actions). |

---

## 4. Business Workflows

### 4.1 Member Journey
1. Member receives credentials (phone + password) from the Cooperative.
2. Logs in at `/portal/login` → lands on Dashboard (contributions kg, pending payouts, status).
3. Views **Profile** (edit contact/farm details), **Contributions** (delivery history), **Payments** (payout history).
4. Signs out; session expires after 8h of inactivity.

### 4.2 Buyer / E-Commerce Journey
1. Visitor browses `/produce` (listings from `ProduceListing` where `status = ACTIVE`).
2. Opens a product at `/produce/[id]`, chooses quantity (kg), adds to **Cart** (client-side cart context).
3. Proceeds to **Checkout** (`/checkout`): enters buyer details, total computed.
4. On submit, an **Order** is created (`PENDING`) and a **Payment** is initiated via **MTN MoMo**.
5. Buyer approves the MoMo prompt on their phone.
6. MoMo **webhook / status** callback updates `Payment.status` and (on success) can advance `Order.status`.
7. Admin updates order status (CONFIRMED → DISPATCHED → COMPLETED) in the admin Orders page.

### 4.3 Admin / Back-Office Journey
1. Admin logs in at `/admin/login` (email + password).
2. **Dashboard** shows metrics (members, active orders, pending payments, revenue).
3. **Members**: create/edit/deactivate member records.
4. **Listings**: create/edit/remove produce (price, qty, grade, images).
5. **Orders**: view orders, change status, fulfill.
6. **Payments**: view payment records and statuses.
7. **Content**: manage CMS pages/news (no developer needed).
8. **Reports**: export member/order/payment data as CSV.

### 4.4 Payment Flow (MTN MoMo)
```
Checkout → POST /api/payments/momo/initiate
        → MTNMoMoProvider.initiate() calls MTN sandbox/production /requesttopay
        → Buyer approves on phone
        → MTN calls POST /api/payments/momo/webhook (or status poll)
        → Payment.status updated (SUCCESS/FAILED)
        → Order status advanced accordingly
```
If payment fails, the buyer sees the failure and can retry (handled in checkout UI).

---

## 5. Roles & Access
- **Visitor** — public marketing + shop browsing (no login).
- **Buyer** — same as visitor; currently must register to check out (guest checkout not yet implemented).
- **Member** — `/portal` (phone login); sees own contributions/payouts only.
- **Admin** — `/admin` (email login); coarse `role === "admin"` gate on admin APIs. Fine-grained `AdminRole` (Super Admin / Content Editor / Sales Manager) exists in the schema but is **not yet enforced per action**.

---

## 6. Security Posture
- HTTPS required in production (hosting layer).
- Passwords hashed with bcrypt; never plaintext.
- JWT sessions with 8h max age.
- Admin API routes check session role (`401` if not admin).
- Rate limiting utility available for sensitive endpoints.
- **To verify before launch:** CSRF/XSS safeguards, input validation on all routes, audit logging, and session-timeout behavior.

---

## 7. Known Limitations (current)
- SQLite is fine for launch scale but may need Postgres for high concurrency.
- Guest checkout, password reset, email/SMS notifications, embedded map, and audit-log writes are **not yet implemented**.
- Admin role enforcement is coarse.
- Imagery is placeholder; real farm photography still required.

*See `PROGRESS.md` for status and `SRS_CHECKLIST.md` for requirement coverage.*
