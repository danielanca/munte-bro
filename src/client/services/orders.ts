// services/orders.ts
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  serverTimestamp,
  orderBy,
  query,
} from "firebase/firestore";
import app from "../firebase";

import { writeBatch } from "firebase/firestore";

// ────────────────────────────────────────────────
// Bulk operations using batches (atomic & efficient)
// ────────────────────────────────────────────────

/**
 * Bulk update paymentStatus (or status) on multiple orders
 * @param orderIds - array of Firestore document IDs (usually the same as routeId/orderID)
 * @param paymentStatus - "PAID" | "UNPAID" | etc.
 * @param extraFields - optional additional fields (e.g. { status: "canceled", cancelledAt: ... })
 */

const db = getFirestore(app);
const ORDERS = "orders";

// ---------- Types ----------

export type OrderItem = {
  id: string;
  name: string;
  itemNumber: string;       // you currently pass strings
  imageProduct?: string;
  price?: string;           // base price as string
  discountedPrice?: string; // optional
};

export type OrderCreateInput = {
  // customer
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  phoneNo?: string;
  city?: string;
  deliveryAddress?: string;
  orderNotes?: string;

  // ✅ shipping / delivery (ADD THESE)
  deliveryName?: string;     // e.g. "Sameday Curier"
  deliveryMethod?: string;   // e.g. "NOT_SPECIFIED"
  lockerName?: string;       // optional locker/pickup point
  countyID?: string;         // optional county code/id
  parcelId?: string;
  // cart
  cartSum: number;
  shippingTax: number;
  paymentMethod: "ramburs" | "card" | string;
  items: OrderItem[];

  // misc
  status: "pending" | "awaiting_payment" | "paid" | "canceled";
  meta?: Record<string, any>;

  // legacy/compat (optional fields you already store)
  orderID?: string;                // friendly id like ORD-...
  invoiceID?: string | number;
  paymentStatus?: "PAID" | "UNPAID" | "CANCELLED" | string;
  cartProducts?: string | any[];   // sometimes saved as stringified JSON
  createdAt?: any;
  updatedAt?: any;
};

export type OrderDoc = OrderCreateInput & {
  id?: string; // Firestore doc id
};

// ---------- Create / Update ----------

export async function createOrder(input: OrderCreateInput): Promise<{ id: string }> {
  const ref = await addDoc(collection(db, ORDERS), {
    ...input,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return { id: ref.id };
}

export async function upsertOrderById(
  id: string,
  data: Partial<OrderCreateInput> & Record<string, any>
): Promise<{ id: string }> {
  const ref = doc(db, ORDERS, String(id));
  await setDoc(
    ref,
    {
      ...data,
      updatedAt: serverTimestamp(),
      createdAt: data.createdAt ?? serverTimestamp(),
    },
    { merge: true }
  );
  return { id: String(id) };
}

export async function updateOrderStatus(
  id: string,
  patch: Partial<Pick<OrderCreateInput, "status" | "meta">> & Record<string, any> = {}
) {
  await updateDoc(doc(db, ORDERS, String(id)), {
    ...patch,
    updatedAt: serverTimestamp(),
  });
}

// ---------- Read ----------

export async function listOrders(): Promise<OrderDoc[]> {
  const q = query(collection(db, ORDERS), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as OrderDoc) }));
}

export async function getOrderById(id: string): Promise<OrderDoc | null> {
  const ref = doc(db, ORDERS, String(id));
  const snap = await getDoc(ref);
  return snap.exists() ? ({ id: snap.id, ...(snap.data() as OrderDoc) }) : null;
}

// ---------- Optional helper used by the checkout bypass flow ----------

export async function saveOrderClientSide(orderID: string, raw: any) {
  await upsertOrderById(orderID, {
    ...raw,
    orderID,
    paymentStatus: raw?.paymentStatus ?? "UNPAID",
  });
}

export async function bulkUpdatePaymentStatus(
  orderIds: string[],
  paymentStatus: "PAID" | "UNPAID" |"CANCELLED" | string,
  extraFields: Record<string, any> = {}
): Promise<void> {
  if (orderIds.length === 0) return;

  const batch = writeBatch(db);

  for (const id of orderIds) {
    const ref = doc(db, ORDERS, String(id));
    batch.update(ref, {
      paymentStatus: paymentStatus.toUpperCase(),
      updatedAt: serverTimestamp(),
      ...extraFields,
    });
  }

  await batch.commit();
}

/**
 * Bulk cancel orders (sets both paymentStatus and status)
 */
export async function bulkCancelOrders(orderIds: string[]): Promise<void> {
  if (orderIds.length === 0) return;

  const batch = writeBatch(db);

  for (const id of orderIds) {
    const ref = doc(db, ORDERS, String(id));
    batch.update(ref, {
      paymentStatus: "Cancelled", 
      updatedAt: serverTimestamp(),
    });
  }

  await batch.commit();
}

/**
 * Bulk hard-delete multiple orders
 * WARNING: irreversible!
 */
export async function bulkDeleteOrders(orderIds: string[]): Promise<void> {
  if (orderIds.length === 0) return;

  const batch = writeBatch(db);

  for (const id of orderIds) {
    const ref = doc(db, ORDERS, String(id));
    batch.delete(ref);
  }

  await batch.commit();
}