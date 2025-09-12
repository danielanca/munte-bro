import { orderProps } from "../../utils/OrderInterfaces";
export const areInputsValid = (orderData: orderProps) => {
  return (
    orderData.firstName.length >= 2 &&
    orderData.lastName.length >= 2 &&
    orderData.city.length >= 2 &&
    orderData.phoneNo.length >= 2 &&
    orderData.deliveryAddress.length >= 2
  );
};
