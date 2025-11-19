-- Seed some sample promo codes for testing

INSERT INTO promo_codes (code, discount_type, discount_value, valid_from, valid_until, max_uses) VALUES
  ('WELCOME10', 'percentage', 10, NOW(), NOW() + INTERVAL '90 days', 1000),
  ('BUNNY20', 'percentage', 20, NOW(), NOW() + INTERVAL '30 days', 100),
  ('FREESHIP', 'fixed', 500, NOW(), NOW() + INTERVAL '60 days', 500),
  ('FIRSTBOX', 'percentage', 15, NOW(), NOW() + INTERVAL '180 days', 10000);

-- Note: You can add more seed data here for testing purposes
-- For example, sample products, test users, etc.



