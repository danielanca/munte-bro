// fetchers.ts
import { orderProps } from "../../client/utils/OrderInterfaces";
import { sendOrderConfirmation } from "../../client/services/emails";
import { NavigateFunction } from "react-router-dom";
import configsAPI from "../../client/data/configsAPI.json";
import { createOrder, updateOrderStatus } from "../services/orders";

type OrderState =
  | "initState"
  | "requestState"
  | "validRequestState"
  | "pendingState"
  | "errorState"
  | "triggeredState"
  | "finishState";

type OrderUpdateModel = {
  invoiceID: string;
  paymentStatus: "PAID" | "UNPAID";
};

const CFG = configsAPI as any;
const normalizePay = (m?: string) => String(m ?? "").trim().toUpperCase();
const isCard = (m?: string) => normalizePay(m) === "CARD";
const resolveReturnUrl = () =>
  (CFG?.paymentApi?.returnUrl?.trim?.() ||
    (typeof window !== "undefined" ? `${window.location.origin}/finalizare-comanda` : "https://dinmunte.ro/finalizare-comanda"));

const tryParseItems = (json?: string) => {
  try { const v = JSON.parse(json ?? "[]"); return Array.isArray(v) ? v : []; } catch { return []; }
};

// ---- payment validation (unchanged) ----
export const payValidationCheck = async (
  setOrderState: React.Dispatch<React.SetStateAction<OrderState>>,
  updateOrder: (orderModel: OrderUpdateModel) => Promise<any>
) => {
  try {
    const qp = new URLSearchParams(window.location.search);
    const invoiceNumberID = qp.get("orderId");
    if (!invoiceNumberID) return;

    const statusUrl = CFG.paymentApi.paymentUrlGetOrderStatusExtended;
    const body = `userName=test_iPay9_api&password=test_iPay9_ap!t5r&orderId=${encodeURIComponent(invoiceNumberID)}`;

    const resp = await fetch(statusUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    const data = await resp.json();

    if (data?.paymentAmountInfo?.paymentState === "APPROVED") {
      try { await updateOrder({ invoiceID: data.orderNumber ?? "", paymentStatus: "PAID" }); } catch {}
      const firestoreId = sessionStorage.getItem("lastOrderId");
      if (firestoreId) { try { await updateOrderStatus(firestoreId, { status: "paid" }); } catch {} }
      setOrderState("finishState");
    } else {
      setOrderState("pendingState");
    }
  } catch (e) {
    console.error("Error fetching payment status:", e);
  }
};

// ---- create order even if email fails ----
export const handleSend = async (
  orderData: orderProps,
  setOrderState: React.Dispatch<React.SetStateAction<OrderState>>,
  _navigate?: NavigateFunction
) => {
  try {
    // 1) Fire & forget the email — never block or throw
    try {
      // do not await; swallow connection errors
      void sendOrderConfirmation(orderData).catch(() => {});
    } catch { /* ignore sync issues too */ }

    // 2) Prepare order payload
    const items = tryParseItems(orderData.cartProducts);
    const cartSum = Number(orderData.cartSum ?? 0);
    const shippingTax = Number(orderData.shippingTax ?? 0);
    const totalSum = cartSum + shippingTax;

    // 3) Always create Firestore order
    const { id: firestoreOrderId } = await createOrder({
      firstName: orderData.firstName,
      lastName: orderData.lastName,
      emailAddress: orderData.emailAddress,
      phoneNo: orderData.phoneNo,
      city: orderData.city,
      deliveryAddress: orderData.deliveryAddress,
      orderNotes: orderData.orderNotes ?? "",
      cartSum,
      shippingTax,
      paymentMethod: orderData.paymentMethod,
      items,
      status: isCard(orderData.paymentMethod) ? "awaiting_payment" : "pending",
      meta: { total: totalSum },
    });

    sessionStorage.setItem("lastOrderId", firestoreOrderId);

    // 4) Card → register & redirect
    if (isCard(orderData.paymentMethod)) {
      const apiBT = CFG.paymentApi.registerPreauth;
      const returnUrl = resolveReturnUrl();
      const currentDate = new Date().toISOString();
      const phone = Number.parseInt(orderData.phoneNo ?? "0", 10).toString();

      const orderBundle = {
        orderCreationDate: currentDate,
        customerDetails: {
          email: orderData.emailAddress,
          phone,
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

      const formBody =
        `userName=test_iPay9_api&password=test_iPay9_ap!t5r` +
        `&orderNumber=${encodeURIComponent(firestoreOrderId)}` +
        `&amount=${encodeURIComponent(String(totalSum))}` +
        `&currency=946` +
        `&description=${encodeURIComponent("DinMunte")}` +
        `&returnUrl=${encodeURIComponent(returnUrl)}` +
        `&orderBundle=${encodeURIComponent(JSON.stringify(orderBundle))}`;

      const response = await fetch(apiBT, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formBody,
      });

      if (!response.ok) throw new Error(`registerPreauth failed: ${response.status} ${response.statusText}`);

      const { formUrl } = await response.json();
      if (!formUrl) throw new Error("registerPreauth missing formUrl");

      try { await updateOrderStatus(firestoreOrderId, { status: "awaiting_payment" }); } catch {}
      setOrderState("pendingState");
      window.location.replace(formUrl);
      return; // redirecting
    }

    // 5) Ramburs → finish
    await updateOrderStatus(firestoreOrderId, { status: "pending" });
    setOrderState("finishState");
  } catch (error) {
    console.error("handleSend unexpected error:", error);
    setOrderState("errorState");
  }
};
