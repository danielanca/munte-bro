import React, { useState, useEffect, useMemo } from "react";
import OrderDone from "./OrderDone1";
import { ErrorProps, OrderProps, ExplicitProdListProps } from "./typeProps";
import { productConstants } from "../../data/componentStrings";
import strings from "../../data/strings.json";
import styles from "./FinishOrder.module.css";
import images from "../../data/images1";
import { useOrderObject } from "./useOrderData";
import { getInputFields } from "./inputFields";
import { areInputsValid } from "./funcs";
import { handleSend } from "./utils/fetchers";
import { ProductsFromSessionStorage } from "../../data/constants";
import { listProducts } from "../../services/products"; // ⬅️ removed updateOrderForValidation
import { useCart } from "../context/CartProvider";

// new components
import FinishOrderHeader from "./FinishOrder/FinishOrderHeader";
import FinishOrderForm from "./FinishOrder/FinishOrderForm";
import FinishOrderSummary from "./FinishOrder/FinishOrderSummary";

const isClient = typeof window !== "undefined";

// robust parser for "29,00", "1.234,50", "29,00 lei"
const toNumberRON = (v: unknown): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const s = v.replace(/[^\d.,-]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};

const fmt = (n: number) =>
  new Intl.NumberFormat("ro-RO", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

const FinishOrder = ({ clearNotification }: OrderProps) => {
  const { orderFinishPage: orderString } = strings as any;
  const { items, clear } = useCart();

  const [catalog, setCatalog] = useState<Record<string, any> | null>(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [orderState, setOrderState] = useState<
    "initState" | "requestState" | "validRequestState" | "pendingState" | "errorState" | "triggeredState" | "finishState"
  >("initState");

  const [completionState, setError] = useState<ErrorProps>({
    paymentSelected: false,
    termsAccepted: false,
    inputCompleted: false,
  });

  const { orderData, setorderData } = useOrderObject();

  const inputCompleted = useMemo(() => areInputsValid(orderData), [orderData]);
  const paymentSelected = useMemo(() => orderData.paymentMethod !== "", [orderData.paymentMethod]);

  // ❌ BYPASS: removed payValidationCheck(...) completely

  // Load product catalog
  useEffect(() => {
    if (!isClient) return;
    const ss = sessionStorage.getItem(ProductsFromSessionStorage);
    if (ss) {
      try {
        setCatalog(JSON.parse(ss));
      } catch {
        // ignore and refetch below
      }
    }
    if (!ss) {
      (async () => {
        try {
          const fresh = await listProducts();
          sessionStorage.setItem(ProductsFromSessionStorage, JSON.stringify(fresh));
          setCatalog(fresh as any);
        } catch (e) {
          console.error("Failed to load products for checkout:", e);
        }
      })();
    }
  }, []);

  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selected = event.target.value;
    setPaymentMethod(selected);
    setorderData((prev) => ({ ...prev, paymentMethod: selected }));
  };

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setorderData((prev) => ({ ...prev, [name]: value }));
  };

  const deliveryFee = Number(productConstants.shippingFee) || 0;

  // Build cart lines from context + catalog
  const lines = useMemo(() => {
    if (!catalog) return [];
    return items.map(({ id, qty }) => {
      const p = catalog[id] || {};
      const base = toNumberRON(p.price);
      const disc = toNumberRON(p.discountedPrice);
      const unit = disc > 0 && disc < base ? disc : base;
      return {
        id,
        name: p.title ?? "Produs",
        qty: Number(qty) || 0,
        unit,
        base,
        discounted: disc > 0 && disc < base ? disc : null,
        image: Array.isArray(p.imageProduct) ? p.imageProduct[0] : "",
      };
    });
  }, [items, catalog]);

  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.unit * (l.qty || 0), 0), [lines]);

  const explicitProductList: ExplicitProdListProps[] = useMemo(
    () =>
      lines.map((l) => ({
        id: l.id,
        name: l.name,
        itemNumber: String(l.qty),
        imageProduct: l.image,
        price: String(l.base),
        discountedPrice: l.discounted ? String(l.discounted) : "",
        realStock: "",
        realStockCheck: "",
        fakeStock: "",
        fakeStockCheck: "",
      })),
    [lines]
  );

  useEffect(() => {
    setorderData((prev) => ({
      ...prev,
      cartSum: subtotal,
      shippingTax: deliveryFee,
      cartProducts: JSON.stringify(explicitProductList),
    }));
  }, [subtotal, deliveryFee, explicitProductList, setorderData]);

  useEffect(() => {
    setError((prev) => ({
      ...prev,
      inputCompleted,
      paymentSelected,
    }));
  }, [inputCompleted, paymentSelected]);

  const termAcceptHandler = () => setError((prev) => ({ ...prev, termsAccepted: !prev.termsAccepted }));

  const sendOrderData = () => setOrderState("triggeredState");

  // 🚫 BYPASS VALIDATION: go straight to validRequestState
  useEffect(() => {
    if (orderState === "triggeredState") {
      setOrderState("validRequestState"); // skip all front-end checks
    }
    if (orderState === "validRequestState") {
      setOrderState("pendingState");

      // Ensure we don't try to do card flow if user didn't select a method
      const safeOrder = {
        ...orderData,
        paymentMethod: orderData.paymentMethod || "cash",
      } as typeof orderData;

      handleSend(safeOrder, setOrderState);
    }

    if (orderState === "finishState") {
      window.scrollTo(0, 0);
      clear();
      if (typeof clearNotification === "function") {
        clearNotification(Math.floor(Math.random() * 120));
      } else {
        console.warn("clearNotification is not a function");
      }
    }
  }, [orderState]); // eslint-disable-line

  const inputObject = getInputFields(orderData, inputHandler);

  if (!catalog) {
    return (
      <div className={styles.finishSection}>
        <FinishOrderHeader
          title={orderString.finishGuide}
          infoText={"Se încarcă datele produselor…"}
          imageSrc={images.finishOrder}
          imageAlt="Loading"
        />
      </div>
    );
  }

  return (
    <div className={styles.finishSection}>
      {orderState !== "finishState" ? (
        <>
          <FinishOrderHeader
            title={orderString.finishGuide}
            infoText={orderString.deliveringInfor}
            imageSrc={images.finishOrder}
          />

          <div className={styles.finishOrderContainer}>
            <FinishOrderForm
              inputObject={inputObject}
              orderNotes={orderData.orderNotes ?? ""}
              onOrderNotesChange={(val) => setorderData((prev) => ({ ...prev, orderNotes: val }))}
              orderString={orderString}
              showInputError={false} // bypass
            />

            <FinishOrderSummary
              lines={lines}
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              currency={orderString.totals.currency}
              orderString={orderString}
              paymentMethod={paymentMethod}
              onPaymentChange={handleOptionChange}
              showPaymentError={false} // bypass
              showTermsError={false}   // bypass
              onToggleTerms={termAcceptHandler}
              onSubmit={sendOrderData}
              orderState={orderState}
              fmt={fmt}
            />
          </div>
        </>
      ) : (
        <OrderDone />
      )}
    </div>
  );
};

export default FinishOrder;
