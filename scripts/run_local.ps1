# Frontend-only launcher (Windows). Prefer backend .\run-local.bat for full stack.
$ErrorActionPreference = 'Stop'
$Root = Split-Path $PSScriptRoot -Parent
$Port = if ($env:FRONTEND_PORT) { $env:FRONTEND_PORT } else { '8083' }
Set-Location $Root

$env:NO_PROXY = 'localhost,127.0.0.1,::1'

if (-not (Test-Path '.env.local')) {
  if (-not (Test-Path '.env.example')) { throw 'Missing .env.example' }
  Copy-Item '.env.example' '.env.local'
  Write-Host 'Created .env.local from .env.example — set NEXTAUTH_SECRET and JWT_SECRET.'
}

$probe = 'try{require("next");require("react");require("react-dom");console.log("READY")}catch(e){console.error(e);process.exit(2)}'
$ok = $false
try {
  $out = & node -e $probe 2>&1 | Out-String
  if ($out -match 'READY') { $ok = $true }
} catch { }

if (-not $ok) {
  Write-Host 'Installing frontend packages...'
  & npm.cmd install --legacy-peer-deps
  $out = & node -e $probe 2>&1 | Out-String
  if ($out -notmatch 'READY') { throw 'next/react still not resolvable after npm install' }
}

$major = & node -p "process.versions.node.split('.')[0]"
if ($major -eq '18') {
  & npm.cmd run dev
} else {
  Write-Host "Host Node is $(node -v); using portable Node 18 via npx."
  & npx.cmd --yes --package=node@18.20.8 node node_modules/next/dist/bin/next dev -p $Port -H localhost
}
