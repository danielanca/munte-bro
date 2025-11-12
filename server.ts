// server.ts
import type { Request, Response, NextFunction } from "express";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import express from "express";
import compression from "compression";
import cors from "cors";
import serveStatic from "serve-static";
import { createServer as createViteServer } from "vite";
import { fileURLToPath, pathToFileURL } from "url";
import https from "https";
import dotenv from "dotenv";
dotenv.config();

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;
const isProd = process.env.NODE_ENV === "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// helpers
const r = (p: string) => path.resolve(__dirname, p);
const fromProjectRoot = (p: string) =>
  isProd ? path.resolve(__dirname, "..", p) : path.resolve(__dirname, p);

/** inline /public/*.css (dev only; returns "" in prod if folder doesn’t exist) */
async function getStyleSheets(): Promise<string> {
  try {
    const assetDir = fromProjectRoot("public");
    const files = await fsPromises.readdir(assetDir);
    const css = files.filter(f => f.endsWith(".css"));
    const chunks: string[] = [];
    for (const f of css) {
      const content = await fsPromises.readFile(path.join(assetDir, f), "utf-8");
      chunks.push(`<style type="text/css">${content}</style>`);
    }
    return chunks.join("\n");
  } catch {
    return "";
  }
}

async function createServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // ---- API routes (dynamic import) ----
  // In prod we are executing from dist/server, so routes live at ./routes/api.js
  // In dev we load TS directly from src/server/routes/api.ts
  const apiModulePath = isProd
    ? pathToFileURL(r("./routes/api.js")).href
    : pathToFileURL(fromProjectRoot("./src/server/routes/api.ts")).href;

  const apiModule = await import(apiModulePath);
  const {
    getApi,
    sendEmail,
    subscribeToNewsletter,
    sendReviewToServer,
    updateOrder,
    triggerEvent,
  } = apiModule;

  app.get("/api", getApi);
  app.post("/subscribeToNewsletter", subscribeToNewsletter);
  app.post("/sendEmail", sendEmail);
  app.post("/sendReviewToServer", sendReviewToServer);
  app.post("/updateOrder", updateOrder);
  app.post("/triggerEvent", triggerEvent);

  // ---- Vite in middleware mode ----
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: isTest ? "error" : "info",
  });

  app.use(vite.middlewares);

  // static public (dev convenience)
  app.use("/public", express.static(fromProjectRoot("public")));

  if (isProd) {
    app.use(compression());
    // Serving built client assets: dist/client relative to dist/server
    app.use(serveStatic(r("../client"), { index: false }));
  }

  // base template path
  const baseTemplate = await fsPromises.readFile(
    isProd ? r("../client/index.html") : fromProjectRoot("index.html"),
    "utf-8"
  );

  // SSR entry: file URL in prod; URL path in dev
  const DEV_SSR_ENTRY = "/src/client/entry-server.tsx";
  const PROD_SSR_ENTRY = pathToFileURL(r("./entry-server.js")).href;

  app.use("*", async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;
    try {
      // inject Vite stuff (and dev HMR client in dev)
      const template = await vite.transformIndexHtml(url, baseTemplate);

      const { render } = await vite.ssrLoadModule(isProd ? PROD_SSR_ENTRY : DEV_SSR_ENTRY);
      const appHtml = await render(url);
      const cssAssets = await getStyleSheets();

      const html = template
        .replace("<!--app-html-->", appHtml)
        .replace("<!--head-->", cssAssets);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e: unknown) {
      if (e instanceof Error && !isProd) vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  const port = Number(process.env.PORT || 7466);

  if (process.env.USE_HTTPS === "true") {
    const keyPath = fromProjectRoot("certs/diniubire.ro.key");
    const crtPath = fromProjectRoot("certs/diniubire.ro.crt");
    const options = { key: fs.readFileSync(keyPath), cert: fs.readFileSync(crtPath) };
    https.createServer(options, app).listen(port, () => {
      console.log(`HTTPS Server https://localhost:${port}`);
      console.log("ENV", process.env.NODE_ENV);
    });
  } else {
    app.listen(port, () => {
      console.log(`HTTP Server http://localhost:${port}`);
      console.log("ENV", process.env.NODE_ENV);
    });
  }
}

createServer();
