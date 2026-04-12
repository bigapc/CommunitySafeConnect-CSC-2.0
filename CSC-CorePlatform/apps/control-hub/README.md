# control-hub — APC Dispatcher Control Hub

> 🔐 **APC STAFF ONLY — This app must never be exposed in public navigation or accessible without a valid APC role.**

This is the internal administration and dispatch interface for APC (Area Protection Command) staff.

## Route

```
/control-hub
```

## Access Control Requirements

1. **Route isolation** — Served on a separate route and, where possible, a separate deployment from the public app.
2. **Server-side role verification** — Every request must verify the caller holds an APC role via Supabase RLS / middleware before rendering any page.
3. **Access logging** — All access attempts (successful and failed) must be logged with timestamp, user ID, IP, and role.
4. **No public navigation links** — The `/control-hub` path must not appear in any navigation menu visible to public-app users.

## Allowed Roles (APC Staff Only)

| Role | Description |
|------|-------------|
| `apc_dispatcher` | Front-line dispatcher — creates/manages incidents |
| `apc_admin` | Full administrative access |
| `apc_security_reviewer` | Read-only security & audit access |

## Middleware Pattern (Next.js example)

```ts
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const APC_ROLES = ['apc_dispatcher', 'apc_admin', 'apc_security_reviewer'];

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  const userRole = session.user.user_metadata?.role as string | undefined;

  if (!userRole || !APC_ROLES.includes(userRole)) {
    // Log unauthorized access attempt
    console.warn('[control-hub] Unauthorized access attempt', {
      userId: session.user.id,
      role: userRole,
      path: req.nextUrl.pathname,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return res;
}

export const config = {
  matcher: ['/control-hub/:path*'],
};
```

## Development

```bash
# From CSC-CorePlatform root
npm run dev:hub
```
