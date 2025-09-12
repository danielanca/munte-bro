import React, { useEffect, useState } from "react";
import SummaryBox from "./SummaryBox";
import { useTranslation } from "react-i18next";
import { getAllOrders } from "../../../data/productList";
import classes from "./Summary.module.scss";
import { IsummData } from "../../interfaces/IsummData";

interface ProductType {
  id: string;
  name: string;
  itemNumber: string;
  imageProduct: string;
  price: string;
  discountedPrice: string;
  realStock: string;
  realStockCheck: string;
  fakeStock: string;
  fakeStockCheck: string;
}

interface OrderType {
  orderId: string;
  cartProducts: ProductType[];
  cartSum: number;
  city: string;
  county: string;
  deliveryAddress: string;
  deliveryName: string;
  emailAddress: string;
  firstName: string;
  invoiceID: string;
  lastName: string;
  orderNotes: string;
  paymentMethod: string;
  paymentStatus: string;
  phoneNo: string;
  shippingTax: number;
  timestamp: string;
}

const Summary: React.FC = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [summaryData, setSummaryData] = useState<IsummData[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const data = await getAllOrders();
      setOrders(data);

      const totalSales = data.reduce((acc, order) => acc + order.cartSum, 0);
      const totalOrders = data.length;
      const totalRevenue = data.reduce((acc, order) => acc + (order.cartSum - order.shippingTax), 0);

      setSummaryData([
        {
          icon: "akar-icons:shopping-bag",
          text: "Produse vandute luna asta",
          amount: totalSales.toFixed(0),
          currency: "currency",
        },
        {
          icon: "icon-park-outline:transaction-order",
          text: "Comenzile de luna aceasta",
          amount: totalOrders.toString(),
          currency: "",
        },
        {
          icon: "jam:coin",
          text: "Incasari",
          amount: totalRevenue.toFixed(2),
          currency: "currency",
        },
      ]);
    };

    fetchOrders();
  }, []);

  return (
    <section className={classes.summary}>
      <p className="subTitle">{t("summary")}</p>
      <div className={classes.summary__box}>
        {summaryData.map(item => (
          <SummaryBox key={item.text} item={item} />
        ))}
      </div>
    </section>
  );
};

export default Summary;
