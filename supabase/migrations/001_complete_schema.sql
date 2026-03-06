-- Complete Schema for Belebi Prayer
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/eyadwuourplswhjowiwj/sql/new

-- ============================================
-- PART 1: BASE SCHEMA (profiles, churches, etc.)
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  country TEXT NOT NULL,
  country_code TEXT NOT NULL,
  flag TEXT NOT NULL,
  denomination TEXT NOT NULL DEFAULT 'Prefer not to say',
  is_verified_leader BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Churches table
CREATE TABLE IF NOT EXISTS public.churches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  denomination TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL DEFAULT '',
  creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Church members junction table
CREATE TABLE IF NOT EXISTS public.church_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, church_id)
);

-- Church prayers (prayer requests within a church)
CREATE TABLE IF NOT EXISTS public.church_prayers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  church_id UUID NOT NULL REFERENCES public.churches(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  request_text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- Prayer responses (prayers sent in response to a church prayer)
CREATE TABLE IF NOT EXISTS public.prayer_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prayer_id UUID NOT NULL REFERENCES public.church_prayers(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  prayer_text TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_church_members_user_id ON public.church_members(user_id);
CREATE INDEX IF NOT EXISTS idx_church_members_church_id ON public.church_members(church_id);
CREATE INDEX IF NOT EXISTS idx_church_prayers_church_id ON public.church_prayers(church_id);
CREATE INDEX IF NOT EXISTS idx_church_prayers_author_id ON public.church_prayers(author_id);
CREATE INDEX IF NOT EXISTS idx_prayer_responses_prayer_id ON public.prayer_responses(prayer_id);
CREATE INDEX IF NOT EXISTS idx_churches_invite_code ON public.churches(invite_code);

-- ============================================
-- PART 2: HELPER FUNCTIONS (must come before policies)
-- ============================================

-- Helper function to get user's church IDs (bypasses RLS to prevent recursion)
CREATE OR REPLACE FUNCTION get_user_church_ids(check_user_id UUID)
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY SELECT church_id FROM public.church_members WHERE user_id = check_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_user_church_ids TO authenticated;

-- ============================================
-- PART 3: ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_responses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "Users can view profiles of church members" ON public.profiles;
CREATE POLICY "Users can view profiles of church members"
  ON public.profiles FOR SELECT
  USING (
    id IN (
      SELECT cm.user_id 
      FROM public.church_members cm 
      WHERE cm.church_id IN (SELECT get_user_church_ids(auth.uid()))
    )
  );

-- Churches policies
DROP POLICY IF EXISTS "Anyone can view churches they are a member of" ON public.churches;
CREATE POLICY "Anyone can view churches they are a member of"
  ON public.churches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = churches.id AND user_id = auth.uid()
    )
    OR creator_id = auth.uid()
  );

DROP POLICY IF EXISTS "Verified leaders can create churches" ON public.churches;
DROP POLICY IF EXISTS "Authenticated users can create churches" ON public.churches;
CREATE POLICY "Authenticated users can create churches"
  ON public.churches FOR INSERT
  WITH CHECK (creator_id = auth.uid());

DROP POLICY IF EXISTS "Church creators can update their churches" ON public.churches;
CREATE POLICY "Church creators can update their churches"
  ON public.churches FOR UPDATE
  USING (creator_id = auth.uid());

DROP POLICY IF EXISTS "Church creators can delete their churches" ON public.churches;
CREATE POLICY "Church creators can delete their churches"
  ON public.churches FOR DELETE
  USING (creator_id = auth.uid());

-- Church members policies (using helper function to avoid recursion)
DROP POLICY IF EXISTS "Members can view church members" ON public.church_members;
CREATE POLICY "Members can view church members"
  ON public.church_members FOR SELECT
  USING (
    church_id IN (SELECT get_user_church_ids(auth.uid()))
  );

DROP POLICY IF EXISTS "Users can join churches" ON public.church_members;
CREATE POLICY "Users can join churches"
  ON public.church_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can leave churches" ON public.church_members;
CREATE POLICY "Users can leave churches"
  ON public.church_members FOR DELETE
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Church creators can remove members" ON public.church_members;
CREATE POLICY "Church creators can remove members"
  ON public.church_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.churches
      WHERE id = church_members.church_id AND creator_id = auth.uid()
    )
  );

-- Church prayers policies
DROP POLICY IF EXISTS "Members can view church prayers" ON public.church_prayers;
CREATE POLICY "Members can view church prayers"
  ON public.church_prayers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_prayers.church_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can create prayers in their churches" ON public.church_prayers;
CREATE POLICY "Members can create prayers in their churches"
  ON public.church_prayers FOR INSERT
  WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_prayers.church_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Authors can update their prayers" ON public.church_prayers;
