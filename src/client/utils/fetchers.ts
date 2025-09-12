/* eslint-disable no-undef */
// @ts-nocheck
import { orderProps } from "../../client/utils/OrderInterfaces";
import { sendOrderConfirmation } from "../../client/services/emails";
import { NavigateFunction } from "react-router-dom";
import configsAPI from "./../../client/data/configsAPI.json";

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

// Function to check payment validation
export const payValidationCheck = async (
  setOrderState: React.Dispatch<React.SetStateAction<OrderState>>,
  updateOrder: (orderModel: OrderUpdateModel) => Promise<any>
) => {
  try {
    const queryParams = new URLSearchParams(window.location.search);
    const invoiceNumberID = queryParams.get("orderId");

    if (!invoiceNumberID) {
      console.log("Query parameters are not present.");
      return;
    }

    const token = queryParams.get("token");
    const approvalCode = queryParams.get("approvalCode");
    const refNum = queryParams.get("refNum");
    const language = queryParams.get("language");

    console.log("orderId:", invoiceNumberID);
    console.log("token:", token);
    console.log("approvalCode:", approvalCode);
    console.log("refNum:", refNum);
    console.log("language:", language);

    const apiPLATA = configsAPI.paymentApi.paymentUrlGetOrderStatusExtended;
    const info = `userName=test_iPay9_api&password=test_iPay9_ap!t5r&orderId=${invoiceNumberID}`;

    const response = await fetch(apiPLATA, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: info,
    });
    const data = await response.json();
    console.log("Other API Response:", data);

    if (data.paymentAmountInfo.paymentState == "APPROVED") {
      setOrderState("finishState");
      const idOrder = data.orderNumber;

      const orderModel: OrderUpdateModel = {
        invoiceID: idOrder,
        paymentStatus: "PAID",
      };

      updateOrder(orderModel)
        .then((response: any) => {
          console.log("Order updated successfully:", response);
        })
        .catch((error: any) => {
          console.error("Error updating order:", error);
        });

      console.log("Payment for ID :", idOrder);
    } else {
      setOrderState("pendingState");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

export const handleSend = async (
  orderData: orderProps,
  setOrderState: React.Dispatch<React.SetStateAction<OrderState>>,
  navigate?: NavigateFunction
) => {
  try {
    const HandleSendResponse = await sendOrderConfirmation(orderData);
    const HandleSendJsonResponse = await HandleSendResponse.json();
    console.log("Handle Send Response:", HandleSendJsonResponse);
    const orderID = HandleSendJsonResponse.invoiceNumberID;

    console.log("ID ul este : ", orderID);
    const currentDate = new Date().toISOString();
    const shippingTax = orderData.shippingTax ? orderData.shippingTax : 0;
    const totalSum = orderData.cartSum + shippingTax;
    const decimalPhoneNumber = parseInt(orderData.phoneNo, 10).toString();
    
    if (orderData.paymentMethod === "CARD") {
        window.location.replace(returnUrl);
      } else {
        setOrderState("finishState");
      }  
        
  } catch (error) {
    console.error("Unexpected error:", error);
    setOrderState("errorState");
  }
};

export const handleSend_old = async (
  orderData: orderProps,
  setOrderState: React.Dispatch<React.SetStateAction<OrderState>>,
  navigate?: NavigateFunction
) => {
  try {
    const HandleSendResponse = await sendOrderConfirmation(orderData);
    const HandleSendJsonResponse = await HandleSendResponse.json();
    console.log("Handle Send Response:", HandleSendJsonResponse);
    const orderID = HandleSendJsonResponse.invoiceNumberID;

    console.log("ID ul este : ", orderID);
    const apiBT = configsAPI.paymentApi.registerPreauth;
    const currentDate = new Date().toISOString();
    const shippingTax = orderData.shippingTax ? orderData.shippingTax : 0;
    const totalSum = orderData.cartSum + shippingTax;
    const decimalPhoneNumber = parseInt(orderData.phoneNo, 10).toString();
    const body = `userName=test_iPay9_api&password=test_iPay9_ap!t5r&orderNumber=${orderID}&amount=${totalSum}&currency=946&description=testBT&returnUrl=https://diniubire.ro/finalizare-comanda&orderBundle={"orderCreationDate":"${currentDate}","customerDetails":{"email":"${orderData.emailAddress}","phone":${decimalPhoneNumber},"deliveryInfo":{"deliveryType":"comanda","country":"642","city":"${orderData.city}","postAddress":"${orderData.deliveryAddress}","postalCode":"12345"},"billingInfo":{"deliveryType":"comanda","country":"642","city":"${orderData.city}","postAddress":"${orderData.deliveryAddress}","postalCode":"12345"}}}`;

    const response = await fetch(apiBT, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      const returnUrl = jsonResponse.formUrl;
      console.log(returnUrl);
      console.log("Metoda de plata este : ", orderData.paymentMethod);

      if (orderData.paymentMethod === "CARD") {
        window.location.replace(returnUrl);
      } else {
        setOrderState("finishState");
      }
    } else {
      console.error("Error sending order data to the API:", response.statusText);
      setOrderState("errorState");
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    setOrderState("errorState");
  }
};

export const shipmentSend = async (
  orderData: orderProps,
  setorderData: React.Dispatch<React.SetStateAction<orderProps>>,
  setOrderState: React.Dispatch<React.SetStateAction<OrderState>>
) => {
  try {
    const shipmentAPI = configsAPI.shipmentAPI.shipmentURL;
    const response = await fetch(shipmentAPI, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": configsAPI.shipmentAPI.apiKey,
      },
      body: JSON.stringify({
        recipient: {
          name: orderData.firstName + " " + orderData.lastName,
          address: orderData.deliveryAddress,
          email: orderData.emailAddress,
          city: orderData.countyID,
          phone: orderData.phoneNo,
          country: "RO",
        },
        sender: {
          name: "DinIubire.Ro",
          address: "Cluj",
          email: "diniubire.ro@gmail.com",
          city: 256509,
          phone: "0745469907",
          country: "RO",
        },
        content: {
          package_content: "kit mulaj maini",
          parcels: 1,
          weight: 2,
          cash_on_delivery: (orderData.shippingTax ? orderData.shippingTax : 0) + orderData.cartSum,
          length: 22,
          width: 22,
          height: 22,
          insurance: 0,
          iban: "RO65BTRLRONCRT0667325701",
          open_package: 0,
          order_id: "",
        },
        courier_id: 2,
      }),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log(jsonResponse);
      setorderData(currentData => ({ ...currentData, awb: jsonResponse.awb }));
      orderData.awb = jsonResponse.awb;
      console.log("AWB-ul este", orderData.awb);
    } else {
      console.error("Error sending order data to the API:", response.statusText);
      setOrderState("errorState");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
