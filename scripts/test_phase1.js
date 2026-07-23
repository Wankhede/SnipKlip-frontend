const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const helperPath = path.join(
  __dirname,
  '..',
  'src',
  'utils',
  'onboarding-navigation.ts'
);
const source = fs.readFileSync(helperPath, 'utf8');
const output = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS }
}).outputText;
const loadedModule = { exports: {} };
new Function('exports', 'module', 'require', output)(
  loadedModule.exports,
  loadedModule,
  require
);

const {
  accessContextKey,
  shouldRedirectToOnboarding
} = loadedModule.exports;

assert.equal(
  shouldRedirectToOnboarding({
    loading: false,
    group: 'Salon',
    branchId: null,
    currentPath: '/dashboard/default'
  }),
  true
);
assert.equal(
  shouldRedirectToOnboarding({
    loading: false,
    group: 'Salon',
    branchId: null,
    currentPath: '/apps/salon-onboarding'
  }),
  false,
  'Do not redirect to the route already being rendered.'
);
assert.equal(
  shouldRedirectToOnboarding({
    loading: false,
    group: 'Admin',
    branchId: null,
    currentPath: '/dashboard/default'
  }),
  false
);
assert.equal(
  accessContextKey({
    salonId: 10,
    branchId: 20,
    group: 'Salon',
    subscriptionName: 'PREMIUM'
  }),
  '10:20:Salon:PREMIUM'
);

console.log('Phase 1 frontend routing tests passed.');
