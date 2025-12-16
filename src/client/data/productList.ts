import { collection, doc, getFirestore, getDoc, getDocs, deleteDoc, updateDoc ,FieldValue ,deleteField, setDoc  } from "firebase/firestore";
import app from "../firebase";
let productList :any[]= [];


const db = getFirestore(app);
const dbTest = getFirestore("test");
interface ProductType {
  id: string;
  name: string;
  itemNumber: string;
  imageProduct: string;
  price: string;
  discountedPrice: string;
  realStock: string;
  realStockCheck: string;
  fakeStock: string;
  fakeStockCheck: string;
}

interface OrderType {
  orderId: string;
  cartProducts: ProductType[];
  cartSum: number;
  city: string;
  county: string;
  deliveryAddress: string;
  deliveryName: string;
  emailAddress: string;
  firstName: string;
  invoiceID: string;
  lastName: string;
  orderNotes: string;
  paymentMethod: string;
  paymentStatus: string;
  phoneNo: string;
  shippingTax: number;
  timestamp: string;
}

interface InvoiceModel {
  client: {
    fullName: string;
    CUI: string;
    banca: string;
    adresa: string;
    email: string;
    telefon: string;
  };
  provider: {
    fullName: string;
    adresa: string;
    telefon: string;
  };
  items: InvoiceItem[];
  ID: string;
}
interface InvoiceItem {
  product: string;
  price: number;
  quantity: number;
}

// interface productType {
//   ID: string;
//   ULbeneficii: [];
//   firstDescription: string;
//   imageProduct: [];
//   jsonContent: string;
//   price: string;
//   reviews: {};
//   shortDescription: string;
//   title: string;
// }

interface productType {
  ID: string;
  ULbeneficii: string[]; // Change to string[] to allow multiple benefits
  firstDescription: string;
  imageProduct: string[]; // Change to string[] to allow multiple image URLs
  jsonContent: string;
  price: string;
  reviews: Record<string, any>; // Use Record for flexible review objects
  shortDescription: string;
  title: string;
}


export const deleteProductByID = async (productID: string) => {
  try {
    const activeProductsDocRef = doc(db, "products", "activeProds");
    await updateDoc(activeProductsDocRef, {
      [productID]: deleteField()
    });

    console.log(`Product with ID ${productID} successfully deleted from Firebase.`);
  } catch (error) {
    console.error("Error deleting product:", error);
    throw error;
  }
};
// export const updateProduct = async (productId: string, updatedData: Partial<productType>) => {
//   try {
//     const productDoc = doc(db, "products", productId);
//     await updateDoc(productDoc, updatedData);
//     console.log(`Product with ID ${productId} updated successfully.`);
//   } catch (error) {
//     console.error("Error updating product:", error);
//     throw error;
//   }
// };

export const getOrderByID = async (invoiceID: number) => {
  
  const LoadData = async() =>{
    const fireStoreModule = await import('firebase/firestore');
    const getOrderName = "MNT-"+invoiceID.toString();
    const productData = fireStoreModule.doc(db, "orders",getOrderName );
    const snap = await fireStoreModule.getDoc(productData);
    let productsAreHere;
    if (snap.exists()) {
      productsAreHere = snap.data();
    }
    return productsAreHere;
  }
  return LoadData();

};
// export const getAllOrders = async () => {
//   const snapShot = await getDocs(collection(db, "orders"));
//   let dataProducts:any[] = [];

//   snapShot.forEach((doc) => {
//     dataProducts.push(doc.data());
//   });

//   return dataProducts;
// };

export const getAllOrders = async (): Promise<OrderType[]> => {
  const snapShot = await getDocs(collection(db, "orders"));
  let dataOrders: OrderType[] = [];

  snapShot.forEach((doc) => {
    const orderData = doc.data();
    dataOrders.push({
      orderId: orderData.invoiceID,
      cartProducts: JSON.parse(orderData.cartProducts), 
      cartSum: orderData.cartSum,
      city: orderData.city,
      county: orderData.county,
      deliveryAddress: orderData.deliveryAddress,
      deliveryName: orderData.deliveryName,
      emailAddress: orderData.emailAddress,
      firstName: orderData.firstName,
      invoiceID: orderData.invoiceID,
      lastName: orderData.lastName,
      orderNotes: orderData.orderNotes,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus,
      phoneNo: orderData.phoneNo,
      shippingTax: orderData.shippingTax,
      timestamp: orderData.timestamp,
    });
  });

  return dataOrders;
};

export const deleteOrderByID = async (orderID: string) => {
  try {
    const orderDocRef = doc(db, "orders", orderID);
    await deleteDoc(orderDocRef);
    console.log(`Order with ID ${orderID} successfully deleted from Firebase.`);
  } catch (error) {
    console.error("Error deleting order:", error);
    throw error;
  }
};

