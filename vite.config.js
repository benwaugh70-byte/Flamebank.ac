import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src/pages',        // source folder
  base: './',               // relative paths for GitHub Pages
  build: {
    outDir: '../../dist',   // output folder for deployment
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/pages/index.html'),
        dashboard: path.resolve(__dirname, 'src/pages/dashboard.html')
      }
    }
  }
});