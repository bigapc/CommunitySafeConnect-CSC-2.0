# CSC-NextGen-App

Standalone NextGen CommunitySafeConnect app scaffolded under the CommunitySafeConnect-CSC-2.0 repository.

## Business Separation Policy

This app is intentionally kept separate from other CSC and CommunitySafeConnect applications.

- Separate project folder and deployment lifecycle.
- Separate runtime process and local port.
- Separate authentication and access model.
- No automatic shared database, API, or service connections.
- No implicit dependency on the app running on port 3001.

If integration is ever needed, it must be implemented as an explicit opt-in connector with clear approvals.

## Brand Notice

Powered by Armstrong Pack Company.
Copyright 2026 Armstrong Pack Company. All rights reserved.

## Local Development

1. Install dependencies:

   npm install

2. Run development server:

   npm run dev

3. Build for production:

   npm run build
