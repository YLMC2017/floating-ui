import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {defineConfig} from 'vitest/config';

const packageRoot = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(packageRoot, '../..');

export default defineConfig({
  resolve: {
    alias: [
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
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    root: packageRoot,
  },
});
