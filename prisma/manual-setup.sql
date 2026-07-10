-- Manual schema creation from schema.prisma
-- Run: psql -U coop_user -d coop_local -f prisma/manual-setup.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Enums
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');
CREATE TYPE "PayoutStatus" AS ENUM ('PENDING', 'PAID');
CREATE TYPE "ListingStatus" AS ENUM ('ACTIVE', 'OUT_OF_STOCK', 'ARCHIVED');
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'DISPATCHED', 'COMPLETED', 'CANCELLED');
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');
CREATE TYPE "AdminRole" AS ENUM ('SUPER_ADMIN', 'CONTENT_EDITOR', 'SALES_MANAGER');

-- Tables
CREATE TABLE "Member" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "membershipNo" TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  "passwordHash" TEXT NOT NULL,
  "farmLocation" TEXT,
  status "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
  "joinedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "Contribution" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "memberId" TEXT NOT NULL REFERENCES "Member"(id) ON DELETE CASCADE,
  "produceType" TEXT NOT NULL,
  grade TEXT NOT NULL,
  "quantityKg" DECIMAL NOT NULL,
  "deliveredAt" TIMESTAMP NOT NULL,
  "recordedBy" TEXT NOT NULL
);

CREATE TABLE "Payout" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "memberId" TEXT NOT NULL REFERENCES "Member"(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL,
  status "PayoutStatus" NOT NULL DEFAULT 'PENDING',
  "paidAt" TIMESTAMP
);

CREATE TABLE "ProduceListing" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  grade TEXT NOT NULL,
  price DECIMAL NOT NULL,
  "quantityKg" DECIMAL NOT NULL,
  images TEXT NOT NULL,
  status "ListingStatus" NOT NULL DEFAULT 'ACTIVE'
);

CREATE TABLE "Order" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  reference TEXT NOT NULL UNIQUE,
  "buyerName" TEXT NOT NULL,
  "buyerPhone" TEXT NOT NULL,
  "buyerEmail" TEXT,
  "isBulk" BOOLEAN NOT NULL DEFAULT false,
  status "OrderStatus" NOT NULL DEFAULT 'PENDING',
  "totalAmount" DECIMAL NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "OrderItem" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  "listingId" TEXT NOT NULL REFERENCES "ProduceListing"(id) ON DELETE CASCADE,
  "quantityKg" DECIMAL NOT NULL,
  "unitPrice" DECIMAL NOT NULL
);

CREATE TABLE "Payment" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "orderId" TEXT NOT NULL UNIQUE REFERENCES "Order"(id) ON DELETE CASCADE,
  provider TEXT NOT NULL,
  "providerRef" TEXT NOT NULL,
  amount DECIMAL NOT NULL,
  status "PaymentStatus" NOT NULL DEFAULT 'PENDING',
  "loggedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "AdminUser" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role "AdminRole" NOT NULL DEFAULT 'CONTENT_EDITOR',
  "passwordHash" TEXT NOT NULL,
  "lastLogin" TIMESTAMP
);

CREATE TABLE "ContentPage" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  images TEXT NOT NULL DEFAULT '[]',
  published BOOLEAN NOT NULL DEFAULT false,
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "AuditLog" (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  "actorId" TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  "entityId" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Seed data
-- Passwords: admin123 / member123
INSERT INTO "AdminUser" (id, name, email, role, "passwordHash")
VALUES ('admin-seed', 'Super Admin', 'admin@coop.example', 'SUPER_ADMIN',
  '$2a$12$YBksSP/q.3QMb2JAKIQRDuRLpNknnr.1GzAo0LKATXRs2PUO/oA3O');

INSERT INTO "Member" (id, "membershipNo", name, phone, email, "passwordHash", "farmLocation", status)
VALUES
  ('mem-seed-1', 'COOP-001', 'John Mulenga', '+260970000001', 'john@example.com',
    '$2a$12$ty3g5I0SjTwGPHZscK3m/.cfJVAJHiaKu2Z1B1SlQRZexMo5BLxI.', 'Chongwe District', 'ACTIVE'),
  ('mem-seed-2', 'COOP-002', 'Mary Banda', '+260970000002', 'mary@example.com',
    '$2a$12$ty3g5I0SjTwGPHZscK3m/.cfJVAJHiaKu2Z1B1SlQRZexMo5BLxI.', 'Kafwe District', 'ACTIVE'),
  ('mem-seed-3', 'COOP-003', 'Peter Zulu', '+260970000003', NULL,
    '$2a$12$ty3g5I0SjTwGPHZscK3m/.cfJVAJHiaKu2Z1B1SlQRZexMo5BLxI.', 'Lusaka', 'INACTIVE');

INSERT INTO "ProduceListing" (id, name, category, grade, price, "quantityKg", images, status)
VALUES
  ('seed-grade-a', 'Grade A Avocados', 'fresh', 'A', 45.0, 2000, '[]', 'ACTIVE'),
  ('seed-grade-b', 'Grade B Avocados', 'fresh', 'B', 30.0, 1500, '[]', 'ACTIVE'),
  ('seed-avocado-oil', 'Avocado Oil', 'processed', 'A', 120.0, 0, '[]', 'OUT_OF_STOCK');

INSERT INTO "ContentPage" (id, slug, title, body, published)
VALUES
  ('content-about', 'about', 'About Coop', 'Cooperative Society Limited (Coop) is a farmer-owned cooperative based in Lusaka Province, Zambia.', true),
  ('content-home', 'home', 'Home Page', 'Welcome to Coop — Growing Zambia''s Finest Avocados, Together.', true);