CREATE POLICY "Authors can update their prayers"
  ON public.church_prayers FOR UPDATE
  USING (author_id = auth.uid());

DROP POLICY IF EXISTS "Authors can delete their prayers" ON public.church_prayers;
CREATE POLICY "Authors can delete their prayers"
  ON public.church_prayers FOR DELETE
  USING (author_id = auth.uid());

-- Prayer responses policies
DROP POLICY IF EXISTS "Members can view responses to prayers in their churches" ON public.prayer_responses;
CREATE POLICY "Members can view responses to prayers in their churches"
  ON public.prayer_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_prayers cp
      JOIN public.church_members cm ON cm.church_id = cp.church_id
      WHERE cp.id = prayer_responses.prayer_id AND cm.user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "Members can respond to prayers in their churches" ON public.prayer_responses;
CREATE POLICY "Members can respond to prayers in their churches"
  ON public.prayer_responses FOR INSERT
  WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.church_prayers cp
      JOIN public.church_members cm ON cm.church_id = cp.church_id
      WHERE cp.id = prayer_responses.prayer_id AND cm.user_id = auth.uid()
    )
  );

-- ============================================
-- PART 4: FUNCTIONS AND TRIGGERS
-- ============================================

-- Function to generate unique invite code
CREATE OR REPLACE FUNCTION generate_invite_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..8 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate invite code on church creation
CREATE OR REPLACE FUNCTION set_invite_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.invite_code IS NULL OR NEW.invite_code = '' THEN
    NEW.invite_code := generate_invite_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_invite_code ON public.churches;
CREATE TRIGGER trigger_set_invite_code
  BEFORE INSERT ON public.churches
  FOR EACH ROW
  EXECUTE FUNCTION set_invite_code();

-- Trigger to auto-add creator as church member
CREATE OR REPLACE FUNCTION add_creator_as_member()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.church_members (user_id, church_id)
  VALUES (NEW.creator_id, NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_add_creator_as_member ON public.churches;
CREATE TRIGGER trigger_add_creator_as_member
  AFTER INSERT ON public.churches
  FOR EACH ROW
  EXECUTE FUNCTION add_creator_as_member();

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_profiles_updated_at ON public.profiles;
CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS trigger_churches_updated_at ON public.churches;
CREATE TRIGGER trigger_churches_updated_at
  BEFORE UPDATE ON public.churches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

-- Handle new user signup - create profile automatically
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, first_name, country, country_code, flag, denomination)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', 'User'),
    COALESCE(NEW.raw_user_meta_data->>'country', 'Unknown'),
    COALESCE(NEW.raw_user_meta_data->>'country_code', 'XX'),
    COALESCE(NEW.raw_user_meta_data->>'flag', '🌍'),
    COALESCE(NEW.raw_user_meta_data->>'denomination', 'Prefer not to say')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- ============================================
-- PART 5: GLOBAL PRAYER REQUESTS
-- ============================================

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
    expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '1 month',
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
DROP POLICY IF EXISTS "Anyone can view active prayer requests" ON public.prayer_requests;
CREATE POLICY "Anyone can view active prayer requests"
    ON public.prayer_requests FOR SELECT
    USING (is_active = true OR requester_id = auth.uid());

DROP POLICY IF EXISTS "Users can create prayer requests" ON public.prayer_requests;
CREATE POLICY "Users can create prayer requests"
    ON public.prayer_requests FOR INSERT
    WITH CHECK (requester_id = auth.uid());

