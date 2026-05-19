import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { execFileSync } from 'node:child_process';

// Best-effort git SHA + build timestamp. Surfaced in error diagnostics
// so a user-reported issue carries the exact commit it was built from.
// Both are no-ops if git isn't available (e.g. extracted tarball).
// execFileSync (not execSync) — no shell, no injection surface, args
// passed as an array.
function safeGitSha(): string {
  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
      cwd: __dirname,
      stdio: ['ignore', 'pipe', 'ignore'],
    })
      .toString()
      .trim();
  } catch {
    return 'unknown';
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss()],
  publicDir: false,
  define: {
    __APPFRAME_COMMIT__: JSON.stringify(safeGitSha()),
    __APPFRAME_BUILD_AT__: JSON.stringify(new Date().toISOString()),
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:4400',
        changeOrigin: true,
      },
      // Forward font requests to the Express server. Without this, Vite's SPA
      // fallback returns index.html for /preview-fonts/* and the iframe fonts
      // silently 404.
      '/preview-fonts': {
        target: 'http://localhost:4400',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'client-dist',
    emptyOutDir: true,
  },
});
