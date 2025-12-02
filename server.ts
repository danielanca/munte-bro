import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import path, { dirname } from "path";
import express from "express";
import compression from "compression";
import serveStatic from "serve-static";
import { createServer as createViteServer } from "vite";
import { fileURLToPath, pathToFileURL } from "url";
import { sendEmail } from "./src/server/routes/api";
import axios from 'axios';
const isTest = process.env.NODE_ENV === "test" || !!process.env.VITE_TEST_BUILD;
const isProd = process.env.NODE_ENV === "production";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const resolve = (p: string) => path.resolve(__dirname, p);

const getStyleSheets = async () => {
  try {
    const assetpath = resolve("public"); // în dist => dist/public
    const files = await fs.readdir(assetpath);
    const cssAssets = files.filter(l => l.endsWith(".css"));
    const allContent: string[] = [];
    for (const asset of cssAssets) {
      const content = await fs.readFile(path.join(assetpath, asset), "utf-8");
      allContent.push(`<style type="text/css">${content}</style>`);
    }
    return allContent.join("\n");
  } catch {
    return "";
  }
};

async function createServer() {
  const app = express();

  app.set("trust proxy", true);
  app.use(express.json({ limit: "1mb" }));

  app.get("/health", (_req, res) => res.json({ ok: true }));

  // --- API routes (la fel ca la tine) ---
  const apiUrl = isProd
    ? new URL("./src/server/routes/api.js", import.meta.url) // în dist => dist/src/server/routes/api.js
    : new URL("./src/server/routes/api.ts", import.meta.url);

  const apiModule = await import(apiUrl.href);
  const { triggerEvent } = apiModule;
  if (typeof triggerEvent === "function") {
    app.post("/triggerEvent", triggerEvent);
  } else {
    console.error("[server] triggerEvent NU e o funcție exportată din routes/api.*");
  }

  app.post("/chat", async (req: Request, res: Response) => {
    console.log("Server received in main:", req.body);
    res.json({ ok: true });
  });


  app.post("/sendEmail",sendEmail);


  
  app.post("/generate-awb", async (req: Request, res: Response) => {
    try {
      // 1. CREATE SHIPMENT BODY
    
      let myOrders = req.body;

      const shipmentBody = {
        userName: "200929835",
        password: "9334936614",
        language: "EN",
  
        sender: {
          phone1: { number: "0700000000" },
          contactName: "Nume Expeditor",
          email: "expeditor@firma.ro",
        },
  
        recipient: {
          phone1: { number: "0700000001" },
          privatePerson: true,
          clientName: "Daniel",
          email: "Ibraheemakin201@gmail.com",
          address: {
            countryId: 642,
            siteId: 642279132,
            streetId: 642077434,
            streetNo: "1",
          },
        },
  
        service: {
          serviceId: 2505,
          autoAdjustPickupDate: true,
        },
  
        content: {
          parcelsCount: 1,
          contents: "MOBILE PHONE",
          package: "BOX",
          totalWeight: 1,
        },
  
        parcels: [
          {
            weight: 1,
            reference: "P1",
          },
        ],
  
        payment: {
          courierServicePayer: "SENDER",
        },
  
        ref1: "ORDER 123456",
      };
  
      // 2. SEND CREATE SHIPMENT REQUEST
      const createRes = await axios.post(
        "https://api.dpd.ro/v1/shipment",
        shipmentBody,
        { headers: { "Content-Type": "application/json" } }
      );
  
      if (createRes.data.error) {
        return res.status(400).json({ error: createRes.data.error });
      }
  
      const shipment = createRes.data;
      const parcelId = shipment?.parcels?.[0]?.id;
  
      if (!parcelId) {
        return res.status(400).json({ error: "parcelId not returned by DPD" });
      }
  
      const printBody = {
        userName: "200929835",
        password: "9334936614",
        paperSize: "A6",
        parcels: [
          {
            parcel: {
              id: parcelId  // wrapped inside "parcel"
            }
          }
        ]
        
      };
      const printRes = await axios.post(
        "https://api.dpd.ro/v1/print",
        printBody,
        { responseType: "arraybuffer" } // PDF bytes
      );
  
      const pdfBase64 = Buffer.from(printRes.data).toString("base64");
  
      // 4. SEND FINAL COMBINED RESPONSE
      res.json({
        success: true,
        shipmentId: shipment.shipmentId,
        parcelId,
        barcode: shipment?.parcels?.[0]?.barcode,
        labelBase64: pdfBase64,
        myorder :myOrders
      });
    } catch (err: any) {
      console.log(err?.response?.data || err);
      res.status(500).json({
        error: err?.response?.data || "DPD API error",
      });
    }
  });
  
  






















  const stylesheetsPromise = getStyleSheets();

  if (!isProd) {
    // ---------------- DEV: Vite middleware ----------------
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
      logLevel: isTest ? "error" : "info",
      root: process.cwd(),
    });

    app.use(vite.middlewares);

    const baseTemplate = await fs.readFile(resolve("index.html"), "utf-8");

    app.use("*", async (req: Request, res: Response, next: NextFunction) => {
      const url = req.originalUrl;
      try {
        const template = await vite.transformIndexHtml(url, baseTemplate);
        const { render } = await vite.ssrLoadModule("/src/client/entry-server.tsx");
        const appHtml = await render(url);
        const cssAssets = await stylesheetsPromise;

        const html = template
          .replace(`<!--app-html-->`, appHtml)
          .replace(`<!--head-->`, cssAssets);

        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        if (e instanceof Error) {
          vite.ssrFixStacktrace(e);
          console.error(e.stack);
          next(e);
        } else {
          console.error("Non-Error exception:", e);
          next(e as any);
        }
      }
    });
  } else {
    // ---------------- PROD: FĂRĂ Vite dev ----------------
    app.use(compression());

    // static din build
    app.use(
      serveStatic(resolve("client"), {
        index: false,
      }),
    );
    app.use("/public", express.static(resolve("public")));

    const baseTemplate = await fs.readFile(resolve("client/index.html"), "utf-8");
    const cssAssets = await stylesheetsPromise;

    // importă direct bundle-ul SSR build-uit
    const ssrModule = await import(
      pathToFileURL(resolve("server/entry-server.js")).href
    );
    const { render } = ssrModule;

    app.use("*", async (req: Request, res: Response, next: NextFunction) => {
      const url = req.originalUrl;
      try {
        const appHtml = await render(url);

        const html = baseTemplate
          .replace(`<!--app-html-->`, appHtml)
          .replace(`<!--head-->`, cssAssets);

        res.status(200).set({ "Content-Type": "text/html" }).end(html);
      } catch (e) {
        console.error(e);
        next(e as any);
      }
    });
  }

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[express error]", err);
    res
      .status(500)
      .json({ error: "internal", message: err?.message ?? "unknown" });
  });

  const port = process.env.PORT || 5858;
  app.listen(Number(port), "0.0.0.0", () => {
    console.log(`App is listening on http://localhost:${port} (prod: ${isProd})`);
  });
}

createServer();
