// api.ts
import { orderProps, ProductModel, CuponModel, OrderModel } from "../utils/OrderInterfaces";
import { getCookie } from "../utils/functions";
import { ReviewsInterface } from "../utils/ReviewsTypes";
import { NewsProps } from "../utils/NewsletterInterface";
import { getType } from "../utils/TableTypes";

const destination =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000/sapunmontan/us-central1"
    : "https://us-central1-sapunmontan.cloudfunctions.net";

type ApiOptions<T> = {
  parseJson?: boolean;
  init?: RequestInit;
  headers?: Record<string, string>;
  body?: unknown;
};

async function apiFetch<T = unknown>(path: string, opts: ApiOptions<T> = {}): Promise<T> {
  const { parseJson = true, init = {}, headers = { "Content-Type": "application/json" }, body } = opts;
  const res = await fetch(`${destination}${path.startsWith("/") ? "" : "/"}${path}`, {
    credentials: "include",
    method: "POST",
    mode: "cors",
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    ...init,
  });
  if (!parseJson) return (res as unknown) as T;
  const text = await res.text();
  return text ? (JSON.parse(text) as T) : (undefined as unknown as T);
}

export const requestOrdersList = () =>
  apiFetch<Response>("/requestOrders", { parseJson: false, body: { authCookie: getCookie("jwt") } });

export const updateOrder = (orderModel: OrderModel) =>
  apiFetch<Response>("/updateOrder", { parseJson: false, body: orderModel });

export const updateOrderPaymentStatus = (orderId: number, paymentStatus: string) =>
  apiFetch<unknown>("/updateOrderPaymentStatus", { body: { orderId, paymentStatus } });

export const updatePaymentStatus = (invoiceID: string, paymentStatus: string) =>
  apiFetch<unknown>("/updatePaymentStatus", { body: { invoiceID, paymentStatus } });

export const requestLoginAccess = (email: string, password: string) =>
  apiFetch<Response>("/requestAuth", { parseJson: false, body: { email, password } });

export const updateProduct = (productModel: ProductModel) =>
  apiFetch<Response>("/updateProduct", { parseJson: false, body: productModel });

export const addProduct = (productModel: ProductModel) =>
  apiFetch<Response>("/addProduct", { parseJson: false, body: productModel });

export const deleteProduct = (productModel: ProductModel) =>
  apiFetch<Response>("/deleteProduct", { parseJson: false, body: productModel.ID });

export const updateCupon = (cuponModel: CuponModel) =>
  apiFetch<Response>("/updateCupon", { parseJson: false, body: cuponModel });

export const addCupon = (cuponModel: CuponModel) =>
  apiFetch<Response>("/addCupon", { parseJson: false, body: cuponModel });

export const deleteCupon = (cuponModel: CuponModel) =>
  apiFetch<Response>("/deleteCupon", { parseJson: false, body: cuponModel.ID });

export const sendReviewToBack = (reviewObj: ReviewsInterface) =>
  apiFetch<Response>("/sendReviewToServer", {
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

export const addToNewsletter = (subscriberData: NewsProps) =>
  apiFetch<Response>("/subscribeToNewsletter", { parseJson: false, body: subscriberData });

export const getStringsList = (type: string): Promise<getType> =>
  apiFetch<getType>("/getStringsList", { body: { stringRequest: type ?? "" } });

export const sendStringsList = (type: string, payload: string): Promise<getType> =>
  apiFetch<getType>("/sendStringsList", { body: { stringRequest: type ?? "", payload: payload ?? "" } });


export const sendOrderConfirmation = (data: orderProps) =>
  apiFetch<Response>("/sendEmail", {
    parseJson: false,
    body: {
      firstName: data.firstName,
      lastName: data.lastName,
      emailAddress: data.emailAddress,
      city: data.city,
      county: (data as any).county,
      phoneNo: data.phoneNo,
      paymentMethod: data.paymentMethod,
      deliveryName: data.deliveryName,
      deliveryAddress: data.deliveryAddress,
      orderNotes: data.orderNotes,
      cartSum: data.cartSum,
      shippingTax: data.shippingTax,
      cartProducts: data.cartProducts,
      paymentStatus: data.paymentStatus,
      lockerName: (data as any).lockerName,
      deliveryMethod: (data as any).deliveryMethod,
    },
  });
