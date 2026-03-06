-- FIX: Infinite recursion in church_members policy
-- Run this in Supabase SQL Editor

-- First, drop the problematic policies
DROP POLICY IF EXISTS "Members can view church members" ON public.church_members;
DROP POLICY IF EXISTS "Users can view profiles of church members" ON public.profiles;

-- Create a helper function to check church membership (bypasses RLS)
CREATE OR REPLACE FUNCTION is_church_member(check_church_id UUID, check_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.church_members
    WHERE church_id = check_church_id AND user_id = check_user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user's church IDs (bypasses RLS)
CREATE OR REPLACE FUNCTION get_user_church_ids(check_user_id UUID)
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY SELECT church_id FROM public.church_members WHERE user_id = check_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Now create the fixed policies

-- Church members: Users can view members of churches they belong to
CREATE POLICY "Members can view church members"
  ON public.church_members FOR SELECT
  USING (
    church_id IN (SELECT get_user_church_ids(auth.uid()))
  );

-- Profiles: Users can view profiles of people in their churches
CREATE POLICY "Users can view profiles of church members"
  ON public.profiles FOR SELECT
  USING (
    id IN (
      SELECT cm.user_id 
      FROM public.church_members cm 
      WHERE cm.church_id IN (SELECT get_user_church_ids(auth.uid()))
    )
  );

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION is_church_member TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_church_ids TO authenticated;
