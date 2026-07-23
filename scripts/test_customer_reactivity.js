const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const helperPath = path.join(__dirname, '..', 'src', 'utils', 'table-state.ts');
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

const { prependUniqueRow } = loadedModule.exports;

assert.deepEqual(
  prependUniqueRow([{ id: 1 }, { id: 2 }], { id: 3 }, 10),
  [{ id: 3 }, { id: 1 }, { id: 2 }]
);
assert.deepEqual(
  prependUniqueRow([{ id: 1 }, { id: 2 }], { id: 2, name: 'updated' }, 10),
  [{ id: 2, name: 'updated' }, { id: 1 }]
);
assert.deepEqual(
  prependUniqueRow([{ id: 1 }, { id: 2 }], { id: 3 }, 2),
  [{ id: 3 }, { id: 1 }]
);

const createdRows = [{ id: 99, customer_name: 'Ada Lovelace' }];
const createdCustomer = Array.isArray(createdRows) ? createdRows[0] : createdRows;
assert.deepEqual(
  prependUniqueRow([{ id: 1 }], createdCustomer, 10),
  [{ id: 99, customer_name: 'Ada Lovelace' }, { id: 1 }]
);

console.log('Customer reactivity tests passed.');
