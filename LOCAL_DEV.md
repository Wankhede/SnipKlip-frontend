# Local two-repository development

The browser never connects directly to the database:

```text
Browser :8081 → Next.js / NextAuth → Django API :8000 → SQLite or PostgreSQL
```

## Terminal 1 — Django

```bash
cd ../SnipKlip
source ../.venv/bin/activate
./scripts/run_local.sh
```

Backend environment:

```dotenv
FRONTEND_LINK=http://localhost:8081
CORS_ALLOWED_ORIGINS=http://localhost:8081,http://127.0.0.1:8081
```

## Terminal 2 — Next.js

```bash
cd ../snipklip-frontend
cp .env.example .env.local
# Replace both placeholder auth secrets with newly generated local values.
./scripts/run_local.sh
```

Frontend environment:

```dotenv
NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:8000/
NEXT_PUBLIC_FRONTEND_URL=http://localhost:8081/
NEXTAUTH_URL=http://localhost:8081/
```

## Health check

With both servers running:

```bash
./scripts/check_local.sh
```

New salon users register at <http://localhost:8081/register>. The Django
database stores their user and salon records; the frontend receives a Django
JWT through NextAuth at login. A salon with no branch is redirected to salon
onboarding.
