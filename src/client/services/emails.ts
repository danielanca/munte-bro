// api.ts
import { orderProps, ProductModel, CuponModel, OrderModel } from "../utils/OrderInterfaces";
import { getCookie } from "../utils/functions";
import { ReviewsInterface } from "../utils/ReviewsTypes";
import { NewsProps } from "../utils/NewsletterInterface";
import { getType } from "../utils/TableTypes";

// If you still need this later, re-add where it's used.
// import { miniAlbum_zipURL } from "./minialbumzip";

// -------------------------
// Destination (env-aware)
// -------------------------
const destination =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/sapunmontan/us-central1"
    : "https://us-central1-sapunmontan.cloudfunctions.net";

// -------------------------
// Small fetch helper
// -------------------------
type ApiOptions<T> = {
  /** If the endpoint returns JSON, leave true; if it returns an empty body or raw Response, set false */
  parseJson?: boolean;
  /** Additional fetch options (headers merged) */
  init?: RequestInit;
  /** If you need to override headers */
  headers?: Record<string, string>;
  /** Optional: body object (auto-JSON) */
  body?: unknown;
};

async function apiFetch<T = any>(path: string, opts: ApiOptions<T> = {}): Promise<T> {
  const {
    parseJson = true,
    init = {},
    headers = { "Content-Type": "application/json" },
    body,
  } = opts;

  const response = await fetch(`${destination}${path.startsWith("/") ? "" : "/"}${path}`, {
    credentials: "include",
    method: "POST",
    mode: "cors",
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...init,
  });

  // Allow callers to handle non-2xx server responses upstream if needed
  // but still try to parse JSON when expected.
  if (!response.ok && parseJson) {
    let errText: unknown;
    try {
      errText = await response.text();
    } catch {
      errText = `HTTP ${response.status}`;
    }
    throw new Error(typeof errText === "string" ? errText : `HTTP ${response.status}`);
  }

  if (!parseJson) return (response as unknown) as T;

  // Some endpoints may return empty responses
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : (undefined as unknown as T);
}

// -------------------------
// ORDERS
// -------------------------
export const requestOrdersList = async () => {
  return apiFetch<Response>("/requestOrders", {
    parseJson: false, // this endpoint returns plain Response in original code
    body: {
      authCookie: getCookie("jwt"),
    },
  });
};

export const updateOrder = async (orderModel: OrderModel) => {
  return apiFetch<Response>("/updateOrder", {
    parseJson: false,
    body: orderModel,
  });
};

// NEW in second file: update entire order's payment status by orderId (JSON response expected)
export const updateOrderPaymentStatus = async (orderId: number, paymentStatus: string) => {
  return apiFetch<any>("/updateOrderPaymentStatus", {
    body: { orderId, paymentStatus },
  });
};

// Present only in second file; keep CORS (avoid no-cors unless backend requires it)
export const updatePaymentStatus = async (invoiceID: string, paymentStatus: string) => {
  return apiFetch<any>("/updatePaymentStatus", {
    body: { invoiceID, paymentStatus },
  });
};

// -------------------------
// AUTH
// -------------------------
export const requestLoginAccess = async (email: string, password: string) => {
  return apiFetch<Response>("/requestAuth", {
    parseJson: false,
    body: { email, password },
  });
};

// -------------------------
// PRODUCTS
// -------------------------
export const updateProduct = async (productModel: ProductModel) => {
  return apiFetch<Response>("/updateProduct", {
    parseJson: false,
    body: productModel,
  });
};

export const addProduct = async (productModel: ProductModel) => {
  return apiFetch<Response>("/addProduct", {
    parseJson: false,
    body: productModel,
  });
};

export const deleteProduct = async (productModel: ProductModel) => {
  // server expects only the ID in the body (as in both originals)
  return apiFetch<Response>("/deleteProduct", {
    parseJson: false,
    body: productModel.ID,
  });
};

// -------------------------
// COUPONS (added from second file)
// -------------------------
export const updateCupon = async (cuponModel: CuponModel) => {
  return apiFetch<Response>("/updateCupon", {
    parseJson: false,
    body: cuponModel,
  });
};

export const addCupon = async (cuponModel: CuponModel) => {
  return apiFetch<Response>("/addCupon", {
    parseJson: false,
    body: cuponModel,
  });
};

export const deleteCupon = async (cuponModel: CuponModel) => {
  return apiFetch<Response>("/deleteCupon", {
    parseJson: false,
    body: cuponModel.ID,
  });
};

// -------------------------
// REVIEWS
// -------------------------
export const sendReviewToBack = async (reviewObj: ReviewsInterface) => {
  return apiFetch<Response>("/sendReviewToServer", {
    parseJson: false,
    body: {
      name: reviewObj.name,
      starsNumber: reviewObj.starsNumber,
      reviewActual: reviewObj.reviewActual,
      email: reviewObj.email,
      reviewProductID: reviewObj.reviewProductID,
      mediaLink: reviewObj.mediaLink,
    },
  });
};

// -------------------------
// NEWSLETTER
// -------------------------
export const addToNewsletter = async (subscriberData: NewsProps) => {
  return apiFetch<Response>("/subscribeToNewsletter", {
    parseJson: false,
    body: subscriberData,
  });
};

// -------------------------
// STRINGS CRUD
// -------------------------
export const getStringsList = async (type: string): Promise<getType> => {
  return apiFetch<getType>("/getStringsList", {
    body: { stringRequest: type },
  });
};

export const sendStringsList = async (type: string, payload: string): Promise<getType> => {
  return apiFetch<getType>("/sendStringsList", {
    body: { stringRequest: type, payload },
  });
};

// -------------------------
// EMAIL / ORDER CONFIRMATION
// -------------------------
export const sendOrderConfirmation = async (data: orderProps) => {
  // union of both versions’ fields; we include county, lockerName, deliveryMethod when present
  return apiFetch<Response>("/sendEmail", {
    parseJson: false,
    body: {
      firstName: data.firstName,
      lastName: data.lastName,
      emailAddress: data.emailAddress,
      city: data.city,
      county: (data as any).county, // optional (only 2nd file had it)
      phoneNo: data.phoneNo,
      paymentMethod: data.paymentMethod,
      deliveryName: data.deliveryName,
      deliveryAddress: data.deliveryAddress,
      orderNotes: data.orderNotes,
      cartSum: data.cartSum,
      shippingTax: data.shippingTax,
      cartProducts: data.cartProducts,
      paymentStatus: data.paymentStatus,
      lockerName: (data as any).lockerName,       // present in first file
      deliveryMethod: (data as any).deliveryMethod, // present in first file
    },
  });
};
