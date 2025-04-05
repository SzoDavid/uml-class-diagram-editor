import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        coverage: {
            provider: 'v8',
            enabled: true,
            reporter: ['html', 'text'],
            include: ['**/src/utils/**', '**/src/services/**'],
            exclude: ['**/tests'],
        },
    },
});
