// @ts-check
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import alias from '@rollup/plugin-alias';
import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(packageRoot, '../..');
const outDir = path.resolve(repoRoot, 'artifacts/@popperjs/core');

const aliases = [
  {
    find: '@floating-ui/utils/dom',
    replacement: path.resolve(repoRoot, 'packages/utils/src/dom.ts'),
  },
  {
    find: '@floating-ui/utils',
    replacement: path.resolve(repoRoot, 'packages/utils/src/index.ts'),
  },
  {
    find: '@floating-ui/core',
    replacement: path.resolve(repoRoot, 'packages/core/src/index.ts'),
  },
  {
    find: '@floating-ui/dom',
    replacement: path.resolve(repoRoot, 'packages/dom/src/index.ts'),
  },
];

const plugins = [
  alias({entries: aliases}),
  resolve({extensions: ['.mjs', '.js', '.ts']}),
  babel({
    babelHelpers: 'bundled',
    extensions: ['.ts', '.js', '.mjs'],
    exclude: /node_modules/,
    presets: [
      ['@babel/preset-typescript', {allExtensions: true, isTSX: false}],
      [
        '@babel/preset-env',
        {
          targets: {esmodules: true},
          bugfixes: true,
          modules: false,
        },
      ],
    ],
  }),
  replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
    preventAssignment: true,
  }),
];

export default {
  input: path.resolve(packageRoot, 'src/index.ts'),
  plugins,
  output: [
    {
      file: path.resolve(outDir, 'lib/index.js'),
      format: 'es',
      exports: 'named',
    },
    {
      file: path.resolve(outDir, 'dist/cjs/popper.cjs'),
      format: 'cjs',
      exports: 'named',
      interop: 'auto',
    },
  ],
};
