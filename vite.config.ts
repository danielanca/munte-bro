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
    port: 5858,
    https: isHttps,
    host: true, // ascultă pe 0.0.0.0, nu doar localhost
    allowedHosts: ["munte.ancavisuals.ro"],
    // sau, dacă vrei să lași orice subdomeniu:
    // allowedHosts: [".ancavisuals.ro"],
    hmr: {
      protocol: hmrProtocol,
      host: "munte.ancavisuals.ro",
      port: 24678,
    },
  },
  preview: {
    port: 5858,
    https: isHttps,
    host: true,
    allowedHosts: ["munte.ancavisuals.ro"],
  },
  build: { minify: isProd, sourcemap: !isProd },
  test,
  css: { preprocessorOptions: { scss: { quietDeps: true } } },
});
