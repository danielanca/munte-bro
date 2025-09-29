import React, { useState, useEffect } from "react";
import OrderDone from "./OrderDone1";
import { sendOrderConfirmation } from "./../../services/emails";
import { MdOutlineLocalOffer } from "react-icons/md";

import { makeCheck } from "./../../functions/utilsFunc";
import { ErrorProps, OrderProps, ExplicitProdListProps, PropertyInput, InputProps } from "./typeProps";

import { productConstants } from "../../data/componentStrings";
import strings from "../../data/strings.json";
import { ProductsFromSessionStorage, CartInfoItemCookie } from "../../data/constants";
import styles from "./../CartPage/FinishOrderNew.module.scss";
import { useOrderObject } from "./useOrderData";
import { getInputFields } from "./inputFields";
import { areInputsValid } from "./funcs";

const FinishOrder = ({ clearNotification }: OrderProps,) => {
  // console.log("abccccc" + cuponDiscount);
  // console.warn(cuponDiscount);
  // console.info(cuponDiscount);

  let { orderFinishPage: orderString } = strings;
  let itemsSessionStorage = sessionStorage.getItem(ProductsFromSessionStorage);
  let productSessionStorage = itemsSessionStorage != null ? JSON.parse(itemsSessionStorage) : null;
  let storedCart: any[] = [];
  let subtotalPrepare: number = 0;

  const [orderState, setOrderState] = useState<
    | "initState"
    | "requestState"
    | "validRequestState"
    | "pendingState"
    | "errorState"
    | "triggeredState"
    | "finishState"
  >("initState");

  const [completionState, setError] = useState<ErrorProps>({
    paymentSelected: false,
    termsAccepted: false,
    inputCompleted: false
  });
  const { orderData, setorderData } = useOrderObject();

  const handleSend = async () => {
    try {
      return await sendOrderConfirmation(orderData)
        .then((response) => {
          response.json().then((jsonResponse: any) => {
            // console.log("Whole Object:", jsonResponse);
            // console.log("Is Email to Client sent? : ", jsonResponse.EMAILTO_CLIENT);
            // console.log("Is Email to Admin sent? : ", jsonResponse.EMAILTO_ADMIN);
          });

          setOrderState("finishState");
        })
        .catch((error) => console.log(error));
    } catch (error) {
      console.log(error);
    }
  };
  const sendOrderData = () => {
    setOrderState("triggeredState");
  };

  const paymentMethodHandler = (value: boolean, title: string | undefined) => {
    if (value) {
      setorderData((orderData) => ({
        ...orderData,
        paymentMethod: typeof title === "string" ? title : "NOT_SPECIFIED"
      }));
    } else {
      setorderData((orderData) => ({ ...orderData, paymentMethod: "" }));
    }
  };

  const inputHandler = (data: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = data.target;
    setorderData((orderData) => ({
      ...orderData,
      [name]: value
    }));
  };

  let deliveryFee = productConstants.shippingFee;
  let expectedData = localStorage.getItem(CartInfoItemCookie);
  let explicitProductList: ExplicitProdListProps[] = [];

  if (expectedData != null) {
    storedCart = JSON.parse(expectedData);
    if (productSessionStorage !== null) {
      storedCart = makeCheck(productSessionStorage, storedCart);
      storedCart.map((item: ExplicitProdListProps) => {
        subtotalPrepare += Number(productSessionStorage[item.id].price) * Number(item.itemNumber);
        explicitProductList.push({
          id: item.id,
          name: productSessionStorage[item.id].title,
          itemNumber: item.itemNumber,
          imageProduct: productSessionStorage[item.id].imageProduct[0],
          price: productSessionStorage[item.id].price
        });
      });
    } else {
      console.log("Product session storage is null");
      new Error("Product Session Storage is null");
    }
  }
  const termAcceptHandler = () => {
    setError((completionState) => ({ ...completionState, termsAccepted: !completionState.termsAccepted }));
  };

  useEffect(() => {
    if (orderState == "finishState") {
      window.scrollTo(0, 0);
      localStorage.removeItem(CartInfoItemCookie);

      if (typeof clearNotification === "function") {
        clearNotification(Math.floor(Math.random() * 120));
      } else {
        new Error("clearNotification is not a function");
      }
    }
  }, [orderState]);
  useEffect(() => {
    setorderData((orderData) => ({
      ...orderData,
      cartSum: subtotalPrepare,
      shippingTax: deliveryFee,
      cartProducts: JSON.stringify(explicitProductList)
    }));
  }, [subtotalPrepare]);

  useEffect(() => {
    // if (orderState === "initState") {
    //   return;
    // }
    if (orderState == "initState" || orderState == "requestState" || orderState == "errorState") {
      if (areInputsValid(orderData)) {
        setError((completionState) => ({ ...completionState, inputCompleted: true }));
      } else {
        setError((completionState) => ({ ...completionState, inputCompleted: false }));
      }
      if (orderData.paymentMethod !== "") {
        setError((completionState) => ({ ...completionState, paymentSelected: true }));
      }
    }

    console.log("ORDER STATE: ", orderState);
  }, [orderState, orderData]);

  useEffect(() => {
    console.log("ERRORS are:", completionState);
  }, [completionState]);

  useEffect(() => {
    if (orderState === "triggeredState") {
      if (completionState.inputCompleted && completionState.paymentSelected && completionState.termsAccepted) {
        setOrderState("validRequestState");
      } else {
        setOrderState("errorState");
      }
    }
    if (orderState === "validRequestState") {
      //this will be next-time
      setOrderState("pendingState");
      handleSend();
    }

    console.log("ORDER STATE: ", orderState);
  }, [orderState]);

  const inputObject = getInputFields(orderData, inputHandler);

  return (
    <div className={styles.FinishSection}>
      {orderState !== "finishState" ? (
        <>
          <div className={styles.finishOrderContainer}>
            <div className={styles.emptyContainer}></div>
            <div className={styles.leftContainer}>
              <div>
                <h3 className={styles.topBillText}>{orderString.invoiceDetails}</h3>
              </div>
              {Object.values(inputObject).map((item: PropertyInput) => {
                return (
                  <div className={styles.groupInput}>
                    <div className={styles.inputBox}>
                      <span className={styles.inputLabel}>
                        <label>
                          {item.labelText}
                          {item.mandatoryInput && <span className={styles.alertAsterisk}>{"*"}</span>}
                        </label>
                      </span>
                      <input
                        className={styles.inputForm}
                        name={item.name}
                        type={"large"}
                        onChange={item.inputListener}
                        value={item.value}
                        autoComplete={item.inputOptions?.autoComplete}
                        list={item.inputOptions?.list}
                      />
                      {item.otherStructure?.dataList?.name && (
                        <datalist id={item.otherStructure.dataList.name}>
                          {Object.values(item.otherStructure.dataList.list).map((item) => (
                            <option value={item} />
                          ))}
                        </datalist>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.rightContainer}>
              <div className={styles.rightChild}>
                <div>
                  <h1 className={styles.comandaTitle}>Comanda</h1>
                </div>

                <div className={styles.subTotalContainer}>
                  <span className={styles.subTotal}>{` ${orderString.totals.subTotal} `}</span>

                  <span className={styles.subTotal}>{subtotalPrepare + ` ${orderString.totals.currency}  `}</span>
                </div>

                <div className={styles.subTotalContainer}>
                  <span className={styles.subTotal}>Discount</span>

                  <span className={styles.subTotal}>{0.0 + ` ${orderString.totals.currency}  `}</span>
                </div>

                <div className={styles.subTotalContainer}>
                  <span className={styles.subTotal}>{` ${orderString.totals.transport} `}</span>

                  <span className={styles.subTotal}>{deliveryFee + ` ${orderString.totals.currency}  `}</span>
                </div>

                <div className={styles.subTotalContainer}>
                  <span className={styles.subTotal}>Cupon Reducere</span>

                  <span className={styles.subTotal}>{0.0 + ` ${orderString.totals.currency}  `}</span>
                </div>
                <div className={styles.totalPriceTopBorderContainer}>
                  <hr className={styles.totalPriceTopBorder} />
                </div>

                <div className={styles.subTotalContainer}>
                  <span className={styles.subTotalTotal}>{` ${orderString.totals.total} `}</span>
                  <span className={styles.subTotalTotalPrice}>
                    {Number(subtotalPrepare) + Number(deliveryFee) + ` ${orderString.totals.currency} `}
                  </span>
                </div>

                <div className={styles.subTotalContainer}>
                  <span className={styles.EstimareExpediereText}>Estimare Expediere</span>
                  <span className={styles.cuponTime}>01 Feb, 2023</span>
                </div>

                <div className={styles.cuponInputFormContainer}>
                  <input placeholder={"Cupon Reducere"} className={styles.cuponInputForm} type={"large"} />
                  <MdOutlineLocalOffer style={{ fontSize: "25px" }} className={styles.cuponIconForInput} />
                </div>

                <div>
                  <button onClick={sendOrderData} type="submit" className={styles.finishOrder}>
                    {orderState != "pendingState" ? (
                      <span>{orderString.orderItself.sendFinishOrder.nameButton}</span>
                    ) : (
                      <span>{". . ."}</span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <OrderDone />
      )}
    </div>
  );
};

export default FinishOrder;
