-- Global Prayer Requests Table
-- For the main prayer feed (non-church prayers)

-- Global prayer requests
CREATE TABLE IF NOT EXISTS public.prayer_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requester_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    request_text TEXT NOT NULL,
    description TEXT,
    profile_images TEXT[] DEFAULT '{}',
    emergency_images TEXT[] DEFAULT '{}',
    auto_dismiss_time VARCHAR(20) NOT NULL DEFAULT '1month' 
        CHECK (auto_dismiss_time IN ('1month', '6months', '1year')),
    prayers_sent_count INTEGER NOT NULL DEFAULT 0,
    detected_language VARCHAR(10) DEFAULT 'en',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Sent prayers (when someone prays for a global request)
CREATE TABLE IF NOT EXISTS public.sent_prayers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    prayer_request_id UUID NOT NULL REFERENCES public.prayer_requests(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prayer_text TEXT NOT NULL,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(prayer_request_id, sender_id)
);

-- Auto-assignments (for auto mode)
CREATE TABLE IF NOT EXISTS public.auto_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prayer_request_id UUID NOT NULL REFERENCES public.prayer_requests(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    UNIQUE(user_id)
);

-- Planned prayers (for plan prayer feature)
CREATE TABLE IF NOT EXISTS public.planned_prayers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    prayer_request_id UUID NOT NULL REFERENCES public.prayer_requests(id) ON DELETE CASCADE,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMPTZ NOT NULL,
    UNIQUE(user_id)
);

-- Country prayer stats (cached counts)
CREATE TABLE IF NOT EXISTS public.country_prayer_stats (
    country_code VARCHAR(3) PRIMARY KEY,
    active_requests INTEGER NOT NULL DEFAULT 0,
    total_prayers_sent INTEGER NOT NULL DEFAULT 0,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_prayer_requests_requester ON public.prayer_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_active ON public.prayer_requests(is_active, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_prayer_requests_expires ON public.prayer_requests(expires_at) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_sent_prayers_sender ON public.sent_prayers(sender_id);
CREATE INDEX IF NOT EXISTS idx_sent_prayers_request ON public.sent_prayers(prayer_request_id);
CREATE INDEX IF NOT EXISTS idx_auto_assignments_user ON public.auto_assignments(user_id);
CREATE INDEX IF NOT EXISTS idx_planned_prayers_user ON public.planned_prayers(user_id);

-- Enable RLS
ALTER TABLE public.prayer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sent_prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auto_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.planned_prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.country_prayer_stats ENABLE ROW LEVEL SECURITY;

-- Prayer requests policies
CREATE POLICY "Anyone can view active prayer requests"
    ON public.prayer_requests FOR SELECT
    USING (is_active = true OR requester_id = auth.uid());

CREATE POLICY "Users can create prayer requests"
    ON public.prayer_requests FOR INSERT
    WITH CHECK (requester_id = auth.uid());

CREATE POLICY "Users can update own prayer requests"
    ON public.prayer_requests FOR UPDATE
    USING (requester_id = auth.uid());

CREATE POLICY "Users can delete own prayer requests"
    ON public.prayer_requests FOR DELETE
    USING (requester_id = auth.uid());

-- Sent prayers policies
CREATE POLICY "Users can view their sent prayers"
    ON public.sent_prayers FOR SELECT
    USING (sender_id = auth.uid());

CREATE POLICY "Request owners can view prayers for their requests"
    ON public.sent_prayers FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.prayer_requests
            WHERE id = sent_prayers.prayer_request_id AND requester_id = auth.uid()
        )
    );

CREATE POLICY "Users can send prayers"
    ON public.sent_prayers FOR INSERT
    WITH CHECK (sender_id = auth.uid());

-- Auto-assignments policies
CREATE POLICY "Users can view own auto-assignments"
    ON public.auto_assignments FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own auto-assignments"
    ON public.auto_assignments FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own auto-assignments"
    ON public.auto_assignments FOR DELETE
    USING (user_id = auth.uid());

-- Planned prayers policies
CREATE POLICY "Users can view own planned prayers"
    ON public.planned_prayers FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can create own planned prayers"
    ON public.planned_prayers FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own planned prayers"
    ON public.planned_prayers FOR DELETE
    USING (user_id = auth.uid());

-- Country stats - readable by all authenticated
CREATE POLICY "Anyone can view country stats"
    ON public.country_prayer_stats FOR SELECT
    USING (auth.role() = 'authenticated');

-- Function to set expiration date based on auto_dismiss_time
CREATE OR REPLACE FUNCTION set_prayer_expiration()
RETURNS TRIGGER AS $$
BEGIN
    NEW.expires_at := CASE NEW.auto_dismiss_time
        WHEN '1month' THEN NEW.created_at + INTERVAL '1 month'
        WHEN '6months' THEN NEW.created_at + INTERVAL '6 months'
        WHEN '1year' THEN NEW.created_at + INTERVAL '1 year'
        ELSE NEW.created_at + INTERVAL '1 month'
    END;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_set_prayer_expiration
    BEFORE INSERT ON public.prayer_requests
    FOR EACH ROW
    EXECUTE FUNCTION set_prayer_expiration();

-- Function to increment prayer count when prayer is sent
CREATE OR REPLACE FUNCTION increment_prayer_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.prayer_requests
    SET prayers_sent_count = prayers_sent_count + 1, updated_at = NOW()
    WHERE id = NEW.prayer_request_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_increment_prayer_count
    AFTER INSERT ON public.sent_prayers
    FOR EACH ROW
    EXECUTE FUNCTION increment_prayer_count();

-- Function to update country stats
CREATE OR REPLACE FUNCTION update_country_stats()
RETURNS TRIGGER AS $$
DECLARE
    requester_country VARCHAR(3);
BEGIN
    SELECT country_code INTO requester_country
    FROM public.profiles WHERE id = NEW.requester_id;
    
    INSERT INTO public.country_prayer_stats (country_code, active_requests, last_updated)
    VALUES (requester_country, 1, NOW())
    ON CONFLICT (country_code) DO UPDATE
    SET active_requests = country_prayer_stats.active_requests + 1,
        last_updated = NOW();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_country_stats
    AFTER INSERT ON public.prayer_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_country_stats();

-- Update timestamp trigger
CREATE TRIGGER trigger_prayer_requests_updated_at
    BEFORE UPDATE ON public.prayer_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();
