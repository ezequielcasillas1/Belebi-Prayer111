-- Fix RLS policies for user_language_preferences to support UPSERT
-- The original policies were missing WITH CHECK on UPDATE, causing upsert failures

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own language preferences" ON user_language_preferences;
DROP POLICY IF EXISTS "Users can update own language preferences" ON user_language_preferences;
DROP POLICY IF EXISTS "Users can modify own language preferences" ON user_language_preferences;
DROP POLICY IF EXISTS "Users can insert own language preferences" ON user_language_preferences;

-- Create proper policies that work with UPSERT
-- SELECT: Users can read their own preferences
CREATE POLICY "user_language_preferences_select"
    ON user_language_preferences FOR SELECT
    USING (auth.uid() = user_id);

-- INSERT: Users can insert their own preferences
CREATE POLICY "user_language_preferences_insert"
    ON user_language_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- UPDATE: Users can update their own preferences (needs USING and WITH CHECK for UPSERT)
CREATE POLICY "user_language_preferences_update"
    ON user_language_preferences FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- DELETE: Users can delete their own preferences
CREATE POLICY "user_language_preferences_delete"
    ON user_language_preferences FOR DELETE
    USING (auth.uid() = user_id);
