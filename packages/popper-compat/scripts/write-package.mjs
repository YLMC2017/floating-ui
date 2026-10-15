import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const packageRoot = path.resolve(here, '..');
const repoRoot = path.resolve(packageRoot, '../..');
const outDir = path.resolve(repoRoot, 'artifacts/@popperjs/core');

const readJson = (file) => JSON.parse(fs.readFileSync(file, 'utf8'));
const domPkg = readJson(path.resolve(repoRoot, 'packages/dom/package.json'));
const corePkg = readJson(path.resolve(repoRoot, 'packages/core/package.json'));
const utilsPkg = readJson(path.resolve(repoRoot, 'packages/utils/package.json'));

const manifest = {
  name: '@popperjs/core',
  version: domPkg.version,
  private: true,
  type: 'module',
  description:
    `Popper-compatible build of @floating-ui/dom@${domPkg.version}. ` +
    'Copy this folder into an application and override @popperjs/core with it.',
  main: './dist/cjs/popper.cjs',
  module: './lib/index.js',
  types: './index.d.ts',
  exports: {
    '.': {
      types: './index.d.ts',
      import: './lib/index.js',
      require: './dist/cjs/popper.cjs',
      default: './dist/cjs/popper.cjs',
    },
    './package.json': './package.json',
  },
  sideEffects: false,
  files: ['index.d.ts', 'dist', 'lib'],
  floatingUi: {
    dom: domPkg.version,
    core: corePkg.version,
    utils: utilsPkg.version,
  },
};

fs.mkdirSync(outDir, {recursive: true});
fs.writeFileSync(
  path.join(outDir, 'package.json'),
  `${JSON.stringify(manifest, null, 2)}\n`,
);
fs.copyFileSync(
  path.join(packageRoot, 'index.d.ts'),
  path.join(outDir, 'index.d.ts'),
);
