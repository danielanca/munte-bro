import type { Request, Response, NextFunction } from "express";
import fs from "fs";
import fsPromises from "fs/promises";
import path, { dirname } from "path";
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

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

const resolve = (p: string) => path.resolve(__dirname, p);

const getStyleSheets = async () => {
  try {
    const assetpath = resolve("public");

    const files = await fsPromises.readdir(assetpath);
    const cssAssets = files.filter(l => l.endsWith(".css"));
    const allContent = [];
    for (const asset of cssAssets) {
      const content = await fsPromises.readFile(path.join(assetpath, asset), "utf-8");
      allContent.push(`<style type="text/css">${content}</style>`);
    }
    return allContent.join("\n");
  } catch {
    return "";
  }
};

async function createServer(isProd = process.env.NODE_ENV === "production") {
  const app = express();
  app.use(express.json()); // Make sure this is at the top
  app.use(cors());
  app.use(express.urlencoded({ extended: true }));

  // app.get("/api", getApi);

  // Dynamically import the API routes based on environment

  // const apiPath = isProd
  // ? path.resolve(__dirname, "./src/server/routes/api.js")
  // : path.resolve(__dirname, "./src/server/routes/api.ts");

  // console.log('api',apiPath)

  // Dynamically import the API routes based on environment
  const apiPath = isProd
    ? pathToFileURL(resolve("./src/server/routes/api.js")).href
    : pathToFileURL(resolve("./src/server/routes/api.ts")).href;

  const apiModule = await import(apiPath);
  const { getApi, sendEmail, subscribeToNewsletter, sendReviewToServer, updateOrder, triggerEvent } = apiModule;

  // Register API routes
  app.get("/api", getApi);
  app.post("/subscribeToNewsletter", subscribeToNewsletter);
  app.post("/sendEmail", sendEmail);
  app.post("/sendReviewToServer", sendReviewToServer);
  app.post("/updateOrder", updateOrder);
  app.post("/triggerEvent", triggerEvent);
  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
    logLevel: isTest ? "error" : "info",
    root: isProd ? "dist" : "",
    optimizeDeps: { include: [] },
  });

  // use vite's connect instance as middleware
  // if you use your own express router (express.Router()), you should use router.use
  app.use(vite.middlewares);
  const assetsDir = resolve("public");
  const requestHandler = express.static(assetsDir);
  app.use(requestHandler);
  app.use("/public", requestHandler);

  if (isProd) {
    app.use(compression());
    app.use(
      serveStatic(resolve("client"), {
        index: false,
      })
    );
  }
  const stylesheets = getStyleSheets();

  // 1. Read index.html
  const baseTemplate = await fsPromises.readFile(
    isProd ? resolve("client/index.html") : resolve("index.html"),
    "utf-8"
  );
  const productionBuildPath = path.join(__dirname, "./server/entry-server.js");
  const devBuildPath = path.join(__dirname, "./src/client/entry-server.tsx");
  const buildModule = isProd ? productionBuildPath : devBuildPath;
  const { render } = await vite.ssrLoadModule(buildModule);

  app.use("*", async (req: Request, res: Response, next: NextFunction) => {
    const url = req.originalUrl;
    console.log("We have app.use(*) on", req);
    try {
      // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
      //    also applies HTML transforms from Vite plugins, e.g. global preambles
      //    from @vitejs/plugin-react
      const template = await vite.transformIndexHtml(url, baseTemplate);
      // 3. Load the server entry. vite.ssrLoadModule automatically transforms
      //    your ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.

      // 4. render the app HTML. This assumes entry-server.js's exported `render`
      //    function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      const appHtml = await render(url);
      const cssAssets = await stylesheets;

      // 5. Inject the app-rendered HTML into the template.
      const html = template.replace(`<!--app-html-->`, appHtml).replace(`<!--head-->`, cssAssets);

      // 6. Send the rendered HTML back.
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      if (e instanceof Error) {
        !isProd && vite.ssrFixStacktrace(e);
        console.log(e.stack);
        // If an error is caught, let Vite fix the stack trace so it maps back to
        // your actual source code.
        vite.ssrFixStacktrace(e);
        next(e);
      } else {
        console.error("Caught an exception that is not an Error:", e);
      }
    }
  });

  const port = process.env.PORT || 7456;
  if (process.env.USE_HTTPS === "true") {
    const options = {
      key: fs.readFileSync(resolve("certs/diniubire.ro.key")),
      cert: fs.readFileSync(resolve("certs/diniubire.ro.crt")),
    };

    https.createServer(options, app).listen(port, () => {
      console.log(`HTTPS Server running on https://localhost:${port}`);
      console.log("We are on this ENV ", process.env.NODE_ENV);
    });
  } else {
    app.listen(port, () => {
      console.log(`HTTP Server running on http://localhost:${port}`);
      console.log("We are on this ENV ", process.env.NODE_ENV);
    });
  }
}

createServer();
