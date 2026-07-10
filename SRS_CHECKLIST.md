# SRS Compliance Checklist — Coop Platform

Checks the implemented system against the **System Requirements Specification** (Ontech Solutions, v1.0, 03 Jul 2026).

Legend: ✅ Implemented · 🟡 Partial / Coarse · ❌ Not implemented · — Out of scope / future

---

## 3.1 Public Marketing Website
| ID | Requirement | Status | Notes |
|----|-------------|--------|-------|
| FR-1.1 | Public home page (mission, produce) | ✅ | `/` built, hero + produce + why-join + CTA. |
| FR-1.2 | About page (history, governance, membership) | ✅ | `/about` built with all three sections. |
| FR-1.3 | Produce/Products page (varieties, images, descriptions) | ✅ | `/produce` lists `ProduceListing`; detail at `/produce/[id]`. Images supported (currently placeholders). |
| FR-1.4 | News/Updates section | 🟡 | `/news` renders from CMS `ContentPage`; admin content UI exists. Seed content pending. |
| FR-1.5 | Contact page (form, address, phone, email, **map**) | 🟡 | Form, address, phone, email present and working. **Embedded map not implemented.** |
| FR-1.6 | Gallery page | 🟡 | `/gallery` exists; uses placeholder tiles ("Photo N"). Real media pending. |
| FR-1.7 | Multi-language content | — | Could / future phase. Not built. |
| FR-1.8 | Fully responsive (mobile/tablet/desktop) | ✅ | Tailwind responsive; mobile layouts declared. Needs cross-browser test (SRS §8). |

## 3.2 Member Portal
| ID | Requirement | Status | Notes |
|----|-------------|--------|-------|
| FR-2.1 | Members register/onboard + secure login (phone + password) | 🟡 | Login by phone + password works. **Self-registration/onboarding flow not built** (members created by admin). |
| FR-2.2 | View/update profile (contact, farm) | ✅ | `/portal/profile` edit supported. |
| FR-2.3 | View contribution/delivery history | ✅ | `/portal/contributions` from `Contribution`. |
| FR-2.4 | View payment/payout history + balances | ✅ | `/portal/payments` from `Payout`. |
| FR-2.5 | View announcements/circulars | 🟡 | CMS content exists; no dedicated member announcements view wired. |
| FR-2.6 | Password reset / account recovery | ❌ | **Not implemented.** |
| FR-2.7 | Download/view digital documents (certificate, statements) | — | Could / future. Not built. |

## 3.3 E-Commerce Module
| ID | Requirement | Status | Notes |
|----|-------------|--------|-------|
| FR-3.1 | Admin CRUD produce listings (price, qty, grade, images) | ✅ | `/admin/listings` full CRUD. |
| FR-3.2 | Buyers browse/search/filter listings | 🟡 | Browse + basic listing page built. **Search/filter controls not implemented.** |
| FR-3.3 | Shopping cart + checkout | ✅ | `/cart`, `/checkout`, cart context. |
| FR-3.4 | Buyer account or guest checkout | ❌ | **Guest checkout not implemented** (buyer must register). |
| FR-3.5 | Order confirmation + reference number | ✅ | `Order.reference` generated on checkout. |
| FR-3.6 | Notify Admin of new orders (dashboard + email/SMS) | 🟡 | Admin dashboard shows orders. **Email/SMS notification not implemented.** |
| FR-3.7 | Admin update order status | ✅ | `/admin/orders` status select (PENDING→…→CANCELLED). |
| FR-3.8 | Bulk/wholesale exporter enquiry distinct flow | 🟡 | `Order.isBulk` field exists; **no distinct enquiry flow/UI.** |
| FR-3.9 | Order history viewable by Buyer and Admin | 🟡 | Admin view ✅. **Buyer order history view not built** (no buyer account order list page). |

