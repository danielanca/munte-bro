import { doc, getFirestore, getDoc } from "firebase/firestore";
import { initializeApp, getApps } from "firebase/app";
import app from "./../firebase";

const db = getFirestore(app);

if (!getApps().length) {
  initializeApp({ /* your config */ });
}



export const getData = async () => {
  const documentRef = doc(db, "products", "activeProds");
  let fetchedData = null;
  const docSnap = await getDoc(documentRef);

  if (docSnap.exists()) {
    fetchedData = docSnap.data();
  } else {
    console.log("No documents found");
  }

  return fetchedData;
};
