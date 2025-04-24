import { defineConfig } from 'vite';

export default defineConfig({
    define: {
        global: 'window',
    },
    build: {
        rollupOptions: {
            input: {
                main: './index.html',
                timer: './1-timer.html',
                snackbar: './2-snackbar.html',
                search: './3-search.html',
            },
        },
    },
});