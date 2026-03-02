-- Supabase Schema for Belebi Prayer Church Communities
-- Run this in the Supabase SQL Editor

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
  invite_code TEXT UNIQUE NOT NULL,
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

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.churches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.church_prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prayer_responses ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Allow viewing profiles of church members (for displaying prayer authors)
CREATE POLICY "Users can view profiles of church members"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members cm1
      JOIN public.church_members cm2 ON cm1.church_id = cm2.church_id
      WHERE cm1.user_id = auth.uid() AND cm2.user_id = profiles.id
    )
  );

-- Churches policies
CREATE POLICY "Anyone can view churches they are a member of"
  ON public.churches FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = churches.id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Verified leaders can create churches"
  ON public.churches FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_verified_leader = TRUE
    )
  );

CREATE POLICY "Church creators can update their churches"
  ON public.churches FOR UPDATE
  USING (creator_id = auth.uid());

CREATE POLICY "Church creators can delete their churches"
  ON public.churches FOR DELETE
  USING (creator_id = auth.uid());

-- Church members policies
CREATE POLICY "Members can view church members"
  ON public.church_members FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members cm
      WHERE cm.church_id = church_members.church_id AND cm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can join churches"
  ON public.church_members FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can leave churches"
  ON public.church_members FOR DELETE
  USING (user_id = auth.uid());

CREATE POLICY "Church creators can remove members"
  ON public.church_members FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.churches
      WHERE id = church_members.church_id AND creator_id = auth.uid()
    )
  );

-- Church prayers policies
CREATE POLICY "Members can view church prayers"
  ON public.church_prayers FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_prayers.church_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create prayers in their churches"
  ON public.church_prayers FOR INSERT
  WITH CHECK (
    author_id = auth.uid() AND
    EXISTS (
      SELECT 1 FROM public.church_members
      WHERE church_id = church_prayers.church_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Authors can update their prayers"
  ON public.church_prayers FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their prayers"
  ON public.church_prayers FOR DELETE
  USING (author_id = auth.uid());

-- Prayer responses policies
CREATE POLICY "Members can view responses to prayers in their churches"
  ON public.prayer_responses FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.church_prayers cp
      JOIN public.church_members cm ON cm.church_id = cp.church_id
      WHERE cp.id = prayer_responses.prayer_id AND cm.user_id = auth.uid()
    )
  );

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

-- Functions

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

CREATE TRIGGER trigger_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();

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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();
