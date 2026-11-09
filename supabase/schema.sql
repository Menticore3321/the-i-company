-- ============================================================
-- THE I COMPANY · ENTERPRISE DATABASE SCHEMA & INITIAL DATA
-- PostgreSQL / Supabase Migration
-- ============================================================

-- 1. ACCOUNTS & ACCESS CREDENTIALS TABLE
CREATE TABLE IF NOT EXISTS public.accounts (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('agency', 'brand', 'influencer')),
    name TEXT NOT NULL,
    associated_id TEXT,
    avatar TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    last_login TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. INFLUENCERS / CREATORS TABLE
CREATE TABLE IF NOT EXISTS public.influencers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    handle TEXT UNIQUE NOT NULL,
    avatar TEXT,
    bio TEXT,
    category TEXT NOT NULL,
    tier TEXT NOT NULL,
    location TEXT,
    followers BIGINT DEFAULT 0,
    following INTEGER DEFAULT 0,
    posts_count INTEGER DEFAULT 0,
    engagement_rate NUMERIC(5,2) DEFAULT 0,
    avg_reel_views BIGINT DEFAULT 0,
    avg_likes BIGINT DEFAULT 0,
    avg_comments INTEGER DEFAULT 0,
    authenticity_score INTEGER DEFAULT 90,
    rate_per_reel NUMERIC(12,2) DEFAULT 0,
    rate_per_story NUMERIC(12,2) DEFAULT 0,
    rate_per_post NUMERIC(12,2) DEFAULT 0,
    rating NUMERIC(3,2) DEFAULT 5.0,
    performance_status TEXT DEFAULT 'stable',
    progress_trajectory JSONB,
    audience JSONB,
    recent_content JSONB,
    connected_instagram BOOLEAN DEFAULT true,
    last_synced_at TEXT,
    login_email TEXT,
    login_password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. BRANDS TABLE
CREATE TABLE IF NOT EXISTS public.brands (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    logo TEXT,
    industry TEXT,
    contact_email TEXT,
    active_campaigns_count INTEGER DEFAULT 0,
    total_spent NUMERIC(14,2) DEFAULT 0,
    escrow_balance NUMERIC(14,2) DEFAULT 0,
    login_email TEXT,
    login_password TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. CAMPAIGNS TABLE
CREATE TABLE IF NOT EXISTS public.campaigns (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand_id TEXT REFERENCES public.brands(id) ON DELETE SET NULL,
    brand_name TEXT NOT NULL,
    niche TEXT NOT NULL,
    total_budget NUMERIC(14,2) DEFAULT 0,
    spent_budget NUMERIC(14,2) DEFAULT 0,
    agency_margin_rate NUMERIC(4,2) DEFAULT 0.20,
    status TEXT DEFAULT 'production',
    start_date TEXT,
    end_date TEXT,
    target_deliverables JSONB,
    assigned_influencers JSONB,
    deliverables JSONB,
    projected_metrics JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. FINANCIALS & ESCROW LEDGER TABLE
CREATE TABLE IF NOT EXISTS public.financials (
    id TEXT PRIMARY KEY DEFAULT 'primary-ledger',
    total_gmv NUMERIC(14,2) DEFAULT 11550000,
    agency_revenue NUMERIC(14,2) DEFAULT 2310000,
    creators_paid NUMERIC(14,2) DEFAULT 5400000,
    escrow_held NUMERIC(14,2) DEFAULT 3840000,
    active_deals_count INTEGER DEFAULT 6,
    recent_transactions JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.influencers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financials ENABLE ROW LEVEL SECURITY;

-- Allow Public/Anon Read & Upsert for Demo & API Access
CREATE POLICY "Public full access accounts" ON public.accounts FOR ALL USING (true);
CREATE POLICY "Public full access influencers" ON public.influencers FOR ALL USING (true);
CREATE POLICY "Public full access brands" ON public.brands FOR ALL USING (true);
CREATE POLICY "Public full access campaigns" ON public.campaigns FOR ALL USING (true);
CREATE POLICY "Public full access financials" ON public.financials FOR ALL USING (true);

-- Indexes for lightning fast queries
CREATE INDEX IF NOT EXISTS idx_influencers_category ON public.influencers(category);
CREATE INDEX IF NOT EXISTS idx_influencers_handle ON public.influencers(handle);
CREATE INDEX IF NOT EXISTS idx_campaigns_brand_id ON public.campaigns(brand_id);
CREATE INDEX IF NOT EXISTS idx_accounts_email ON public.accounts(email);
