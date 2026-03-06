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
