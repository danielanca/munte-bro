// services/products.ts
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { ProductModel } from "../utils/OrderInterfaces";
import app from "../firebase";

// OPTIONAL: only if you still need the adapter here
import { updateOrder as updateOrderEmail } from "../services/emails";

const db = getFirestore(app);
const COL = "products";

// Helper: ensure we never duplicate/overwrite ID
const toModel = (id: string, data: any): ProductModel => {
  const { ID: _ignore, ...rest } = (data ?? {}) as any; // drop any stored ID
  return { ...rest, ID: id } as ProductModel;           // attach doc id last
};

export const upsertProduct = async (product: ProductModel) => {
  if (!product?.ID) throw new Error("Product is missing ID.");

  // 🔒 Do NOT persist ID inside the document body. Use it only as the doc key.
  const { ID, ...rest } = product;

  const ref = doc(db, COL,  rest.title);
  const snap = await getDoc(ref);

  const basePayload = {
    ...rest,
    updatedAt: serverTimestamp(),
  };

  if (snap.exists()) {
    await updateDoc(ref, basePayload as any);
    return { action: "updated", id: ID };
  } else {
    await setDoc(ref, { ...basePayload, createdAt: serverTimestamp() } as any);
    return { action: "created", id: ID };
  }
};

export const getProductWithID = async (id: string): Promise<ProductModel | null> => {
  if (!id) return null;
  const ref = doc(db, COL, id);
  const snap = await getDoc(ref);
  return snap.exists() ? toModel(id, snap.data()) : null;
};

export const listProducts = async (): Promise<Record<string, ProductModel>> => {
  const out: Record<string, ProductModel> = {};
  const q = await getDocs(collection(db, COL));
  q.docs.forEach((d) => {
    out[d.id] = toModel(d.id, d.data());
  });
  return out;
};

export const deleteProductByID = async (id: string) => {
  if (!id) throw new Error("Missing product id");
  await deleteDoc(doc(db, COL, id));
};

export async function getProductById(id: string): Promise<ProductModel | null> {
  if (!id) return null;
  const snap = await getDoc(doc(db, COL, id));
  if (!snap.exists()) return null;
  return toModel(id, snap.data());
}

// OPTIONAL: adapter for payValidationCheck if you still pass a fn that must return Promise<void>
export const updateOrderForValidation = async (model: any): Promise<void> => {
  const res = await updateOrderEmail(model);
  if (!res.ok) throw new Error(`updateOrder failed: ${res.status} ${res.statusText}`);
};


export default async function handleMerchant(req: any, res: any) {
  try {
    const products = await listProducts();

    console.log(products);

    const STORE_NAME = "Dinmunte";
    const STORE_URL = "https://montanair.ro";
    const CURRENCY = "RON";
    const DEFAULT_BRAND = "Generic";

    let xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>${STORE_NAME}</title>
<link>${STORE_URL}</link>
<description>Your product catalog</description>`;

    Object.values(products).forEach((p: any) => {

      const id = p.ID || p.id || Math.random().toString(36).substring(7);

      const title = escapeXML(p.title || "Untitled product");

      const description = escapeXML(
        p.description || "High quality product available in our store."
      );

      const link =
        p.url ||
        `${STORE_URL}/${encodeURIComponent(p.ID)}`;
        const image =
        Array.isArray(p.imageProduct)
          ? escapeXML( p.imageProduct[0])
          : escapeXML(p.imageProduct)
          ? Array.from(p.imageProduct as Iterable<string>)[0]
          : "";

      const priceNumber =
        typeof p.price === "number"
          ? p.price
          : parseFloat(p.price || "0");

      const price = `${priceNumber.toFixed(2)}`;

      const availability =
        p.stock && p.stock > 0 ? "in stock" : "out of stock";

      const brand = escapeXML(p.brand || DEFAULT_BRAND);

      const condition = p.condition || "new";

      xml += `
<item>
<g:id>${id}</g:id>
<g:title>${title}</g:title>
<g:description>${description}</g:description>
<g:link>${link}</g:link>
<g:image_link>${image}</g:image_link>
<g:availability>${availability}</g:availability>
<g:price>${price}</g:price>
<g:brand>${brand}</g:brand>
<g:condition>${condition}</g:condition>
<g:identifier_exists>false</g:identifier_exists>
</item>`;
    });

    xml += `
</channel>
</rss>`;

    res.setHeader("Content-Type", "application/xml");
    res.status(200).send(xml);
  } catch (err) {
    console.error(err);
    res.status(500).send("Failed to generate feed");
  }
}

function escapeXML(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}