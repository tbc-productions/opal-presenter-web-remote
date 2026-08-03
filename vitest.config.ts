import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  oxc: false,
  plugins: [
    swc.vite({
      jsc: {
        parser: {
          syntax: 'typescript',
          decorators: true,
        },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
        target: 'esnext',
      },
    }),
  ],
  test: {
    globals: false,
    environment: 'jsdom',
    setupFiles: ['./src/vitest-setup.ts'],
    include: ['src/**/*.spec.ts'],
    clearMocks: true,
    css: true,
    coverage: {
      enabled: true,
    },
  },
});
