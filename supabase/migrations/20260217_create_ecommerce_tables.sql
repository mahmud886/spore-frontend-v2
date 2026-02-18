-- Migration to create tables for e-commerce functionality
-- Created: 2026-02-17

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Customers Table
CREATE TABLE IF NOT EXISTS ecommerce_customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT,
    stripe_customer_id TEXT,
    phone TEXT,
    address JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS ecommerce_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number TEXT UNIQUE NOT NULL, -- e.g. SPORE-XXXX
    customer_id UUID REFERENCES ecommerce_customers(id) ON DELETE SET NULL,
    stripe_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,
    amount_total DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'usd',
    status TEXT DEFAULT 'pending', -- pending, paid, shipped, cancelled, refunded
    payment_status TEXT DEFAULT 'unpaid', -- unpaid, paid, no_payment_required
    shipping_address JSONB,
    billing_address JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Order Items Table
CREATE TABLE IF NOT EXISTS ecommerce_order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES ecommerce_orders(id) ON DELETE CASCADE,
    product_name TEXT NOT NULL,
    product_id TEXT, -- External ID or internal reference
    variant_id TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_amount DECIMAL(10, 2) NOT NULL, -- Price per unit
    total_amount DECIMAL(10, 2) NOT NULL, -- quantity * unit_amount
    image_url TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_ecommerce_customers_email ON ecommerce_customers(email);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_customer_id ON ecommerce_orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_stripe_session_id ON ecommerce_orders(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_ecommerce_orders_order_number ON ecommerce_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_ecommerce_order_items_order_id ON ecommerce_order_items(order_id);

-- 5. Add RLS Policies (Optional but Recommended)
ALTER TABLE ecommerce_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE ecommerce_order_items ENABLE ROW LEVEL SECURITY;

-- Policy: Service role can do everything (default)
-- Public Read Access (if needed, adjust as per requirement)
-- For now, we assume server-side operations using service role key or appropriate authenticated user access

-- Example Policy: Users can see their own orders (if auth is linked)
-- CREATE POLICY "Users can view own orders" ON ecommerce_orders
-- FOR SELECT USING (auth.uid() IN (SELECT id FROM users WHERE email = ecommerce_customers.email)); 
-- (This requires linking auth.users to ecommerce_customers)
