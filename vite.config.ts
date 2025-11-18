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
    hmr: { protocol: hmrProtocol, host: "munte.ancavisuals.ro", port: 24678 },
  },
  build: { minify: isProd, sourcemap: !isProd },
  test,
  css: { preprocessorOptions: { scss: { quietDeps: true } } },
});
