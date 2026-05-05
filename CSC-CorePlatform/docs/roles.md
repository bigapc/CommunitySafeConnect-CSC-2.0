# Roles Reference — CSC-CorePlatform

## Public-App Roles (CommunitySafeConnect)

These roles give access to the community-facing `/public-app` only.

| Role | Description | Provisioned By |
|------|-------------|----------------|
| `community_member` | Standard self-registered community user | Self-registration |
| `verified_responder` | Trained/verified emergency responder | Organization leader or APC Admin |
| `organization_member` | Member of a registered safety organization | Organization leader |
| `organization_leader` | Administrator of a registered safety organization | APC Admin |

## Control-Hub Roles (APC Staff Only)

These roles give access to the internal `/control-hub` only. They must **never** be assigned via self-registration.

| Role | Description | Provisioned By |
|------|-------------|----------------|
| `apc_dispatcher` | Front-line dispatcher — creates and manages live incidents | APC Admin |
| `apc_admin` | Full administrative access to the Control Hub | APC Admin (restricted) |
| `apc_security_reviewer` | Read-only access for security auditing and compliance | APC Admin |

## Role Assignment

Roles are stored in `user_metadata.role` in Supabase Auth and mirrored in the `profiles.role` column.

Roles are assigned **only** by APC Admins using the Supabase Admin API (service role key, server-side only):

```ts
await supabaseAdmin.auth.admin.updateUserById(userId, {
  user_metadata: { role: 'apc_dispatcher' },
});
```

## Role Hierarchy

```
apc_admin
  └── apc_dispatcher
  └── apc_security_reviewer
  └── organization_leader
        └── organization_member
        └── verified_responder
              └── community_member
```

> Note: This hierarchy is conceptual. Permissions are enforced by RLS policies, not inheritance.
