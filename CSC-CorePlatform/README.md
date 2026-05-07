# CSC-CorePlatform

CommunitySafeConnect public app + APC Dispatcher Control Hub.

## Run

### Public app
npm run public

### Control hub
npm run hub

## Free Same-Origin Local Mode

If you are not using Supabase or any paid backend yet, run both apps under one local origin so browser storage/event sync works between the public app and the control hub.

### Build both apps into one local package
`npm run build:same-origin`

This creates a combined static output in `dist-same-origin/` where:

- Public app is served at `/`
- Control hub is served at `/hub/`

### Serve the combined local package
`npm run serve:same-origin`

Or build and serve in one step:

`npm run preview:same-origin`

### URLs

- Public app: `http://localhost:4173/`
- Control hub: `http://localhost:4173/hub/`

Because both run on the same origin in this mode, public incidents can sync into the control hub without Supabase.
