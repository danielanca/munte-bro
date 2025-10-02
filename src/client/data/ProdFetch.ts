// data/ProdFetch.ts
import { doc, getFirestore, getDoc } from "firebase/firestore";
import app from "../firebase";
import { CuponModel } from "../utils/OrderInterfaces";

const db = getFirestore(app);

export const getData = async (id?: string): Promise<CuponModel[]> => {
  const documentRef = doc(db, "products", "activeProds");
  const snap = await getDoc(documentRef);
  if (!snap.exists()) return [];

  const data = snap.data();
  if (!data) return [];

  if (id && data[id]) return [data[id] as CuponModel];
  return Object.values(data) as CuponModel[];
};
