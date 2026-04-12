// CSC-CorePlatform — Shared TypeScript Types
// These types are used by both public-app and control-hub.

// ── Roles ────────────────────────────────────────────────────────────────────

/** All roles recognised by the CSC-CorePlatform. */
export type CSCRole =
  // Public-app roles
  | 'community_member'
  | 'verified_responder'
  | 'organization_member'
  | 'organization_leader'
  // Control-hub roles (APC staff)
  | 'apc_dispatcher'
  | 'apc_admin'
  | 'apc_security_reviewer';

// ── User / Profile ────────────────────────────────────────────────────────────

export interface UserProfile {
  /** Matches the `id` column in the `profiles` table (UUID). */
  id: string;
  /** Mapped from the `full_name` column (snake_case → camelCase). */
  full_name: string | null;
  role: CSCRole;
  created_at: string;
  updated_at: string;
}

// ── Incidents ─────────────────────────────────────────────────────────────────

export type IncidentStatus = 'open' | 'in_progress' | 'resolved' | 'closed';

export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Incident {
  id: string;
  title: string;
  description: string | null;
  status: IncidentStatus;
  severity: IncidentSeverity;
  /** Mapped from `reported_by` column. */
  reported_by: string;
  /** Mapped from `assigned_to` column. */
  assigned_to: string | null;
  created_at: string;
  updated_at: string;
}

// ── Access Log ────────────────────────────────────────────────────────────────

export interface ControlHubAccessLog {
  id: number;
  user_id: string | null;
  user_role: string | null;
  path: string;
  ip_address: string | null;
  accessed_at: string;
  success: boolean;
}
