-- =============================================================================
-- CSC-CorePlatform — Row-Level Security (RLS) Policy Stubs
-- =============================================================================
-- Enable RLS on each table and define per-role access policies.
-- Replace <table_name> with actual table names as the schema is built out.
-- =============================================================================

-- ── Helper: current user role ─────────────────────────────────────────────────
-- This function reads the role from the JWT claim injected by Supabase Auth.
CREATE OR REPLACE FUNCTION current_user_role()
RETURNS TEXT AS $$
  SELECT COALESCE(
    current_setting('request.jwt.claims', true)::jsonb -> 'user_metadata' ->> 'role',
    'anon'
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;


-- ── Incidents table ───────────────────────────────────────────────────────────
-- ALTER TABLE incidents ENABLE ROW LEVEL SECURITY;

-- Community members can see incidents in their area
-- CREATE POLICY "community_member_read_incidents"
--   ON incidents FOR SELECT
--   USING (current_user_role() IN ('community_member', 'verified_responder', 'organization_member', 'organization_leader'));

-- Only APC dispatchers and admins can create/update incidents
-- CREATE POLICY "apc_dispatcher_write_incidents"
--   ON incidents FOR INSERT
--   USING (current_user_role() IN ('apc_dispatcher', 'apc_admin'));

-- CREATE POLICY "apc_dispatcher_update_incidents"
--   ON incidents FOR UPDATE
--   USING (current_user_role() IN ('apc_dispatcher', 'apc_admin'));

-- Security reviewers have read-only access to all tables
-- CREATE POLICY "apc_security_reviewer_read_incidents"
--   ON incidents FOR SELECT
--   USING (current_user_role() = 'apc_security_reviewer');


-- ── Access Log table ──────────────────────────────────────────────────────────
-- Records every Control Hub access attempt for audit purposes.
CREATE TABLE IF NOT EXISTS control_hub_access_log (
  id          BIGSERIAL PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  user_role   TEXT,
  path        TEXT        NOT NULL,
  ip_address  TEXT,
  accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  success     BOOLEAN     NOT NULL
);

ALTER TABLE control_hub_access_log ENABLE ROW LEVEL SECURITY;

-- Only APC admins and security reviewers can read the access log
CREATE POLICY "apc_can_read_access_log"
  ON control_hub_access_log FOR SELECT
  USING (current_user_role() IN ('apc_admin', 'apc_security_reviewer'));

-- The service role (server-side only) inserts log entries.
-- auth.role() returns 'service_role' when the service role key is used.
CREATE POLICY "service_role_insert_access_log"
  ON control_hub_access_log FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
