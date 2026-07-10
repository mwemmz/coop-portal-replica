-- Seed data for Coop D1 database

-- Admin user (password: admin123)
INSERT OR IGNORE INTO AdminUser (id, name, email, role, passwordHash)
VALUES ('seed-admin-1', 'Super Admin', 'admin@coop.example', 'SUPER_ADMIN', '$2a$12$3ERfbKY5K56sHSqmYvOdVesGPfLD7eSgHBNMviHpcCT8ndo2Ta6Se');

-- Members (password: member123)
INSERT OR IGNORE INTO Member (id, membershipNo, name, phone, email, passwordHash, farmLocation, status)
VALUES ('seed-member-1', 'COOP-001', 'John Mulenga', '+260970000001', 'john@example.com', '$2a$12$bY7KbQv/N8B3BGCcv26DLuEI4x9qBzfRCpp9GYXv7fBBPoI1AF8Ay', 'Chongwe District', 'ACTIVE');

INSERT OR IGNORE INTO Member (id, membershipNo, name, phone, email, passwordHash, farmLocation, status)
VALUES ('seed-member-2', 'COOP-002', 'Mary Banda', '+260970000002', 'mary@example.com', '$2a$12$bY7KbQv/N8B3BGCcv26DLuEI4x9qBzfRCpp9GYXv7fBBPoI1AF8Ay', 'Kafue District', 'ACTIVE');

INSERT OR IGNORE INTO Member (id, membershipNo, name, phone, email, passwordHash, farmLocation, status)
VALUES ('seed-member-3', 'COOP-003', 'Peter Zulu', '+260970000003', NULL, '$2a$12$bY7KbQv/N8B3BGCcv26DLuEI4x9qBzfRCpp9GYXv7fBBPoI1AF8Ay', 'Lusaka', 'INACTIVE');

-- Produce listings
INSERT OR IGNORE INTO ProduceListing (id, name, category, grade, price, quantityKg, images, status)
VALUES ('seed-grade-a', 'Grade A Avocados', 'fresh', 'A', 45.0, 2000, '[]', 'ACTIVE');

INSERT OR IGNORE INTO ProduceListing (id, name, category, grade, price, quantityKg, images, status)
VALUES ('seed-grade-b', 'Grade B Avocados', 'fresh', 'B', 30.0, 1500, '[]', 'ACTIVE');

INSERT OR IGNORE INTO ProduceListing (id, name, category, grade, price, quantityKg, images, status)
VALUES ('seed-avocado-oil', 'Avocado Oil', 'processed', 'A', 120.0, 0, '[]', 'OUT_OF_STOCK');

-- Content pages
INSERT OR IGNORE INTO ContentPage (id, slug, title, body, images, published, updatedAt)
VALUES ('seed-content-1', 'about', 'About Coop', 'Cooperative Society Limited (Coop) is a farmer-owned cooperative based in Lusaka Province, Zambia.', '[]', 1, datetime('now'));

INSERT OR IGNORE INTO ContentPage (id, slug, title, body, images, published, updatedAt)
VALUES ('seed-content-2', 'home', 'Home Page', 'Welcome to Coop — Growing Zambia''s Finest Avocados, Together.', '[]', 1, datetime('now'));

-- Sample order
INSERT OR IGNORE INTO `Order` (id, reference, buyerName, buyerPhone, totalAmount, status, createdAt)
VALUES ('seed-order-1', 'DEMO-001', 'Demo Buyer', '+260970000000', 225.0, 'PENDING', datetime('now'));

INSERT OR IGNORE INTO OrderItem (id, orderId, listingId, quantityKg, unitPrice)
VALUES ('seed-oi-1', 'seed-order-1', 'seed-grade-a', 5, 45.0);

-- Sample contributions
INSERT OR IGNORE INTO Contribution (id, memberId, produceType, grade, quantityKg, deliveredAt, recordedBy)
VALUES ('seed-cont-1', 'seed-member-1', 'Avocados', 'A', 500, '2026-06-15', 'seed');

INSERT OR IGNORE INTO Contribution (id, memberId, produceType, grade, quantityKg, deliveredAt, recordedBy)
VALUES ('seed-cont-2', 'seed-member-1', 'Avocados', 'B', 350, '2026-06-01', 'seed');

INSERT OR IGNORE INTO Contribution (id, memberId, produceType, grade, quantityKg, deliveredAt, recordedBy)
VALUES ('seed-cont-3', 'seed-member-2', 'Avocados', 'A', 400, '2026-06-10', 'seed');

-- Sample payouts
INSERT OR IGNORE INTO Payout (id, memberId, amount, status, paidAt)
VALUES ('seed-pay-1', 'seed-member-1', 2250, 'PAID', '2026-06-30');

INSERT OR IGNORE INTO Payout (id, memberId, amount, status, paidAt)
VALUES ('seed-pay-2', 'seed-member-1', 1200, 'PAID', '2026-06-15');

INSERT OR IGNORE INTO Payout (id, memberId, amount, status, paidAt)
VALUES ('seed-pay-3', 'seed-member-1', 1800, 'PENDING', NULL);
