// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import type { UserConfig } from "vitest/config";

const test = {
  globals: true,
  environment: "jsdom",
  setupFiles: ["src/__tests__/setupTests.ts"],
  threads: false,
  watch: false,
} as UserConfig["test"];

const isProd = process.env.NODE_ENV === "production";
const isHttps = process.env.USE_HTTPS === "true";
const hmrProtocol = isHttps ? "wss" : "ws";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  esbuild: {
    jsx: "automatic",
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { ".js": "jsx" },
    },
  },
  server: {
    port: 8000,
    https: isHttps,
    hmr: { protocol: hmrProtocol, host: "diniubire.ro", port: 24678 },
  },
  build: { minify: isProd, sourcemap: !isProd },
  test,
  css: {
    preprocessorOptions: {
      scss: {
        // Injectat în TOATE fișierele .scss (inclusiv .module.scss)
        additionalData: `
          @use "sass:map";
          @use "@/styles/variables" as *;   // aici definești $colors, etc.
          @use "include-media" as *;        // npm i -D include-media
        `,
      },
    },
  },
});
