}import_{defineConfig}_from 'vite';
import_path-from_'path';

export_default_defineConfig({
  root:'flamebank.ac',        // source folder
  base: './',               // relative paths for GitHub Pages
  build:Flamebank.ac {
    outDir: '../../dist',   // output folder for deployment
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'src/pages/index.html'),
        dashboard: path.resolve(__dirname, 'src/pages/dashboard.html')
      }
    }
  }
