# CommunitySafeConnect — CSC-CorePlatform 2.0

Premium community safety platform built on Next.js + Supabase.

## Repository Structure

```
CommunitySafeConnect-CSC-2.0/
│
└── CSC-CorePlatform/        # Main monorepo (apps, DB, shared code, docs)
    ├── apps/
    │   ├── public-app/      # CommunitySafeConnect (community user app)
    │   └── control-hub/     # APC Dispatcher Control Hub (APC staff only)
    ├── supabase/            # DB schema, RLS policies, Edge Functions
    ├── shared/              # Shared TypeScript types, constants, utils
    └── docs/                # Architecture, security rules, role reference
```

See [`CSC-CorePlatform/README.md`](CSC-CorePlatform/README.md) for full setup instructions.
