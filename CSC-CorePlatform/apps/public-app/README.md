# public-app — CommunitySafeConnect (Community User App)

This app is the public-facing interface for community members, verified responders, and organization members/leaders.

## Route

```
/public-app
```

## Allowed Roles

| Role | Description |
|------|-------------|
| `community_member` | Standard community user |
| `verified_responder` | Trained/verified emergency responder |
| `organization_member` | Member of a registered safety organization |
| `organization_leader` | Leader/admin of a registered safety organization |

## Features (Planned)

- Incident reporting
- Community alerts & notifications
- Responder directory
- Organization management
- Safety resources

## Development

```bash
# From CSC-CorePlatform root
npm run dev:public
```
