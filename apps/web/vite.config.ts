import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import istanbul from 'vite-plugin-istanbul';

export default defineConfig({
    plugins: [
        react(),
        istanbul({
            include: 'app/**/*',
            exclude: ['node_modules', 'cypress'],
            extension: ['.js', '.ts', '.tsx'],
        }),
    ],
});