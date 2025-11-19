-- Admin System Migration
-- Creates tables for admin portal, products, inventory, AI tracking, and notifications

-- ============================================================================
-- ADMIN ROLES & PERMISSIONS
-- ============================================================================

-- Add admin fields to profiles
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS is_admin BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS admin_role TEXT CHECK (admin_role IN ('super_admin', 'admin', 'operations', 'support'));

-- Create admin_activity_log for audit trail
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL, -- 'product', 'order', 'customer', etc.
  entity_id TEXT,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_activity_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_entity ON admin_activity_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_created_at ON admin_activity_log(created_at DESC);

-- ============================================================================
-- PRODUCTS & CATALOG
-- ============================================================================

-- Main products table (replacing mock data)
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL, -- in cents
  category TEXT NOT NULL CHECK (category IN ('bunnyFillings', 'familyCurries', 'sides', 'sauces', 'drinks')),
  display_category TEXT NOT NULL,
  image_url TEXT,
  badge TEXT,
  spice_level TEXT CHECK (spice_level IN ('Mild', 'Medium', 'Hot', 'Very Hot')),
  heat_notes TEXT,
  serves TEXT,
  dietary_tags TEXT[], -- array of tags
  highlights TEXT[],
  allergens TEXT[],
  availability TEXT NOT NULL DEFAULT 'in-stock' CHECK (availability IN ('in-stock', 'limited', 'preorder', 'out-of-stock')),
  delivery_note TEXT,
  max_quantity INTEGER,
  stock_level INTEGER DEFAULT 0,
  low_stock_threshold INTEGER DEFAULT 10,
  reorder_point INTEGER DEFAULT 20,
  supplier_info JSONB,
  sku TEXT UNIQUE,
  is_active BOOLEAN DEFAULT TRUE,
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_generation_id UUID,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_availability ON products(availability);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_stock_level ON products(stock_level);

-- Product images table (for multiple images per product)
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  sort_order INTEGER DEFAULT 0,
  ai_generated BOOLEAN DEFAULT FALSE,
  dalle_prompt TEXT,
  dalle_metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);

-- ============================================================================
-- INVENTORY MANAGEMENT
-- ============================================================================

