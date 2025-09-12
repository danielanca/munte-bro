import { orderProps, ProductModel, OrderModel } from "../utils/OrderInterfaces";
import { getCookie } from "../utils/functions";
import { ReviewsInterface } from "../utils/ReviewsTypes";
import { NewsProps } from "../utils/NewsletterInterface";
import { getType } from "../utils/TableTypes";
import { destination } from "./../../server/constants/address";
import { miniAlbum_zipURL } from "./minialbumzip";

export const requestOrdersList = async () => {
  return await fetch(`${destination}/requestOrders`, {
    credentials: "include",
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      someData: "someTest",
      authCookie: getCookie("jwt"),
    }),
  })
    .then(res => res)
    .catch(error => error);
};

export const sendReviewToBack = async (reviewObj: ReviewsInterface) => {
  return await fetch(`${destination}/sendReviewToServer`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({
      name: reviewObj.name,
      starsNumber: reviewObj.starsNumber,
      reviewActual: reviewObj.reviewActual,
      email: reviewObj.email,
      reviewProductID: reviewObj.reviewProductID,
      mediaLink: reviewObj.mediaLink,
    }),
  })
    .then(res => res)
    .catch(error => error);
};

// export const sendOrderConfirmation = async (data: orderProps) => {
//   try {
//     const downloadURL = await miniAlbum_zipURL(data.firstName, data.lastName);
//     if (downloadURL === "") {
//       console.warn("No download link");
//     }

//     const response = await fetch(`${destination}/sendEmail`, {
//       method: "POST",
//       mode: "cors",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         firstName: data.firstName,
//         lastName: data.lastName,
//         emailAddress: data.emailAddress,
//         city: data.city,
//         phoneNo: data.phoneNo,
//         paymentMethod: data.paymentMethod,
//         deliveryName: data.deliveryName,
//         deliveryAddress: data.deliveryAddress,
//         orderNotes: data.orderNotes,
//         cartSum: data.cartSum,
//         shippingTax: data.shippingTax,
//         cartProducts: data.cartProducts,
//         paymentStatus: data.paymentStatus,
//         lockerName: data.lockerName,
//         deliveryMethod: data.deliveryMethod,
//         downloadURL: downloadURL,
//       }),
//     });
//     return response;
//   } catch (error) {
//     console.error("Error in sending order confirmation:", error);
//     return null;
//   }
// };

export const sendOrderConfirmation = async (data: orderProps) => {
  return await fetch(`${destination}/sendEmail`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      firstName: data.firstName,
      lastName: data.lastName,
      emailAddress: data.emailAddress,
      city: data.city,
      phoneNo: data.phoneNo,
      paymentMethod: data.paymentMethod,
      deliveryName: data.deliveryName,
      deliveryAddress: data.deliveryAddress,
      orderNotes: data.orderNotes,
      cartSum: data.cartSum,
      shippingTax: data.shippingTax,
      cartProducts: data.cartProducts,
      paymentStatus: data.paymentStatus,
      lockerName: data.lockerName,
      deliveryMethod: data.deliveryMethod,
    }),
  })
    .then(res => res)
    .catch(error => error);
};

export const requestLoginAccess = async (email: string, password: string) => {
  return await fetch(`${destination}/requestAuth`, {
    credentials: "include",
    method: "POST",
    mode: "cors",
    body: JSON.stringify({ email: email, password: password }),
  })
    .then(res => res)
    .catch(error => error);
};

export const updateProduct = async (productModel: ProductModel) => {
  return await fetch(`${destination}/updateProduct`, {
    credentials: "include",
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(productModel),
  })
    .then(res => res)
    .catch(error => error);
};
export const addProduct = async (productModel: ProductModel) => {
  return await fetch(`${destination}/addProduct`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(productModel),
  })
    .then(res => res)
    .catch(error => error);
};

export const deleteProduct = async (productModel: ProductModel) => {
  console.log("Sending to database to DELETE :", productModel.ID);
  return await fetch(`${destination}/deleteProduct`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(productModel.ID),
  })
    .then(res => res)
    .catch(error => error);
};

export const addToNewsletter = async (subscriberData: NewsProps) => {
  console.log("We are sending this to the server:", subscriberData);
  return await fetch(`${destination}/subscribeToNewsletter`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify(subscriberData),
  })
    .then(res => res)
    .catch(error => error);
};

export const getStringsList = async (type: string): Promise<getType> => {
  return await fetch(`${destination}/getStringsList`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ stringRequest: type }),
  })
    .then(result => result.json().then((resultString: getType) => resultString))
    .catch(error => error);
};
export const sendStringsList = async (type: string, payload: string): Promise<getType> => {
  return await fetch(`${destination}/sendStringsList`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    mode: "cors",
    body: JSON.stringify({ stringRequest: type, payload }),
  })
    .then(result => result.json().then(resultString => resultString))
    .catch(error => error);
};

export const updateOrder = async (orderModel: OrderModel) => {
  return await fetch(`${destination}/updateOrder`, {
    credentials: "include",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderModel),
  })
    .then(res => res)
    .catch(error => error);
};
