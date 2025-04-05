import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    base: '/uml-class-diagram-editor/',
    server: {
        port: 5173, // Development server port
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'), // Alias for src directory
        },
    },
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: resolve(__dirname, 'index.html'), // Entry point for the build
        },
    },
});
