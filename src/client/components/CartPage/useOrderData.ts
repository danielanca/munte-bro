import { useState } from "react";
import { orderProps } from ".././../utils/OrderInterfaces";
import { productConstants } from "../../data/componentStrings";

export const useOrderObject = () => {
  const [orderData, setorderData] = useState<orderProps>({
    firstName: "",
    lastName: "",
    emailAddress: "",
    deliveryAddress: "",
    city: "",
    paymentMethod: "",
    cartProducts: "",
    phoneNo: "",
    cartSum: 0,
    shippingTax: productConstants.shippingFee,
    orderNotes: "",
    deliveryName: "Sameday Curier",
    paymentStatus: "NOT_PAID",
    deliveryMethod: "NOT_SPECIFIED",
    lockerName: "",
    countyID: "",
    awb: "",
  });

  return { orderData, setorderData };
};
