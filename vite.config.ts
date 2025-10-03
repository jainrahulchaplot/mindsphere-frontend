import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh
      fastRefresh: true,
      // Optimize JSX runtime
      jsxRuntime: 'automatic',
    }),
  ],
  
  // Build optimization
  build: {
    // Target modern browsers
    target: 'es2020',
    
    // Output directory
    outDir: 'dist',
    
    // Source maps for production debugging
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
        pure_funcs: process.env.NODE_ENV === 'production' ? ['console.log', 'console.info'] : [],
      },
      mangle: {
        safari10: true,
      },
    },
    
    // Chunk splitting strategy
    rollupOptions: {
      output: {
        // Manual chunk splitting for better caching
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@tanstack/react-query', 'axios'],
          'livekit-vendor': ['livekit-client', '@livekit/components-react'],
          'supabase-vendor': ['@supabase/supabase-js'],
          
          // Feature chunks
          'voice-features': [
            './src/components/VoiceAgent',
            './src/components/VoiceRecorder',
            './src/components/VoicePlayer',
          ],
          'music-features': [
            './src/components/MusicPlayer',
            './src/components/MusicLibrary',
            './src/components/MusicUpload',
          ],
          'journal-features': [
            './src/components/Journal',
            './src/components/JournalEntry',
            './src/components/JournalList',
          ],
        },
        
        // File naming strategy
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `js/[name]-[hash].js`;
        },
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
            return `img/[name]-[hash][extname]`;
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
            return `fonts/[name]-[hash][extname]`;
          }
          if (/\.(css)$/i.test(assetInfo.name)) {
            return `css/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    
    // Bundle size limits
    chunkSizeWarningLimit: 1000,
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Asset inlining threshold
    assetsInlineLimit: 4096, // 4KB
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'livekit-client',
      '@livekit/components-react',
      '@supabase/supabase-js',
    ],
    exclude: ['lucide-react'],
    
    // Force pre-bundling of dependencies
    force: process.env.NODE_ENV === 'development',
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@api': resolve(__dirname, './src/api'),
      '@utils': resolve(__dirname, './src/utils'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@contexts': resolve(__dirname, './src/contexts'),
      '@assets': resolve(__dirname, './src/assets'),
    },
  },
  
  // Server configuration
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false,
      },
    },
    
    // Enable HMR
    hmr: {
      overlay: true,
    },
  },
  
  // Preview server
  preview: {
    port: 4173,
    host: true,
  },
  
  // Environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  
  // CSS configuration
  css: {
    // Enable CSS modules
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]',
    },
    
    // PostCSS configuration
    postcss: './postcss.config.js',
  },
  
  // Performance optimizations
  esbuild: {
    // Target modern browsers
    target: 'es2020',
    
    // Drop console in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    
    // Minify identifiers
    minifyIdentifiers: process.env.NODE_ENV === 'production',
    
    // Minify syntax
    minifySyntax: process.env.NODE_ENV === 'production',
    
    // Minify whitespace
    minifyWhitespace: process.env.NODE_ENV === 'production',
  },
  
  // Worker configuration
  worker: {
    format: 'es',
    plugins: [react()],
  },
});
