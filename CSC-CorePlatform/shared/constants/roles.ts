// CSC-CorePlatform — Role Constants
import type { CSCRole } from '../types';

// ── Public-app roles ──────────────────────────────────────────────────────────

/** Roles that have access to the public CommunitySafeConnect app. */
export const PUBLIC_APP_ROLES: CSCRole[] = [
  'community_member',
  'verified_responder',
  'organization_member',
  'organization_leader',
];

// ── Control-hub roles (APC staff) ─────────────────────────────────────────────

/** Roles that have access to the APC Dispatcher Control Hub. */
export const CONTROL_HUB_ROLES: CSCRole[] = [
  'apc_dispatcher',
  'apc_admin',
  'apc_security_reviewer',
];

/** All roles combined. */
export const ALL_ROLES: CSCRole[] = [...PUBLIC_APP_ROLES, ...CONTROL_HUB_ROLES];

// ── Helper predicates ─────────────────────────────────────────────────────────

/** Returns true if the given role is allowed to access the Control Hub. */
export function isControlHubRole(role: string): role is CSCRole {
  return (CONTROL_HUB_ROLES as string[]).includes(role);
}

/** Returns true if the given role is a public-app role. */
export function isPublicAppRole(role: string): role is CSCRole {
  return (PUBLIC_APP_ROLES as string[]).includes(role);
}
