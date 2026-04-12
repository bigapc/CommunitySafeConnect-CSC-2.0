# Security Rules — CSC-CorePlatform

## 1. Control Hub Isolation

The APC Dispatcher Control Hub (`/control-hub`) **must never** be accessible to the public.

| Requirement | Implementation |
|-------------|---------------|
| Not in public navigation | No links to `/control-hub` in `public-app` components |
| Separate route | `/control-hub` served independently from `/public-app` |
| Server-side role check | Next.js middleware runs before every `/control-hub/*` request |
| Access logging | Every request (success + failure) logged to `control_hub_access_log` |

### Middleware enforcement (Next.js)

Every request to `/control-hub/*` must pass through `middleware.ts` which:

1. Reads the Supabase session from the request cookie.
2. Extracts `user_metadata.role` from the JWT.
3. Checks the role is in `CONTROL_HUB_ROLES`.
4. If the check fails → logs the attempt and redirects to `/unauthorized`.
5. If the check passes → logs the access and proceeds.

## 2. Environment Secrets

- `.env` is listed in `.gitignore` and must **never** be committed.
- Use `.env.example` as the template; rotate keys immediately if exposed.
- `SUPABASE_SERVICE_ROLE_KEY` must only be used server-side (API routes, Edge Functions, middleware).
- `SUPABASE_ANON_KEY` is safe for the browser but should be treated as semi-public.

## 3. Row-Level Security (RLS)

- RLS is **enabled on all tables** by default.
- No table should have a policy that allows unrestricted access (`USING (true)`).
- Policies use the `current_user_role()` helper which reads from the JWT claim.
- The `control_hub_access_log` table can only be read by `apc_admin` and `apc_security_reviewer`.

## 4. Role Assignment

- Only `apc_admin` may assign or change roles.
- Role assignment uses the **service role key** (server-side only).
- APC roles (`apc_dispatcher`, `apc_admin`, `apc_security_reviewer`) must never be self-assigned.
- All role changes should be audited.

## 5. Authentication

- Use Supabase Auth for all authentication flows.
- Enforce email verification before granting `community_member` role.
- Control Hub login should use a separate, non-public sign-in page.
- Consider enforcing MFA for all Control Hub roles.

## 6. Data Exposure

- API routes must validate the caller's role before returning sensitive data.
- Client-side code must never use `SUPABASE_SERVICE_ROLE_KEY`.
- Incidents and user data must only be returned for the authenticated user's scope.
