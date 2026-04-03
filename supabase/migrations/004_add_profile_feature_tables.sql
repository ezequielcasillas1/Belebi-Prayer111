-- Migration: add_profile_feature_tables
-- Created: 2026-04-03
-- Description: Adds tables for profile feature - answered prayers and milestones

-- Answered Prayers / Testimonies table
CREATE TABLE answered_prayers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  prayer_request_id uuid REFERENCES prayer_requests(id) ON DELETE SET NULL,
  testimony_text text NOT NULL,
  is_public boolean DEFAULT false,
  answered_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- User Milestones table
CREATE TABLE user_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  milestone_key varchar(50) NOT NULL,
  achieved_at timestamptz DEFAULT now(),
  UNIQUE(user_id, milestone_key)
);

-- Create indexes for performance
CREATE INDEX idx_answered_prayers_user_id ON answered_prayers(user_id);
CREATE INDEX idx_answered_prayers_is_public ON answered_prayers(is_public) WHERE is_public = true;
CREATE INDEX idx_user_milestones_user_id ON user_milestones(user_id);

-- Enable RLS
ALTER TABLE answered_prayers ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_milestones ENABLE ROW LEVEL SECURITY;

-- RLS Policies for answered_prayers
CREATE POLICY "Users can view their own answered prayers" ON answered_prayers
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view public answered prayers" ON answered_prayers
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can insert their own answered prayers" ON answered_prayers
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own answered prayers" ON answered_prayers
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own answered prayers" ON answered_prayers
  FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for user_milestones
CREATE POLICY "Users can view their own milestones" ON user_milestones
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own milestones" ON user_milestones
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON TABLE answered_prayers IS 'Stores user testimonies of answered prayers';
COMMENT ON TABLE user_milestones IS 'Tracks spiritual milestones achieved by users';
COMMENT ON COLUMN user_milestones.milestone_key IS 'Milestone types: faithful_intercessor, steadfast_in_prayer, nations_advocate, church_pillar, emergency_responder, prayer_warrior, intercessor_100, daily_devoted';
