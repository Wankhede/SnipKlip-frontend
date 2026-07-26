# Frontend-only launcher (Windows). Prefer backend run-local.bat for full stack.
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$Port = if ($env:FRONTEND_PORT) { $env:FRONTEND_PORT } else { '8083' }
Set-Location $Root

if (-not (Test-Path '.env.local')) {
  if (-not (Test-Path '.env.example')) { throw 'Missing .env.example' }
  Copy-Item '.env.example' '.env.local'
  Write-Host 'Created .env.local from .env.example — set NEXTAUTH_SECRET and JWT_SECRET.'
}

if (-not (Test-Path 'node_modules\next\dist\bin\next')) {
  npm install --legacy-peer-deps
}

$major = node -p "process.versions.node.split('.')[0]"
if ($major -eq '18') {
  node node_modules\next\dist\bin\next dev -p $Port
} else {
  Write-Host "Host Node is $(node -v); using portable Node 18 via npx."
  npx --yes --package=node@18.20.8 node node_modules\next\dist\bin\next dev -p $Port
}
