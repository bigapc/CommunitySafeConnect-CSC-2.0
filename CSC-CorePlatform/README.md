# CSC-CorePlatform

**CommunitySafeConnect — Premium Community Safety Platform**

## Monorepo Structure

```
CSC-CorePlatform/
│
├── apps/
│   ├── public-app/          # CommunitySafeConnect (community user app)
│   └── control-hub/         # APC Dispatcher Control Hub (APC staff only)
│
├── supabase/                # Database schema, RLS policies, SQL, Edge Functions
│
├── shared/                  # Shared TypeScript types, utilities, role constants
│
├── docs/                    # Architecture, security rules, planning documents
│
├── .env.example             # Environment variable template (copy → .env)
├── package.json             # Monorepo workspace config
└── README.md                # This file
```

## Apps

| App | Route | Audience |
|-----|-------|----------|
| `public-app` | `/public-app` | Community members & verified responders |
| `control-hub` | `/control-hub` | APC Dispatchers, Admins & Security Reviewers only |

> ⚠️ **The Control Hub must never appear in public navigation and requires server-side role verification on every request.**

## Roles

See [`docs/roles.md`](docs/roles.md) for full role definitions.

| Role | Scope |
|------|-------|
| `community_member` | Public app |
| `verified_responder` | Public app |
| `organization_member` | Public app |
| `organization_leader` | Public app |
| `apc_dispatcher` | Control Hub |
| `apc_admin` | Control Hub |
| `apc_security_reviewer` | Control Hub |

## Getting Started

```bash
# 1. Copy environment template
cp .env.example .env
# 2. Fill in your Supabase credentials in .env

# 3. Install dependencies (Node ≥ 18 required)
npm install

# 4. Start the community user app
npm run dev:public

# 5. Start the APC Control Hub (requires APC role)
npm run dev:hub
```

## Documentation

- [Architecture](docs/architecture.md)
- [Security Rules](docs/security-rules.md)
- [Roles Reference](docs/roles.md)
