# Architecture — CSC-CorePlatform

## Overview

CSC-CorePlatform is a **monorepo** housing two separate Next.js applications backed by a single Supabase project.

```
Internet
    │
    ├── /public-app  ──→  CommunitySafeConnect  (community users)
    │                         │
    │                         └── Supabase (RLS: public roles)
    │
    └── /control-hub ──→  APC Dispatcher Control Hub  (APC staff)
                              │
                              ├── Server-side role check (middleware)
                              ├── Access log write
                              └── Supabase (RLS: APC roles + service role)
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Frontend (both apps) | Next.js 14+ (App Router) |
| Authentication | Supabase Auth (JWT, magic link, OAuth) |
| Database | Supabase / PostgreSQL |
| Row-Level Security | Supabase RLS policies |
| Edge Functions | Supabase Edge Functions (Deno) |
| Shared types/utils | TypeScript (workspace package `@csc/shared`) |
| Deployment | Vercel (public-app) + Vercel (control-hub, private) |

## Data Flow

### Public App

1. User signs in via Supabase Auth → receives JWT with `user_metadata.role`.
2. Next.js middleware reads role from JWT; redirects if role is not in `PUBLIC_APP_ROLES`.
3. Database queries are filtered by RLS policies that check `current_user_role()`.

### Control Hub

1. APC staff sign in via Supabase Auth → receives JWT with `user_metadata.role`.
2. **Next.js middleware** checks role is in `CONTROL_HUB_ROLES` on **every request**.
3. Failed access attempts are logged to `control_hub_access_log` via the service role.
4. Database queries are filtered by APC-specific RLS policies.

## Monorepo Layout

```
CSC-CorePlatform/
├── apps/
│   ├── public-app/        Next.js app — community users
│   └── control-hub/       Next.js app — APC staff only
├── supabase/
│   ├── migrations/        Versioned SQL migrations
│   ├── functions/         Supabase Edge Functions
│   ├── roles.sql          Custom role definitions
│   └── policies.sql       RLS policy stubs
├── shared/
│   ├── types/             Shared TypeScript types
│   ├── constants/         Role constants & helpers
│   └── utils/             Shared utility functions
└── docs/
    ├── architecture.md    This file
    ├── security-rules.md  Security requirements
    └── roles.md           Role reference
```

## Supabase Project Setup

1. Create a new Supabase project.
2. Copy `.env.example` → `.env` and fill in credentials.
3. Run `supabase db push` to apply migrations.
4. Create user accounts and set `user_metadata.role` via the Supabase Admin API.
