-- Migration to create donations table for Support Us tiers
-- Created: 2026-02-17

-- 1. Create Donations Table
CREATE TABLE IF NOT EXISTS supporter_donations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    donation_number TEXT UNIQUE NOT NULL, -- e.g. DON-XXXX
    stripe_session_id TEXT UNIQUE,
    stripe_payment_intent_id TEXT,

    -- Supporter Details
    supporter_name TEXT,
    supporter_email TEXT NOT NULL,
    supporter_note TEXT,
    mailing_address TEXT,

    -- Donation Details
    tier_id TEXT NOT NULL, -- 'archivist', 'emblem', 'patron', 'support-universe'
    tier_name TEXT NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'usd',

    -- Status
    status TEXT DEFAULT 'pending', -- pending, paid, refunded
    payment_status TEXT DEFAULT 'unpaid',

    -- Metadata
    metadata JSONB DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Indexes
CREATE INDEX IF NOT EXISTS idx_supporter_donations_email ON supporter_donations(supporter_email);
CREATE INDEX IF NOT EXISTS idx_supporter_donations_stripe_session_id ON supporter_donations(stripe_session_id);
CREATE INDEX IF NOT EXISTS idx_supporter_donations_tier_id ON supporter_donations(tier_id);

-- 3. Add RLS Policies
ALTER TABLE supporter_donations ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (default)
-- Add other policies if needed for public/user access
