import React, { useEffect, useState } from "react";
import { OrderViewProps } from "../../utils/OrderInterfaces";
import { PDFView } from "./pdf";

type invoiceInterface = {
  invoiceObject: OrderViewProps;
};
const View = ({ invoiceObject }: invoiceInterface) => {
  return <PDFView invoiceObject={invoiceObject} />;
};

export { View };
