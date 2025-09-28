// server.ts — prod-safe for Plesk
import type { Request, Response, NextFunction } from "express";
import fs from "fs";
import fsPromises from "fs/promises";
import path, { dirname } from "path";
import express from "express";
import compression from "compression";
import cors from "cors";
import serveStatic from "serve-static";
import { fileURLToPath, pathToFileURL } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isProd = process.env.NODE_ENV === "production";
const resolve = (p: string) => path.resolve(__dirname, p);

// helpful logs
process.on("unhandledRejection", (e) => console.error("UNHANDLED REJECTION", e));
process.on("uncaughtException", (e) => console.error("UNCAUGHT EXCEPTION", e));

async function createServer() {
  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));

  // ----------------------------
  // API routes (prod = compiled JS in dist/server/routes)
  // ----------------------------
  const apiPath = isProd
    ? pathToFileURL(resolve("./server/routes/api.js")).href   // built output
    : pathToFileURL(resolve("./src/server/routes/api.ts")).href; // source in dev

  const apiModule = await import(apiPath);
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

  // basic liveness probe
  app.get("/health", (_req, res) => res.status(200).send("OK"));

  if (isProd) {
    // ----------------------------
    // PRODUCTION: serve from dist only (no Vite)
    // ----------------------------
    app.use(compression());
    app.use("/assets", express.static(resolve("client/assets"), { immutable: true, maxAge: "1y" }));
    app.use(serveStatic(resolve("client"), { index: false }));

    // HTML template + SSR renderer built by Vite
    const template = await fsPromises.readFile(resolve("client/index.html"), "utf-8");
    const { render } = await import(pathToFileURL(resolve("./server/entry-server.js")).href);

    app.use("*", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const appHtml = await render(req.originalUrl);
        const html = template.replace("<!--app-html-->", appHtml).replace("<!--head-->", "");
        res.status(200).type("html").end(html);
      } catch (e) {
        next(e);
      }
    });
  } else {
    // ----------------------------
    // DEV: Vite middleware (HMR)
    // ----------------------------
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
      logLevel: "info",
    });
    app.use(vite.middlewares);

    const baseTemplate = await fsPromises.readFile(resolve("../index.html"), "utf-8");
    const devEntry = pathToFileURL(resolve("./src/client/entry-server.tsx")).href;

    app.use("*", async (req: Request, res: Response, next: NextFunction) => {
      try {
        const url = req.originalUrl;
        const template = await vite.transformIndexHtml(url, baseTemplate);
        const { render } = await vite.ssrLoadModule(devEntry);
        const appHtml = await render(url);
        const html = template.replace("<!--app-html-->", appHtml);
        res.status(200).type("text/html").end(html);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  }

  // ----------------------------
  // LISTEN: only use Plesk port in prod
  // ----------------------------
  const port = isProd ? Number(process.env.PORT) : Number(process.env.PORT || 7466);
  if (isProd && !port) {
    throw new Error("PORT is not set in production. Start the app via Plesk Node.js so PORT is provided.");
  }

  app.listen(port, () => {
    console.log("Server listening on", port, "NODE_ENV=", process.env.NODE_ENV);
  });
}

createServer();