export const getData = async () => {
  const snapShot = await getDocs(collection(db , "products"));
  let dataProducts = {};

  snapShot.forEach((doc) => {
    Object.values(doc.data()).forEach((itemData: productType) => {
      dataProducts = {
        ...dataProducts,
        [itemData.ID]: {
          ID: itemData.ID,
          ULbeneficii: itemData.ULbeneficii,
          firstDescription: itemData.firstDescription,
          imageProduct: itemData.imageProduct,
          jsonContent: itemData.jsonContent,
          price: itemData.price,
          reviews: itemData.reviews,
          shortDescription: itemData.shortDescription,
          title: itemData.title
        }
      };
    });
  });
  return dataProducts;
};

export const getProductWithID = async (productID: string) => {
  const productData = doc(db, "products", "activeProds");
  const snap = await getDoc(productData);
  let productsAreHere:any;
  if (snap.exists()) {
    Object.values(snap.data()).map((item: productType) => {
      productsAreHere = {
        ...productsAreHere,
        [item.ID]: {
          ID: item.ID,
          ULbeneficii: item.ULbeneficii,
          firstDescription: item.firstDescription,
          imageProduct: item.imageProduct,
          jsonContent: item.jsonContent,
          price: item.price,
          reviews: item.reviews,
          shortDescription: item.shortDescription,
          title: item.title
        }
      };  
    }); 
    // productsAreHere = Object.values(snap.data());  
  } 
  //Here we need to make the call for a specific ID, not for the whole collection of products.  
  //but till then, we will do this way. 
  console.log("getProductWithID will return :", productsAreHere); 

  return productsAreHere;
};
const getallPr = async () => {
  const productData = doc(db, "products", "activeProds");
  const snap = await getDoc(productData);
  let productsAreHere: any[] = [];
  if (snap.exists()) {
    productsAreHere = Object.values(snap.data());
  }
  //Here we need to make the call for a specific ID, not for the whole collection of products.
  //but till then, we will do this way.

  return productsAreHere;
};
export const getInvoiceByID = async (ID: string) => {
  const invoiceData = doc(db, "invoice", "activeInvoice");
  const snapInvoice = await getDoc(invoiceData);
  var invoicesAreHere:any;
  if (snapInvoice.exists()) {
    Object.values(snapInvoice.data()).map(async (invoice: InvoiceModel) => {
      invoicesAreHere = {
        ...invoicesAreHere,
        [invoice.ID]: {
          ID: invoice.ID,
          clientName: invoice.client.fullName,
          clientCUI: invoice.client.CUI,
          clientBanca: invoice.client.banca,
          clientAdresa: invoice.client.adresa,
          clientTelefon: invoice.client.telefon,
          clientEmail: invoice.client.email,
          providerName: invoice.provider.fullName,
          providerAdresa: invoice.provider.adresa,
          providerTelefon: invoice.provider.telefon,
          items: invoice.items
        }
      };
    });
  }
  console.log("getInvoiceByID will return :", invoicesAreHere);

  return invoicesAreHere;
};
export const getObjectByID = (id: string): Promise<any> => {
  const documentRef = doc(db, "orders", id);

  return new Promise((resolve, reject) => {
    getDoc(documentRef)
      .then((documentSnapshot) => {
        if (documentSnapshot.exists()) {
          const objectData = documentSnapshot.data();
          console.log("Object data is:", objectData);
          // Process the object or perform any necessary transformations
          resolve(objectData);
        } else {
          // Handle the case when the document does not exist
          resolve(null);
        }
      })
      .catch((error) => {
        // Handle any errors that occur during the retrieval process
        console.error("Error fetching object from Firebase:", error);
        reject(error);
      });
  });
};

// devConsole("Product is loading...");

getallPr().then((data) => {
  productList = data;
  console.log("Done");
});

export const addProduct = async (product: productType) => {
  try {
    const activeProductsDocRef = doc(db, "products", "activeProds");
    const activeProductsDocSnap = await getDoc(activeProductsDocRef);

    if (activeProductsDocSnap.exists()) {
      const products = activeProductsDocSnap.data() || {};
      products[product.ID] = product;
      await updateDoc(activeProductsDocRef, products);
    } else {
      const newProduct = {
        [product.ID]: product
      };
      await setDoc(activeProductsDocRef, newProduct);
    }

    console.log(`Product with ID ${product.ID} successfully added to Firebase.`);
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const updateProduct = async (productId: string, updatedProductData: Partial<productType>) => {
  try {
    const productDocRef = doc(db, "products", "activeProds"); 

    // Get the current data
    const currentDoc = await getDoc(productDocRef);
    if (!currentDoc.exists()) {
      throw new Error(`Product with ID ${productId} does not exist.`);
    }
    await updateDoc(productDocRef, {
      [`${productId}`]: updatedProductData,
    });

    console.log(`Product with ID ${productId} updated successfully.`);
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const copyAllData = async () => {
  try {
    const collectionsSnapshot = await getDocs(collection(db, "orders"));
    for (const docSnapshot of collectionsSnapshot.docs) {
      const collectionRef = collection(dbTest, "orders");
      const docRef = doc(collectionRef, docSnapshot.id);
      const docData = docSnapshot.data();

      await setDoc(docRef, docData);

      console.log(`Document with ID ${docSnapshot.id} copied successfully.`);
    }

    console.log("All data copied successfully.");
  } catch (error) {
    console.error("Error copying data:", error);
  }
};

export default productList;
