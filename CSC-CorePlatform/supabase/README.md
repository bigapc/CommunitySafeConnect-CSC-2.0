# Supabase — Database, Policies, SQL & Edge Functions

This directory contains all Supabase-related configuration for CSC-CorePlatform.

## Directory Layout

```
supabase/
├── migrations/     # Versioned SQL migration files (run via Supabase CLI)
├── functions/      # Supabase Edge Functions (Deno/TypeScript)
├── roles.sql       # Custom role definitions
└── policies.sql    # Row-Level Security (RLS) policy stubs
```

## Running Migrations

```bash
supabase db push           # Apply all pending migrations
supabase db reset          # Reset local DB and replay all migrations
```

## Edge Functions

```bash
supabase functions serve   # Serve all functions locally
supabase functions deploy  # Deploy to Supabase project
```

## Roles

See [`roles.sql`](roles.sql) for the SQL that creates custom database roles.
See [`docs/roles.md`](../docs/roles.md) for the full role reference.
