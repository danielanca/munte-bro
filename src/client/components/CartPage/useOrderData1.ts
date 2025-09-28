import { useState } from "react";
import { orderProps } from "../../utils/OrderInterfaces";
import { productConstants } from "../../data/componentStrings";

export const useOrderObject = () => {
  const [orderData, setorderData] = useState<orderProps>({
    firstName: "",
    lastName: "",
    emailAddress: "",
    deliveryAddress: "",
    city: "",
    county: "",
    paymentMethod: "",
    cartProducts: "",
    phoneNo: "",
    cartSum: 0,
    shippingTax: productConstants.shippingFee,
    orderNotes: "",
    deliveryName: "DPD Curier",
    paymentStatus: "NOT_PAID"
  });

  return { orderData, setorderData };
};