-- Inventory adjustments history
CREATE TABLE IF NOT EXISTS inventory_adjustments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  adjustment_type TEXT NOT NULL CHECK (adjustment_type IN ('restock', 'sold', 'damaged', 'expired', 'manual')),
  quantity_change INTEGER NOT NULL, -- positive for additions, negative for reductions
  previous_quantity INTEGER NOT NULL,
  new_quantity INTEGER NOT NULL,
  reason TEXT,
  notes TEXT,
  adjusted_by UUID REFERENCES profiles(id),
  order_id UUID REFERENCES orders(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_inventory_adjustments_product_id ON inventory_adjustments(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_adjustments_created_at ON inventory_adjustments(created_at DESC);

-- Stock alerts
CREATE TABLE IF NOT EXISTS stock_alerts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  alert_type TEXT NOT NULL CHECK (alert_type IN ('low_stock', 'out_of_stock', 'reorder_needed')),
  current_stock INTEGER NOT NULL,
  threshold INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
  acknowledged_by UUID REFERENCES profiles(id),
  acknowledged_at TIMESTAMP WITH TIME ZONE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_alerts_product_id ON stock_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_alerts_status ON stock_alerts(status);

-- ============================================================================
-- AI GENERATIONS TRACKING
-- ============================================================================

CREATE TABLE IF NOT EXISTS ai_generations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  generation_type TEXT NOT NULL CHECK (generation_type IN ('description', 'image', 'box_suggestion', 'seasonal_box', 'marketing_copy')),
  entity_type TEXT NOT NULL, -- 'product', 'box', 'promo'
  entity_id TEXT,
  prompt TEXT NOT NULL,
  model TEXT NOT NULL, -- 'gpt-4', 'dall-e-3', etc.
  parameters JSONB,
  result TEXT,
  result_metadata JSONB,
  tokens_used INTEGER,
  cost_cents INTEGER,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  error_message TEXT,
  generated_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_ai_generations_entity ON ai_generations(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_ai_generations_type ON ai_generations(generation_type);
CREATE INDEX IF NOT EXISTS idx_ai_generations_created_at ON ai_generations(created_at DESC);

-- ============================================================================
-- READY BOXES & SEASONAL DROPS
-- ============================================================================

CREATE TABLE IF NOT EXISTS ready_boxes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  marketing_copy TEXT,
  box_type TEXT NOT NULL CHECK (box_type IN ('seasonal', 'occasion', 'curated', 'bundle')),
  theme TEXT, -- 'valentines', 'halloween', 'heritage-month', etc.
  season TEXT, -- 'summer', 'winter', 'spring', 'autumn'
  occasion TEXT, -- 'fathers-day', 'mothers-day', etc.
  month INTEGER CHECK (month >= 1 AND month <= 12),
  year INTEGER,
  products JSONB NOT NULL, -- array of {product_id, quantity, price_override}
  total_price INTEGER NOT NULL,
  discounted_price INTEGER,
  image_url TEXT,
  badge TEXT,
  dietary_tags TEXT[],
  serves TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT FALSE,
  ai_generated BOOLEAN DEFAULT FALSE,
  ai_generation_id UUID REFERENCES ai_generations(id),
  launch_date DATE,
  end_date DATE,
  max_quantity_available INTEGER,
  current_sales INTEGER DEFAULT 0,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  published_at TIMESTAMP WITH TIME ZONE,
  published_by UUID REFERENCES profiles(id)
);

CREATE INDEX IF NOT EXISTS idx_ready_boxes_is_published ON ready_boxes(is_published);
CREATE INDEX IF NOT EXISTS idx_ready_boxes_theme ON ready_boxes(theme);
CREATE INDEX IF NOT EXISTS idx_ready_boxes_box_type ON ready_boxes(box_type);
CREATE INDEX IF NOT EXISTS idx_ready_boxes_launch_date ON ready_boxes(launch_date);

-- Box performance tracking
CREATE TABLE IF NOT EXISTS box_performance (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  box_id UUID NOT NULL REFERENCES ready_boxes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  views INTEGER DEFAULT 0,
  add_to_cart INTEGER DEFAULT 0,
  purchases INTEGER DEFAULT 0,
  revenue INTEGER DEFAULT 0,
  UNIQUE(box_id, date)
);

CREATE INDEX IF NOT EXISTS idx_box_performance_box_id ON box_performance(box_id);
CREATE INDEX IF NOT EXISTS idx_box_performance_date ON box_performance(date DESC);

-- ============================================================================
-- ORDER ENHANCEMENTS
-- ============================================================================

-- Add fulfillment fields to orders
ALTER TABLE orders
ADD COLUMN IF NOT EXISTS fulfilled_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS fulfillment_notes TEXT,
ADD COLUMN IF NOT EXISTS packing_completed_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS carrier TEXT;

-- Order status history for full audit trail
CREATE TABLE IF NOT EXISTS order_status_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  previous_status TEXT,
  new_status TEXT NOT NULL,
  changed_by UUID REFERENCES profiles(id),
  notes TEXT,
  customer_notified BOOLEAN DEFAULT FALSE,
  notification_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_created_at ON order_status_history(created_at DESC);

-- ============================================================================
-- ADMIN NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS admin_notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  notification_type TEXT NOT NULL CHECK (notification_type IN ('order', 'stock', 'payment', 'customer', 'system')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('critical', 'high', 'medium', 'low')),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  entity_type TEXT, -- 'order', 'product', 'customer'
  entity_id TEXT,
  assigned_to UUID REFERENCES profiles(id),
  is_read BOOLEAN DEFAULT FALSE,
  read_at TIMESTAMP WITH TIME ZONE,
  read_by UUID REFERENCES profiles(id),
  action_required BOOLEAN DEFAULT FALSE,
  action_taken BOOLEAN DEFAULT FALSE,
  action_taken_at TIMESTAMP WITH TIME ZONE,
  action_taken_by UUID REFERENCES profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_admin_notifications_assigned_to ON admin_notifications(assigned_to);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_is_read ON admin_notifications(is_read);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_priority ON admin_notifications(priority);
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON admin_notifications(created_at DESC);

-- Notification preferences for admins
CREATE TABLE IF NOT EXISTS admin_notification_preferences (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  in_app_enabled BOOLEAN DEFAULT TRUE,
  email_enabled BOOLEAN DEFAULT TRUE,
  sms_enabled BOOLEAN DEFAULT FALSE,
  min_priority TEXT DEFAULT 'medium' CHECK (min_priority IN ('critical', 'high', 'medium', 'low')),
  UNIQUE(admin_id, notification_type)
);

CREATE INDEX IF NOT EXISTS idx_admin_notification_preferences_admin_id ON admin_notification_preferences(admin_id);

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger for updated_at on products
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for updated_at on ready_boxes
CREATE TRIGGER update_ready_boxes_updated_at BEFORE UPDATE ON ready_boxes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create stock alert when inventory is low
CREATE OR REPLACE FUNCTION check_stock_alert()
RETURNS TRIGGER AS $$
BEGIN
  -- If stock drops below low_stock_threshold, create alert
  IF NEW.stock_level <= NEW.low_stock_threshold AND NEW.stock_level > 0 THEN
    INSERT INTO stock_alerts (product_id, alert_type, current_stock, threshold)
    VALUES (NEW.id, 'low_stock', NEW.stock_level, NEW.low_stock_threshold)
    ON CONFLICT DO NOTHING;
    
    -- Create admin notification
    INSERT INTO admin_notifications (
      notification_type,
      priority,
      title,
      message,
      entity_type,
      entity_id,
      action_required
    ) VALUES (
      'stock',
      'high',
      'Low Stock Alert',
      'Product "' || NEW.name || '" is running low. Current stock: ' || NEW.stock_level,
      'product',
      NEW.id,
      TRUE
    );
  END IF;
  
  -- If stock is zero, create out of stock alert
  IF NEW.stock_level = 0 THEN
    INSERT INTO stock_alerts (product_id, alert_type, current_stock, threshold)
    VALUES (NEW.id, 'out_of_stock', NEW.stock_level, NEW.low_stock_threshold)
    ON CONFLICT DO NOTHING;
    
    -- Create admin notification
    INSERT INTO admin_notifications (
      notification_type,
      priority,
      title,
      message,
      entity_type,
      entity_id,
      action_required
    ) VALUES (
      'stock',
      'critical',
      'Out of Stock',
      'Product "' || NEW.name || '" is out of stock!',
      'product',
      NEW.id,
      TRUE
    );
  END IF;
  
  -- If stock reaches reorder point
  IF NEW.stock_level <= NEW.reorder_point THEN
    INSERT INTO stock_alerts (product_id, alert_type, current_stock, threshold)
    VALUES (NEW.id, 'reorder_needed', NEW.stock_level, NEW.reorder_point)
    ON CONFLICT DO NOTHING;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_check_stock_alert
  AFTER INSERT OR UPDATE OF stock_level ON products
  FOR EACH ROW EXECUTE FUNCTION check_stock_alert();

-- Function to track order status changes
CREATE OR REPLACE FUNCTION track_order_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status != OLD.status THEN
    INSERT INTO order_status_history (
      order_id,
      previous_status,
      new_status,
      notes
    ) VALUES (
      NEW.id,
      OLD.status,
      NEW.status,
      'Status changed from ' || OLD.status || ' to ' || NEW.status
    );
    
    -- Create admin notification for new orders
    IF NEW.status = 'confirmed' THEN
      INSERT INTO admin_notifications (
        notification_type,
        priority,
        title,
        message,
        entity_type,
        entity_id,
        action_required
      ) VALUES (
        'order',
        'high',
        'New Order Received',
        'Order #' || NEW.order_number || ' received from customer',
        'order',
        NEW.id::TEXT,
        TRUE
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_track_order_status_change
  AFTER UPDATE OF status ON orders
  FOR EACH ROW EXECUTE FUNCTION track_order_status_change();

-- Function to update timestamps on order status changes
CREATE OR REPLACE FUNCTION update_order_timestamps()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'shipped' AND OLD.status != 'shipped' THEN
    NEW.shipped_at = NOW();
  ELSIF NEW.status = 'delivered' AND OLD.status != 'delivered' THEN
    NEW.delivered_at = NOW();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_order_timestamps
  BEFORE UPDATE OF status ON orders
  FOR EACH ROW EXECUTE FUNCTION update_order_timestamps();

-- ============================================================================
-- HELPER FUNCTIONS
-- ============================================================================

-- Function to adjust inventory
CREATE OR REPLACE FUNCTION adjust_inventory(
  p_product_id TEXT,
  p_quantity_change INTEGER,
  p_adjustment_type TEXT,
  p_reason TEXT DEFAULT NULL,
  p_notes TEXT DEFAULT NULL,
  p_adjusted_by UUID DEFAULT NULL,
  p_order_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
  v_previous_quantity INTEGER;
  v_new_quantity INTEGER;
BEGIN
  -- Get current stock level
  SELECT stock_level INTO v_previous_quantity
  FROM products
  WHERE id = p_product_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Product not found: %', p_product_id;
  END IF;
  
  -- Calculate new quantity
  v_new_quantity := v_previous_quantity + p_quantity_change;
  
  -- Prevent negative stock
  IF v_new_quantity < 0 THEN
    v_new_quantity := 0;
  END IF;
  
  -- Update product stock level
  UPDATE products
  SET stock_level = v_new_quantity
  WHERE id = p_product_id;
  
  -- Record adjustment
  INSERT INTO inventory_adjustments (
    product_id,
    adjustment_type,
    quantity_change,
    previous_quantity,
    new_quantity,
    reason,
    notes,
    adjusted_by,
    order_id
  ) VALUES (
    p_product_id,
    p_adjustment_type,
    p_quantity_change,
    v_previous_quantity,
    v_new_quantity,
    p_reason,
    p_notes,
    p_adjusted_by,
    p_order_id
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to get low stock products
CREATE OR REPLACE FUNCTION get_low_stock_products()
RETURNS TABLE (
  product_id TEXT,
  product_name TEXT,
  current_stock INTEGER,
  low_stock_threshold INTEGER,
  reorder_point INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.id,
    p.name,
    p.stock_level,
    p.low_stock_threshold,
    p.reorder_point
  FROM products p
  WHERE p.stock_level <= p.low_stock_threshold
    AND p.is_active = TRUE
  ORDER BY p.stock_level ASC;
END;
$$ LANGUAGE plpgsql;

-- Function to generate product SKU
CREATE OR REPLACE FUNCTION generate_product_sku(p_category TEXT, p_name TEXT)
RETURNS TEXT AS $$
DECLARE
  v_prefix TEXT;
  v_counter INTEGER;
  v_sku TEXT;
BEGIN
  -- Determine prefix based on category
  v_prefix := CASE p_category
    WHEN 'bunnyFillings' THEN 'BF'
    WHEN 'familyCurries' THEN 'FC'
    WHEN 'sides' THEN 'SD'
    WHEN 'sauces' THEN 'SC'
    WHEN 'drinks' THEN 'DR'
    ELSE 'PR'
  END;
  
  -- Get next counter for this category
  SELECT COUNT(*) + 1 INTO v_counter
  FROM products
  WHERE category = p_category;
  
  -- Generate SKU
  v_sku := v_prefix || '-' || LPAD(v_counter::TEXT, 4, '0');
  
  RETURN v_sku;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SEED ADMIN USER (OPTIONAL - Update with your email)
-- ============================================================================

-- This is commented out - uncomment and update with your admin email after migration
-- UPDATE profiles 
-- SET is_admin = TRUE, admin_role = 'super_admin'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'your-admin-email@example.com' LIMIT 1);

