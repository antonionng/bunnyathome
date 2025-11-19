-- Enable Row Level Security on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_boxes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Addresses policies
CREATE POLICY "Users can view own addresses"
  ON addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own addresses"
  ON addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own addresses"
  ON addresses FOR DELETE
  USING (auth.uid() = user_id);

-- Saved boxes policies
CREATE POLICY "Users can view own saved boxes"
  ON saved_boxes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own saved boxes"
  ON saved_boxes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own saved boxes"
  ON saved_boxes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own saved boxes"
  ON saved_boxes FOR DELETE
  USING (auth.uid() = user_id);

-- Orders policies
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Note: Orders cannot be updated or deleted by users, only by admins

-- Subscriptions policies
CREATE POLICY "Users can view own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own subscriptions"
  ON subscriptions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subscriptions"
  ON subscriptions FOR UPDATE
  USING (auth.uid() = user_id);

-- Promo codes policies (read-only for users)
CREATE POLICY "Anyone can view valid promo codes"
  ON promo_codes FOR SELECT
  USING (
    NOW() BETWEEN valid_from AND valid_until 
    AND current_uses < max_uses
  );

-- Cart items policies
CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own cart"
  ON cart_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own cart"
  ON cart_items FOR DELETE
  USING (auth.uid() = user_id);

-- Create admin role and policies (for future admin dashboard)
-- Note: This assumes you'll create an admin role in Supabase Auth

-- Admin can do everything on all tables
-- We base this on a custom JWT claim `role = 'admin'` so we don't need
-- direct SELECT access on auth.users (which would leak sensitive data).
CREATE POLICY "Admins can do everything on profiles"
  ON profiles FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do everything on orders"
  ON orders FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do everything on subscriptions"
  ON subscriptions FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Admins can do everything on promo codes"
  ON promo_codes FOR ALL
  USING (auth.jwt() ->> 'role' = 'admin');



