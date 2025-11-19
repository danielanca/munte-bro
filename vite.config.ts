// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
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

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  esbuild: {
    jsx: "automatic",
  },
  optimizeDeps: {
    esbuildOptions: {
      loader: { ".js": "jsx" },
    },
  },
  server: {
    // ascultă pe toate interfețele (nu doar localhost)
    host: true, // sau "0.0.0.0"
    port: 5858, // poți lăsa 3000 dacă vrei, dar să fie același peste tot
    https: isHttps,
    // 🔥 fix pt eroarea ta: "This host ('montanair.ro') is not allowed"
    allowedHosts: ["montanair.ro", "www.montanair.ro"],
    hmr: {
      protocol: hmrProtocol,
      host: "montanair.ro", // sau subdomeniul prin care intri
      port: 24678,
    },
  },
  build: {
    minify: isProd,
    sourcemap: !isProd,
  },
  test,
});
