# SnipKlip Frontend

SnipKlip is a salon management platform for bookings, customers, staff,
inventory, billing, subscriptions, and reporting. This repository contains
the Next.js frontend; the Django backend lives in the sibling `SnipKlip/`
repository.

## Local development

Use Node 18 (the project includes `.nvmrc`):

```bash
nvm install
nvm use
cp .env.example .env.local
npm install --legacy-peer-deps
npm run dev
```

The frontend runs at <http://localhost:8081>. Start the Django backend at
<http://127.0.0.1:8000> before testing login or application screens.

Required local values:

```dotenv
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000/
NEXT_PUBLIC_FRONTEND_URL=http://localhost:8081/
NEXTAUTH_URL=http://localhost:8081/
NEXTAUTH_SECRET=<new-random-local-secret>
JWT_SECRET=<new-random-local-secret>
```

Generate secrets locally; never copy values from the original upstream
repository because its credentials were committed publicly.

## Commands

```bash
npm run dev
npm run build
npm start
```

Both development and production start commands use port `8081`.
