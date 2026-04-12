-- =============================================================================
-- CSC-CorePlatform — Initial Schema Migration
-- Migration: 0001_initial_schema.sql
-- =============================================================================

-- Enable the pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ── Helper: current user role ─────────────────────────────────────────────────
-- Defined here so it is available to RLS policies in this migration file.
-- It reads the role from the JWT user_metadata claim injected by Supabase Auth.
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' ->> 'role',
    'anon'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ── profiles ─────────────────────────────────────────────────────────────────
-- Extends Supabase auth.users with application-level profile data.
-- Note: column names use snake_case to match the PostgreSQL convention.
--       TypeScript interfaces use camelCase — the mapping layer handles conversion.
CREATE TABLE IF NOT EXISTS profiles (
  id         UUID        PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name  TEXT,
  role       TEXT        NOT NULL DEFAULT 'community_member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "users_read_own_profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile (non-role fields)
CREATE POLICY "users_update_own_profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- APC admins can read all profiles
CREATE POLICY "apc_admin_read_all_profiles"
  ON profiles FOR SELECT
  USING (current_user_role() IN ('apc_admin', 'apc_security_reviewer'));
