/* eslint-disable react/jsx-key */
// @ts-nocheck

import { useParams } from "react-router-dom";

import styles from "./OrderView.module.scss";
import { getOrderByID } from "./../../data/productList";
import React, { useEffect, useState } from "react";
import { componentStrings } from "./../../data/componentStrings";
import { View } from "./pdfview";
import { PDF } from "./pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { OrderViewProps } from "../../utils/OrderInterfaces";

type invoiceInterface = {
  invoiceObject: OrderViewProps;
};

interface OrderInterface {
  lastName?: string;
  firstName?: string;
  phoneNo?: string;
  deliveryAddress?: string;
  emailAddress?: string;
  city?: string;
  county?: string;
  paymentMethod?: string;
  cartProducts?: string;
  shippingTax?: number;
  cartSum?: number;
  orderNotes?: string;
  deliveryName?: string;
  timestamp?: string;
  invoiceID?: string;
}

export interface ExplicitProdListProps {
  id: string;
  name: string;
  itemNumber: string;
  imageProduct: string;
  price: string;
}
type PDFLinkRenderProps = {
  blob: any;
  url: string | null;
  loading: boolean;
  error: Error | null;
};

const OrderView = () => {
  let params = useParams();
  let orderID = params.orderID;
  const [invoiceData, setInvoiceData] = useState<OrderViewProps | null>();

  useEffect(() => {
    if (!isNaN(Number(orderID))) {
      getOrderByID(Number(orderID))
        .then(response => {
          setInvoiceData(response);
        })
        .catch(error => error);
    }
  }, []);

  const DownloadLinkPDF = ({ invoiceObject }: invoiceInterface) => {
    return (
      <PDFDownloadLink document={<PDF invoiceObject={invoiceObject} />}>
        {({ url, loading, error }) => {
          console.log("URL is", url, error);
          if (error) {
            return "Error in loading PDF";
          }
          if (loading) {
            return "Incarcare link...";
          }
          if (url) {
            return (
              <a href={url} download={`Factura-${invoiceObject.invoiceID}.pdf`}>
                Descarca Factura
              </a>
            );
          } else {
            return <p>Link eronat factura.</p>;
          }
        }}
      </PDFDownloadLink>
    );
  };

  return (
    <div className={styles.centerPdf}>
      <div>
        <h3 className={styles.text}>{invoiceData != null ? <DownloadLinkPDF invoiceObject={invoiceData} /> : ""}</h3>
      </div>

      {invoiceData != null ? <View invoiceObject={invoiceData} /> : "Eroare"}
    </div>
  );
};

export default OrderView;
