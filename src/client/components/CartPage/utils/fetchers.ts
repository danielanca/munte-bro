// @ts-nocheck
import { orderProps } from "../../../utils/OrderInterfaces";
import { sendOrderConfirmation } from "../../../services/emails";
import { db } from "../../../firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage();


type OrderState =
  | "initState" | "requestState" | "validRequestState" | "pendingState"
  | "errorState" | "triggeredState" | "finishState";

const makeOrderId = () =>
  `ORD-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const saveOrderClientSide = async (orderID: string, data: orderProps) => {
  const ref = doc(db, "orders", String(orderID));
  await setDoc(ref, { ...data, orderID, paymentStatus: "UNPAID", createdAt: serverTimestamp()}, { merge: true });
};

function base64ToBlob(base64: string) {
  const byteCharacters = atob(base64);
  const byteArrays = [];

  for (let i = 0; i < byteCharacters.length; i++) {
    byteArrays.push(byteCharacters.charCodeAt(i));
  }

  return new Blob([new Uint8Array(byteArrays)], { type: "application/pdf" });
}


export const handleSend = async (
  orderData: orderProps,
  setOrderState: React.Dispatch<React.SetStateAction<OrderState>>,
) => {
  try {
    let orderID: string | undefined;

    // Try email (best effort only)
    try {
      const res = await sendOrderConfirmation(orderData);
      if (res?.ok) {
        const json = await res.json().catch(() => null);
        orderID = json?.orderID;
      } else {
        console.warn("sendEmail non-OK, bypassing:", res?.statusText);
      }
    } catch (e) {
      console.warn("sendEmail offline, bypassing.", e);
    }

    // Fallback order id + persist to Firestore
    if (!orderID) orderID = makeOrderId();


    const res = await fetch("http://localhost:5858/generate-awb", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData)
    });
  
    const data = await res.json();
    console.log(data);
  
    if (data.labelBase64) {
      const pdfBlob = base64ToBlob(data.labelBase64);
      const storageRef = ref(storage, `orders/${orderID}/awb.pdf`);
    
      await uploadBytes(storageRef, pdfBlob);
    
      const pdfUrl = await getDownloadURL(storageRef);
    
      // Save URL to orderData
      orderData.awb = pdfUrl;
    }
    
    await saveOrderClientSide(orderID, orderData);
   
    await fetch("http://localhost:5858/sendEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    });
    
  
    const method = (orderData.paymentMethod || "cash").toLowerCase();

    // >>> BYPASS: if not card, finish now
    if (method !== "card") {
      setOrderState("finishState");
      return;
    }

    // Card flow (also bypass on any failure)
    try {
      const apiBT = "https://ecclients.btrl.ro:5443/payment/rest/registerPreAuth.do";
      const currentDate = new Date().toISOString();
      const shippingTax = orderData.shippingTax ? orderData.shippingTax : 0;
      const totalSum = orderData.cartSum + shippingTax;
      const decimalPhoneNumber = parseInt(orderData.phoneNo, 10).toString();
      const returnUrl = `${window.location.origin}/finalizare-comanda`;
      const orderBundle = {
        orderCreationDate: currentDate,
        customerDetails: {
          email: orderData.emailAddress,
          phone: decimalPhoneNumber,
          deliveryInfo: {
            deliveryType: "comanda",
            country: "642",
            city: orderData.city,
            postAddress: orderData.deliveryAddress,
            postalCode: "12345",
          },
          billingInfo: {
            deliveryType: "comanda",
            country: "642",
            city: orderData.city,
            postAddress: orderData.deliveryAddress,
            postalCode: "12345",
          },
        },
      };

      const body =
        `userName=test_iPay9_api&password=test_iPay9_ap!t5r` +
        `&orderNumber=${encodeURIComponent(orderID)}` +
        `&amount=${encodeURIComponent(totalSum)}` +
        `&currency=946` +
        `&description=${encodeURIComponent("testBT")}` +
        `&returnUrl=${encodeURIComponent(returnUrl)}` +
        `&orderBundle=${encodeURIComponent(JSON.stringify(orderBundle))}`;

      const response = await fetch(apiBT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (response.ok) {
        const jsonResponse = await response.json();
        const formUrl = jsonResponse.formUrl;
        if (formUrl) {
          // normal redirect to BT page
          window.location.replace(formUrl);
          return;
        }
      }
      // If we reach here, gateway didn’t return a usable URL — bypass to finish
      setOrderState("finishState");
    } catch (e) {
      console.warn("BT gateway error, bypassing to finish:", e);
      setOrderState("finishState");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    // still finish (since you see orders in Firestore and want the done page)
    setOrderState("finishState");
  }
};
