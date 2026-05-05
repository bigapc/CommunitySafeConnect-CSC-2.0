-- =============================================================================
-- CSC-CorePlatform — Custom Role Definitions
-- =============================================================================
-- Run this migration once during initial project setup.
-- These roles map to the `user_metadata.role` field set by APC Admin when
-- provisioning accounts via the Supabase Auth admin API.
-- =============================================================================

-- ── Community / Public-App Roles ──────────────────────────────────────────────

-- Standard community user — default role for self-registered accounts
CREATE ROLE IF NOT EXISTS community_member;

-- Trained or verified emergency responder
CREATE ROLE IF NOT EXISTS verified_responder;

-- Member of a registered safety organization
CREATE ROLE IF NOT EXISTS organization_member;

-- Leader / administrator of a registered safety organization
CREATE ROLE IF NOT EXISTS organization_leader;


-- ── APC Staff / Control-Hub Roles ─────────────────────────────────────────────

-- Front-line dispatcher: creates and manages live incidents
CREATE ROLE IF NOT EXISTS apc_dispatcher;

-- Full administrative access to the Control Hub
CREATE ROLE IF NOT EXISTS apc_admin;

-- Read-only access for security auditing and compliance review
CREATE ROLE IF NOT EXISTS apc_security_reviewer;
