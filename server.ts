import type { Request, Response, NextFunction } from "express";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
import express from "express";
import compression from "compression";
import cors from "cors";
import serveStatic from "serve-static";
import { createServer as createViteServer, ViteDevServer } from "vite";
import { fileURLToPath, pathToFileURL } from "url";
import https from "https";
import dotenv from "dotenv";
dotenv.config();

const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;
const isProd = process.env.NODE_ENV === "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// When built, this file sits at dist/server/server.js
// So ROOT = project root in dev, and dist in prod
const ROOT = isProd ? path.resolve(__dirname, "..") : path.resolve(__dirname);
const CLIENT_DIR = isProd ? path.join(ROOT, "client") : path.join(ROOT, "client"); // only used in prod
const SERVER_DIR = isProd ? path.join(ROOT, "server") : path.join(ROOT, "server"); // only used in prod
const PUBLIC_DIR = isProd ? null : path.join(ROOT, "public");

async function getStyleSheets(): Promise<string> {
  try {
    const dir = isProd ? path.join(CLIENT_DIR, "assets") : (PUBLIC_DIR as string);
    const files = await fsPromises.readdir(dir);
    const cssFiles = files.filter(f => f.endsWith(".css"));
    const chunks: string[] = [];
    for (const f of cssFiles) {
      const content = await fsPromises.readFile(path.join(dir, f), "utf-8");
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

  // ---- API routes (dynamic import)
  // dev: load TS directly; prod: load built JS from dist/server
  const apiModuleUrl = isProd
    ? pathToFileURL(path.join(SERVER_DIR, "routes/api.js")).href
    : pathToFileURL(path.join(ROOT, "src/server/routes/api.ts")).href;
  const apiModule = await import(apiModuleUrl);
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

  let vite: ViteDevServer | undefined;
  if (!isProd) {
    // Dev: Vite middleware mode
    vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
      logLevel: isTest ? "error" : "info",
    });
    app.use(vite.middlewares);
    // Expose /public in dev
    if (PUBLIC_DIR) {
      app.use("/public", express.static(PUBLIC_DIR));
    }
  } else {
    // Prod: serve built client
    app.use(compression());
    app.use(serveStatic(CLIENT_DIR, { index: false }));
  }

  // Base template
  const baseTemplate = await fsPromises.readFile(
    isProd ? path.join(CLIENT_DIR, "index.html") : path.join(ROOT, "index.html"),
    "utf-8"
  );

  // SSR entries
  const DEV_SSR_ENTRY = "/src/client/entry-server.tsx"; // URL path for vite.ssrLoadModule
  const PROD_SSR_ENTRY = pathToFileURL(path.join(SERVER_DIR, "entry-server.js")).href;
  // Preload prod renderer once
  const prodRenderer = isProd ? await import(PROD_SSR_ENTRY) : null;

  app.use("*", async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;
    try {
      const template = vite
        ? await vite.transformIndexHtml(url, baseTemplate) // dev injects HMR etc.
        : baseTemplate;

      const { render } = vite
        ? await vite.ssrLoadModule(DEV_SSR_ENTRY) // dev: on every request
        : (prodRenderer as { render: (u: string) => Promise<string> | string });

      const appHtml = await render(url);
      const cssInline = await getStyleSheets();

      const html = template
        .replace("<!--app-html-->", appHtml)
        .replace("<!--head-->", cssInline);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      if (e instanceof Error && vite) vite.ssrFixStacktrace(e);
      next(e);
    }
  });

  const port = Number(process.env.PORT || 7456);

  if (process.env.USE_HTTPS === "true") {
    const keyPath = isProd
      ? path.join(ROOT, "certs/diniubire.ro.key")
      : path.join(ROOT, "certs/diniubire.ro.key");
    const crtPath = isProd
      ? path.join(ROOT, "certs/diniubire.ro.crt")
      : path.join(ROOT, "certs/diniubire.ro.crt");

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