DROP POLICY IF EXISTS "Users can update own prayer requests" ON public.prayer_requests;
CREATE POLICY "Users can update own prayer requests"
    ON public.prayer_requests FOR UPDATE
    USING (requester_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own prayer requests" ON public.prayer_requests;
CREATE POLICY "Users can delete own prayer requests"
    ON public.prayer_requests FOR DELETE
    USING (requester_id = auth.uid());

-- Sent prayers policies
DROP POLICY IF EXISTS "Users can view their sent prayers" ON public.sent_prayers;
CREATE POLICY "Users can view their sent prayers"
    ON public.sent_prayers FOR SELECT
    USING (sender_id = auth.uid());

DROP POLICY IF EXISTS "Request owners can view prayers for their requests" ON public.sent_prayers;
CREATE POLICY "Request owners can view prayers for their requests"
    ON public.sent_prayers FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.prayer_requests
            WHERE id = sent_prayers.prayer_request_id AND requester_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can send prayers" ON public.sent_prayers;
CREATE POLICY "Users can send prayers"
    ON public.sent_prayers FOR INSERT
    WITH CHECK (sender_id = auth.uid());

-- Auto-assignments policies
DROP POLICY IF EXISTS "Users can view own auto-assignments" ON public.auto_assignments;
CREATE POLICY "Users can view own auto-assignments"
    ON public.auto_assignments FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own auto-assignments" ON public.auto_assignments;
CREATE POLICY "Users can create own auto-assignments"
    ON public.auto_assignments FOR INSERT
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own auto-assignments" ON public.auto_assignments;
CREATE POLICY "Users can delete own auto-assignments"
    ON public.auto_assignments FOR DELETE
    USING (user_id = auth.uid());

-- Planned prayers policies
DROP POLICY IF EXISTS "Users can view own planned prayers" ON public.planned_prayers;
CREATE POLICY "Users can view own planned prayers"
    ON public.planned_prayers FOR SELECT
    USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can create own planned prayers" ON public.planned_prayers;
CREATE POLICY "Users can create own planned prayers"
    ON public.planned_prayers FOR INSERT
    WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own planned prayers" ON public.planned_prayers;
CREATE POLICY "Users can delete own planned prayers"
    ON public.planned_prayers FOR DELETE
    USING (user_id = auth.uid());

-- Country stats - readable by all authenticated
DROP POLICY IF EXISTS "Anyone can view country stats" ON public.country_prayer_stats;
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

DROP TRIGGER IF EXISTS trigger_set_prayer_expiration ON public.prayer_requests;
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

DROP TRIGGER IF EXISTS trigger_increment_prayer_count ON public.sent_prayers;
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

DROP TRIGGER IF EXISTS trigger_update_country_stats ON public.prayer_requests;
CREATE TRIGGER trigger_update_country_stats
    AFTER INSERT ON public.prayer_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_country_stats();

DROP TRIGGER IF EXISTS trigger_prayer_requests_updated_at ON public.prayer_requests;
CREATE TRIGGER trigger_prayer_requests_updated_at
    BEFORE UPDATE ON public.prayer_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- PART 6: TRANSLATION TABLES
-- ============================================

-- User Language Preferences
CREATE TABLE IF NOT EXISTS user_language_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    preferred_language VARCHAR(10) NOT NULL DEFAULT 'en',
    auto_translate BOOLEAN NOT NULL DEFAULT false,
    fallback_language VARCHAR(10) NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Content Translations Cache
CREATE TABLE IF NOT EXISTS content_translations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL CHECK (content_type IN ('prayer_request', 'prayer_response', 'chat_message')),
    original_text TEXT NOT NULL,
    original_language VARCHAR(10) NOT NULL,
    translations JSONB NOT NULL DEFAULT '{}',
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(content_id, content_type)
);

-- Translation Jobs Queue (for background processing)
CREATE TABLE IF NOT EXISTS translation_jobs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL,
    content_type VARCHAR(50) NOT NULL,
    source_language VARCHAR(10) NOT NULL,
    target_languages VARCHAR(10)[] NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'translating', 'completed', 'failed')),
    priority INTEGER NOT NULL DEFAULT 0,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- Indexes for translation tables
CREATE INDEX IF NOT EXISTS idx_user_language_preferences_user_id 
    ON user_language_preferences(user_id);

CREATE INDEX IF NOT EXISTS idx_content_translations_content 
    ON content_translations(content_id, content_type);

CREATE INDEX IF NOT EXISTS idx_content_translations_language 
    ON content_translations(original_language);

CREATE INDEX IF NOT EXISTS idx_translation_jobs_status 
    ON translation_jobs(status) WHERE status = 'pending';

CREATE INDEX IF NOT EXISTS idx_translation_jobs_content 
    ON translation_jobs(content_id, content_type);

-- RLS for translation tables
ALTER TABLE user_language_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_jobs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own language preferences" ON user_language_preferences;
CREATE POLICY "Users can view own language preferences"
    ON user_language_preferences FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own language preferences" ON user_language_preferences;
CREATE POLICY "Users can update own language preferences"
    ON user_language_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can modify own language preferences" ON user_language_preferences;
CREATE POLICY "Users can modify own language preferences"
    ON user_language_preferences FOR UPDATE
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Authenticated users can view translations" ON content_translations;
CREATE POLICY "Authenticated users can view translations"
    ON content_translations FOR SELECT
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Service role can manage translations" ON content_translations;
CREATE POLICY "Service role can manage translations"
    ON content_translations FOR ALL
    USING (auth.role() = 'service_role');

DROP POLICY IF EXISTS "Service role can manage translation jobs" ON translation_jobs;
CREATE POLICY "Service role can manage translation jobs"
    ON translation_jobs FOR ALL
    USING (auth.role() = 'service_role');

-- ============================================
-- DONE! Tables created successfully.
-- ============================================