## 3.4 Payments & Mobile Money
| ID | Requirement | Status | Notes |
|----|-------------|--------|-------|
| FR-4.1 | Integrate ≥1 Zambian MoMo provider at checkout | 🟡 | `MTNMoMoProvider` implemented (sandbox + prod). **Needs live merchant account + real test transactions (SRS §8).** |
| FR-4.2 | Confirm/record payment status via callback/webhook | ✅ | `/api/payments/momo/webhook` + status route; updates `Payment`. |
| FR-4.3 | Handle/display failed/incomplete payments + retry | ✅ | Checkout handles failure states; retry supported. |
| FR-4.4 | Admin payment reconciliation view | 🟡 | Payments list exists; **dedicated reconciliation view not built.** |
| FR-4.5 | Support future payment methods without redesign | 🟡 | `PaymentProvider` interface allows adding providers; Airtel/Zamtel/card not built (Should). |
| FR-4.6 | Log all transactions (timestamp, amount, payer ref, status) | ✅ | `Payment` model records all required fields. |

## 3.5 Administration & Back-Office
| ID | Requirement | Status | Notes |
|----|-------------|--------|-------|
| FR-5.1 | Secure Admin dashboard (metrics) | ✅ | `/admin/dashboard` (members, orders, payments, revenue). |
| FR-5.2 | Manage member accounts/records | ✅ | `/admin/members` CRUD. |
| FR-5.3 | Manage content (pages/news/gallery) via CMS, no dev | 🟡 | Content CMS route + admin Content page exist. **Gallery management not in CMS UI.** |
| FR-5.4 | Role-based access (Super Admin / Content Editor / Sales Manager) | 🟡 | `AdminRole` enum + `role==="admin"` gate exists. **Per-role action enforcement not implemented (Should).** |
| FR-5.5 | Export member/order/payment data to CSV | ✅ | `/admin/reports` CSV export. |
| FR-5.6 | Audit log of key admin actions | 🟡 | `AuditLog` model exists; **not yet written on admin actions (Could).** |

## 4. Non-Functional Requirements
| Area | Requirement | Status | Notes |
|------|-------------|--------|-------|
| 4.1 Perf | Pages load <3s on 3G/4G | 🟡 | Not yet measured; image optimization + low-bandwidth tuning pending. |
| 4.1 Perf | ≥200 concurrent users | 🟡 | Unverified at scale; SQLite may need Postgres for high concurrency. |
| 4.2 Sec | HTTPS/SSL everywhere | 🟡 | Hosting/TLS config pending (production). |
| 4.2 Sec | bcrypt password hashing | ✅ | Implemented. |
| 4.2 Sec | Protection vs SQLi/XSS/CSRF | 🟡 | Prisma parameterization helps SQLi; XSS/CSRF hardening to verify. |
| 4.2 Sec | Secure payment integration per provider | 🟡 | MTN MoMo guidelines followed in code; live validation pending. |
| 4.2 Sec | Session timeout (configurable) | ✅ | JWT `maxAge: 8h`. |
| 4.2 Sec | Data Protection Act (Zambia) compliance | 🟡 | Design supports it; formal DPIA/policy pending. |
| 4.3 Usability | Clear language, minimal steps | ✅ | Simple flows; to be confirmed in UAT. |
| 4.3 Accessibility | Readable fonts, sufficient contrast | ✅ | Redesigned for AA contrast (verify programmatically). |
| 4.4 Avail. | 99% uptime, backups | 🟡 | Backups/uptime SLA pending (hosting). |
| 4.5 Scale | Future modules without rebuild | ✅ | Modular architecture; `PaymentProvider` interface, expandable models. |
| 4.5 Maint. | Documented, handed-over code | 🟡 | Code is structured; formal docs/handover pending. |

---

## Summary
- **Must-have (§3) fully met:** FR-1.1, 1.2, 1.3, 1.8, 2.2, 2.3, 2.4, 3.1, 3.3, 3.5, 3.7, 4.2, 4.3, 4.6, 5.1, 5.2, 5.5.
- **Must-have gaps (block UAT sign-off):** **FR-2.6 (password reset)**, **FR-3.4 (guest checkout)** — both are "Must" and currently missing. FR-1.5 map is "Must" but partial.
- **Should/Could:** largely partial or future (search/filter, email/SMS, role enforcement, audit logging, bulk enquiry, reconciliation, multi-language, document download).

**Conclusion:** The platform is structurally complete and demonstrable, but **two SRS "Must" items (FR-2.6, FR-3.4) and the live MoMo test (SRS §8 acceptance) must be delivered before UAT sign-off.**

*See `PROGRESS.md` (status) and `SYSTEM_OVERVIEW.md` (architecture).*
