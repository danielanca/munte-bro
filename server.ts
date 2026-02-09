import "dotenv/config";
import type { Request, Response, NextFunction } from "express";
import fs from "fs/promises";
import path, { dirname } from "path";
import express from "express";
import compression from "compression";
import serveStatic from "serve-static";
import { createServer as createViteServer } from "vite";
import { fileURLToPath, pathToFileURL } from "url";
import { dpdAuth , sagaAuth } from "./src/server/constants/credentials.js";

import { sendEmail } from "./src/server/routes/api.js";
import axios from "axios";
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
          phone1: { number: myOrders.phoneNo },
          privatePerson: true,
          clientName: myOrders.firstName + " "+ myOrders.lastName,
          email: myOrders.emailAddress,
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
          contents: myOrders.cartProducts[0].name || "Mobile Phone",
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
        userName: dpdAuth.username,
        password: dpdAuth.password,
        paperSize: "A6",
        parcels: [
          {
            parcel: {
              id: parcelId  || "81195117266"// wrapped inside "parcel"
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
        parcelID : parcelId,
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


  function mapDpdStatus(code:number) {
    switch (code) {
      case 148:
        return "Shipment created (label generated)";
      case 100:
        return "Parcel picked up from sender";
      case 101:
        return "Arrived at origin depot";
      case 102:
        return "Leaving origin depot";
      case 103:
        return "In transit to destination";
      case 200:
        return "Arrived at destination depot";
      case 201:
        return "Out for delivery";
      case -14:
        return "Delivered";
      case 124:
        return "Returned to sender";
      case 128:
        return "Shipment cancelled";
      default:
        return "Unknown status";
    }
  }
  
  app.get("/track/:parcelId", async (req, res) => {
    try {
      const parcelId = req.params.parcelId;
  
      if (!parcelId) {
        return res.status(400).json({ error: "parcelId is required" });
      }
  
      // Build DPD request body
      const trackBody = {
        userName: "200929835",
        password: "9334936614",
        parcels: [
          {
            parcelNumber: parcelId
          }
        ]
      };
  
      // Call DPD tracking API
      const dpdRes = await axios.post(
        "https://api.dpd.ro/v1/parcel/track",
        trackBody,
        { headers: { "Content-Type": "application/json" } }
      );
  
      const parcelData = dpdRes.data?.parcels?.[0];
  
      if (!parcelData) {
        return res.status(404).json({ error: "Parcel not found" });
      }
  
      const lastOperation = parcelData.operations?.[parcelData.operations.length - 1];
  
      // Convert code → friendly status
      const status = mapDpdStatus(lastOperation?.operationCode);
  
      res.json({
        parcelId,
        lastUpdate: lastOperation?.dateTime,
        dpdStatusCode: lastOperation?.operationCode,
        description: lastOperation?.description,
        status,
        fullHistory: parcelData.operations
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "DPD tracking error" });
    }
  });
  
  app.post("/saga", async (req, res) => {
    try {
      const order = req.body;
  
      const invoiceBody = {
        companyVatCode: sagaAuth.companyVatCode,
        client: {
          name: order.firstName + " "+ order.lastName,
          vatCode: "RO12345678",
          address: order.deliveryAddress,
          isTaxPayer: true,
          city: order.city,
          county: order.county,
          country: "Romania",
          saveToDb: false
        },
        isDraft: false,
        issueDate: order.timestamp,
        seriesName: "1",
        currency: "RON",
        language: "RO",
        precision: 2,
        dueDate: "2026-01-31",
        useEstimateDetails: false,
        products: [
          {
            "name": "Mapa A4",
            "code": "ccd1",
            "productDescription": "produse de papetarie",
            "isDiscount": false,
            "measuringUnitName": "buc",
            "currency": "RON",
            "quantity": 2,
            "price": 40,
            "isTaxIncluded": true,
            "taxName": "Normala",
            "taxPercentage": 19,
            "saveToDb": false,
            "isService": false
          },
          {
            "name": "Biblioraft Plastifiat",
            "code": "ccd2",
            "productDescription": "produse de papetarie",
            "isDiscount": false,
            "measuringUnitName": "buc",
            "currency": "RON",
            "quantity": 3,
            "price": 60,
            "isTaxIncluded": true,
            "taxName": "Normala",
            "taxPercentage": 19,
            "saveToDb": false,
            "isService": false
          },
          {
            "name": "Discount valoric pe produsul 2",
            "isDiscount": true,
            "numberOfItems": 1,
            "measuringUnitName": "buc",
            "currency": "RON",
            "isTaxIncluded": true,
            "taxName": "Normala",
            "taxPercentage": 19,
            "discountType": 1,
            "discountValue": -15
          },
          {
            "name": "Discount procentual pe produsul 1 si 2",
            "isDiscount": true,
            "numberOfItems": 2,
            "measuringUnitName": "buc",
            "currency": "RON",
            "isTaxIncluded": true,
            "taxName": "Normala",
            "taxPercentage": 19,
            "discountType": 2,
            "discountPercentage": 10
          }
        ],
        payment: {
          value: order.shippingTax + order.cartSum,
          type: order.paymentMethod,
          isCash: false
        }
      };
  
      const response = await axios.post(
        "https://ws.smartbill.ro/SBORO/api/invoice",
        invoiceBody,
        {
          auth: {
            username: sagaAuth.Username,
            password: sagaAuth.Password
           },
          headers: {
            "Content-Type": "application/json"
          }
        }
      );
  
      return res.json({
        success: true,
        smartbill: response.data
      });
  
    } catch (error: any) {
      console.error("SmartBill error:", error?.response?.data || error.message);
  
      return res.status(500).json({
        success: false,
        error: error?.response?.data || "SmartBill API error"
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
