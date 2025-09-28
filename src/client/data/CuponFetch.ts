// src/data/CuponFetch.ts
import { doc, getFirestore, getDoc } from "firebase/firestore";
import app from "../firebase";

export interface Cupon {
  cuponCode: string;
  cuponDiscount: number; // percentage, e.g. 10
  // allow extra fields without failing typing:
  [key: string]: unknown;
}

const db = getFirestore(app);

/**
 * Reads cupons from a single document that stores a map of cupons.
 * Firestore path: cupondiscount/activeCupon
 */
export const getCuponData = async (): Promise<Cupon[]> => {
  const ref = doc(db, "cupondiscount", "activeCupon");
  const snap = await getDoc(ref);
  if (!snap.exists()) return [];
  const data = snap.data() ?? {};
  // Document is expected to be a map: { SOME_ID: { cuponCode, cuponDiscount, ... }, ... }
  return Object.values(data) as Cupon[];
};
