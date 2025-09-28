// @ts-nocheck
import { orderProps } from "../../../utils/OrderInterfaces";
import { sendOrderConfirmation } from "../../../services/emails";
import { NavigateFunction } from 'react-router-dom';
type OrderState = "initState" | "requestState" | "validRequestState" | "pendingState" | "errorState" | "triggeredState" | "finishState";

type OrderUpdateModel = {
  invoiceID: string;
  paymentStatus: "PAID" | "UNPAID"; // Adjust based on your actual use case
};

export const payValidationCheck = async (setOrderState: React.Dispatch<React.SetStateAction<OrderState>>, updateOrder : (orderModel: OrderUpdateModel) => Promise<void>) => {
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const orderId = queryParams.get("orderId");
      // Check if any of the expected parameters are present
      if (!orderId) {
        console.log("Query parameters are not present.");
        return; // Exit the function early if no relevant query params are found
      }
      
      // Proceed with your existing logic if the check passes
      const token = queryParams.get("token");
      const approvalCode = queryParams.get("approvalCode");
      const refNum = queryParams.get("refNum");
      const language = queryParams.get("language");
      console.log("orderId:", orderId);
      console.log("token:", token);
      console.log("approvalCode:", approvalCode);
      console.log("refNum:", refNum);
      console.log("language:", language);

      const apiPLATA = "https://ecclients.btrl.ro:5443/payment/rest/getOrderStatusExtended.do";

      const info = `userName=test_iPay9_api&password=test_iPay9_ap!t5r&orderId=${orderId}`;

      const response = await fetch(apiPLATA, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: info
      });
      const data = await response.json();
      console.log("Other API Response:", data);

      if (data.paymentAmountInfo.paymentState == "APPROVED") {
        setOrderState("finishState");
        const idOrder = data.orderNumber;
        const orderModel = {
          invoiceID: idOrder,
          paymentStatus: "PAID"
        };

        updateOrder(orderModel)
          .then((response:any) => {
            console.log("Order updated successfully:", response);
          })
          .catch((error:any) => {
            console.error("Error updating order:", error);
          });

        console.log("Payment for ID :", idOrder);
      } else setOrderState("pendingState");
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };



  export const handleSend = async (orderData:orderProps, setOrderState: React.Dispatch<React.SetStateAction<OrderState>>, navigate?: NavigateFunction) => {
    try {
      const HandleSendResponse = await sendOrderConfirmation(orderData);
      const HandleSendJsonResponse = await HandleSendResponse.json();
      console.log("Handle Send Response:", HandleSendJsonResponse);
      const orderID = HandleSendJsonResponse.orderID; // Removed await as it's unnecessary
      const apiBT = "https://ecclients.btrl.ro:5443/payment/rest/registerPreAuth.do";
      const currentDate = new Date().toISOString();
      const shippingTax = orderData.shippingTax ? orderData.shippingTax : 0;
      const totalSum = orderData.cartSum + shippingTax;
      const decimalPhoneNumber = parseInt(orderData.phoneNo, 10).toString();
      const body = `userName=test_iPay9_api&password=test_iPay9_ap!t5r&orderNumber=${orderID}&amount=${totalSum}&currency=946&description=testBT&returnUrl=http://localhost:3000/finalizare-comanda&orderBundle={"orderCreationDate":"${currentDate}","customerDetails":{"email":"${orderData.emailAddress}","phone":${decimalPhoneNumber},"deliveryInfo":{"deliveryType":"comanda","country":"642","city":"${orderData.city}","postAddress":"${orderData.deliveryAddress}","postalCode":"12345"},"billingInfo":{"deliveryType":"comanda","country":"642","city":"${orderData.city}","postAddress":"${orderData.deliveryAddress}","postalCode":"12345"}}}`;
  
      const response = await fetch(apiBT, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: body
      });
  
      if (response.ok) {
        const jsonResponse = await response.json();
        console.log(jsonResponse);
        const returnUrl = jsonResponse.formUrl;
        console.log(returnUrl);
        if (orderData.paymentMethod === "card") {
          window.location.replace(returnUrl);
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
  