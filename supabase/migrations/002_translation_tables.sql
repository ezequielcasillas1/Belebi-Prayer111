-- Translation Service Tables
-- Supports automatic language detection and 1-to-1 translation operations

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

-- Indexes for performance
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

-- RLS Policies
ALTER TABLE user_language_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE translation_jobs ENABLE ROW LEVEL SECURITY;

-- User can read and update their own language preferences
CREATE POLICY "Users can view own language preferences"
    ON user_language_preferences FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own language preferences"
    ON user_language_preferences FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can modify own language preferences"
    ON user_language_preferences FOR UPDATE
    USING (auth.uid() = user_id);

-- Content translations are readable by all authenticated users
CREATE POLICY "Authenticated users can view translations"
    ON content_translations FOR SELECT
    USING (auth.role() = 'authenticated');

-- Only service role can insert/update translations
CREATE POLICY "Service role can manage translations"
    ON content_translations FOR ALL
    USING (auth.role() = 'service_role');

-- Translation jobs only accessible by service role
CREATE POLICY "Service role can manage translation jobs"
    ON translation_jobs FOR ALL
    USING (auth.role() = 'service_role');

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_translation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for auto-updating timestamps
CREATE TRIGGER update_user_language_preferences_timestamp
    BEFORE UPDATE ON user_language_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_translation_timestamp();

CREATE TRIGGER update_content_translations_timestamp
    BEFORE UPDATE ON content_translations
    FOR EACH ROW
    EXECUTE FUNCTION update_translation_timestamp();
