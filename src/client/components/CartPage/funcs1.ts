// @ts-nocheck
import { orderProps } from "../../utils/OrderInterfaces";
export const areInputsValid = (orderData: orderProps) => {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const phoneRegex = /^\+?[0-9]{10,}$/;
  return (
    orderData.firstName.length >= 2 &&
    orderData.lastName.length >= 2 &&
    orderData.city.length >= 2 &&
    orderData.county.length >= 2 &&
    emailRegex.test(orderData.emailAddress) &&
    phoneRegex.test(orderData.phoneNo) &&
    orderData.deliveryAddress.length >= 2
  );
};
