-- Seed admin user (password: admin123, bcrypt hash)
INSERT OR IGNORE INTO User (id, name, email, password, role, phone, company, createdAt, updatedAt)
VALUES ('admin-001', 'Mathew', 'mathew@freshbatch.com', '$2b$12$RXmLlOTTnvN2LBjJ6BdoFujsGQWRyPY4FJpa.7bSTupB9wVCXRNRO', 'admin', '555-0100', 'FreshBatch Distribution', datetime('now'), datetime('now'));

-- Seed demo customer (password: customer123)
INSERT OR IGNORE INTO User (id, name, email, password, role, phone, company, createdAt, updatedAt)
VALUES ('customer-001', 'Demo Customer', 'demo@customer.com', '$2b$12$JHeVfW4nkaEF1of11yoxNuA5LL3MZiDVHu2pWifLPcqH9rG6Um3..', 'customer', '555-0200', 'Sample Restaurant', datetime('now'), datetime('now'));

-- Seed products
INSERT INTO Product (id, name, description, batch, batchGrade, price, unit, quantity, category, origin, status, createdAt, updatedAt) VALUES
('prod-001', 'Honeycrisp Apples', 'Sweet and crisp premium apples. Perfect for retail display and direct consumption.', 'B-2026-001', 'A', 45.00, 'per case', 50, 'Apples', 'Washington, USA', 'active', datetime('now'), datetime('now')),
('prod-002', 'Gala Apples', 'Mild, sweet flavor with a fine texture. Great all-purpose apple.', 'B-2026-002', 'A', 38.00, 'per case', 75, 'Apples', 'Washington, USA', 'active', datetime('now'), datetime('now')),
('prod-003', 'Fuji Apples', 'Very sweet with a dense flesh. Holds up well in storage.', 'B-2026-003', 'B', 32.00, 'per case', 60, 'Apples', 'Chile', 'active', datetime('now'), datetime('now')),
('prod-004', 'Navel Oranges', 'Seedless, easy to peel. Premium grade California navels.', 'B-2026-010', 'A', 42.00, 'per case', 80, 'Citrus', 'California, USA', 'active', datetime('now'), datetime('now')),
('prod-005', 'Valencia Oranges', 'Excellent juicing oranges with high sugar content.', 'B-2026-011', 'A', 36.00, 'per case', 65, 'Citrus', 'Florida, USA', 'active', datetime('now'), datetime('now')),
('prod-006', 'Lemons - Eureka', 'Classic tart lemons, bright yellow. Ideal for restaurants.', 'B-2026-012', 'A', 34.00, 'per case', 90, 'Citrus', 'California, USA', 'active', datetime('now'), datetime('now')),
('prod-007', 'Limes - Persian', 'Seedless, juicy limes. Bar and restaurant staple.', 'B-2026-013', 'B', 28.00, 'per case', 100, 'Citrus', 'Mexico', 'active', datetime('now'), datetime('now')),
('prod-008', 'Strawberries - Driscolls', 'Premium California strawberries. 8x1lb clamshells per case.', 'B-2026-020', 'A', 32.00, 'per case', 40, 'Berries', 'California, USA', 'active', datetime('now'), datetime('now')),
('prod-009', 'Blueberries', 'Plump, sweet blueberries. 12x6oz clamshells per case.', 'B-2026-021', 'A', 48.00, 'per case', 35, 'Berries', 'Oregon, USA', 'active', datetime('now'), datetime('now')),
('prod-010', 'Bananas - Cavendish', 'Standard Cavendish bananas, various ripeness. 40lb cases.', 'B-2026-030', 'A', 22.00, 'per case', 120, 'Tropical', 'Ecuador', 'active', datetime('now'), datetime('now')),
('prod-011', 'Mangoes - Ataulfo', 'Creamy, fiberless honey mangoes. Flat seed, max sweetness.', 'B-2026-031', 'A', 38.00, 'per case', 45, 'Tropical', 'Mexico', 'active', datetime('now'), datetime('now')),
('prod-012', 'Pineapple - Gold', 'Extra sweet gold pineapples. 6-8 count per case.', 'B-2026-032', 'A', 28.00, 'per case', 55, 'Tropical', 'Costa Rica', 'active', datetime('now'), datetime('now')),
('prod-013', 'Red Seedless Grapes', 'Crisp, sweet red grapes. 18lb cases.', 'B-2026-040', 'A', 36.00, 'per case', 30, 'Grapes', 'Chile', 'active', datetime('now'), datetime('now')),
('prod-014', 'Green Seedless Grapes', 'Fresh, slightly tart green grapes. 18lb cases.', 'B-2026-041', 'B', 32.00, 'per case', 25, 'Grapes', 'Chile', 'active', datetime('now'), datetime('now')),
('prod-015', 'Watermelon - Seedless', 'Large seedless watermelons, red flesh, sweet.', 'B-2026-050', 'A', 26.00, 'per unit', 40, 'Melons', 'Georgia, USA', 'active', datetime('now'), datetime('now')),
('prod-016', 'Cantaloupe', 'Sweet cantaloupes. Firm flesh, golden rind. 9-12 count.', 'B-2026-051', 'B', 24.00, 'per case', 35, 'Melons', 'Arizona, USA', 'active', datetime('now'), datetime('now')),
('prod-017', 'Avocados - Hass', 'Premium Hass avocados. 48 count per case.', 'B-2026-060', 'A', 52.00, 'per case', 60, 'Tropical', 'Mexico', 'active', datetime('now'), datetime('now')),
('prod-018', 'Peaches - Yellow', 'Juicy yellow peaches, tree-ripened. 25lb lug.', 'B-2026-070', 'A', 34.00, 'per case', 20, 'Stone Fruit', 'South Carolina, USA', 'active', datetime('now'), datetime('now')),
('prod-019', 'Cherries - Bing', 'Premium dark sweet cherries. Firm, large. 18lb case.', 'B-2026-071', 'A', 68.00, 'per case', 15, 'Stone Fruit', 'Washington, USA', 'active', datetime('now'), datetime('now')),
('prod-020', 'Kiwi Fruit', 'Imported green kiwi fruit. 36-39 count flat.', 'B-2026-080', 'B', 30.00, 'per case', 50, 'Tropical', 'New Zealand', 'active', datetime('now'), datetime('now'));
