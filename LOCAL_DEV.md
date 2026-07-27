# Local two-repository development

Reserved ports:

```text
Browser → Next.js :8083 → Django API :8082 → SQLite
```

## Recommended: one command from the backend repo

Clone both repos as siblings, then from **SnipKlip** (backend):

```bash
node run-local.js
```

Same on Windows, macOS, and Linux. In **Cursor / VS Code**: `Terminal` → `Run Task…` → **SnipKlip: Start**.

Full instructions: [`SETUP_GUIDE.md`](../SnipKlip/SETUP_GUIDE.md) in the backend repo (or open it after cloning `SnipKlip`).

## Manual frontend-only

```bash
cp .env.example .env.local
# set NEXTAUTH_SECRET + JWT_SECRET
npm install --legacy-peer-deps
npm run dev   # serves on :8083
```

If host Node is not 18:

```bash
npx --yes --package=node@18.20.8 node node_modules/next/dist/bin/next dev -p 8083
```

## Health check

| URL | Expected |
|-----|----------|
| http://localhost:8082/api/schema/ | 200 |
| http://localhost:8083/login | 200 |

Register a salon at http://localhost:8083/register.
