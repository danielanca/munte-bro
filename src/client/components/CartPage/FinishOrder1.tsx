// @ts-nocheck
import React, { useState, useEffect, useMemo } from "react";
import OrderDone from "./OrderDone1";
import { sendOrderConfirmation, updateOrder } from "../../services/emails";
import Checkboxer from "../MiniComponents/Checkboxer";
import { NavHashLink } from "react-router-hash-link";
import { makeCheck } from "../../functions/utilsFunc";
import { ErrorProps, OrderProps, ExplicitProdListProps, PropertyInput, InputProps } from "./typeProps";
import { productConstants } from "../../data/componentStrings";
import strings from "../../data/strings.json";
import { ProductsFromSessionStorage, CartInfoItemCookie } from "../../data/constants";
import styles from "./../CartPage/FinishOrder1.module.scss";
import images from "../../data/images1";
import { useOrderObject } from "./useOrderData";
import { getInputFields } from "./inputFields";
import { areInputsValid } from "./funcs";
import { payValidationCheck, handleSend } from './utils/fetchers';

const FinishOrder = ({ clearNotification }: OrderProps) => {
  let { orderFinishPage: orderString } = strings;
  let itemsSessionStorage = sessionStorage.getItem(ProductsFromSessionStorage);
  let productSessionStorage = itemsSessionStorage != null ? JSON.parse(itemsSessionStorage) : null;
  let storedCart: any[] = [];
  let subtotalPrepare: number = 0;


  const [paymentMethod, setPaymentMethod] = useState("");
  const [isPaymentSuccessful, setPaymentSuccessful] = useState(false);

  const handleOptionChange = (event) => {
    const selectedPaymentMethod = event.target.value;
    setPaymentMethod(selectedPaymentMethod);
    setorderData({ ...orderData, paymentMethod: selectedPaymentMethod });
  };

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

  const inputCompleted = useMemo(() => {
    return areInputsValid(orderData);
  }, [orderData]); // Recompute only if orderData changes

  const paymentSelected = useMemo(() => {
    return orderData.paymentMethod !== "";
  }, [orderData.paymentMethod]); // Recompute only if the paymentMethod changes


  // const handleSend = async () => {
  //   try {
  //     const HandleSendResponse = await sendOrderConfirmation(orderData);
  //     const HandleSendJsonResponse = await HandleSendResponse.json();
  //     console.log("Handle Send Response:", HandleSendJsonResponse);
  //     const orderID = await HandleSendJsonResponse.orderID;
  //     const apiBT = "https://ecclients.btrl.ro:5443/payment/rest/registerPreAuth.do";
  //     const currentDate = new Date().toISOString();
  //     const shippingTax = orderData.shippingTax ? orderData.shippingTax : 0;
  //     const totalSum = orderData.cartSum + shippingTax;
  //     const decimalPhoneNumber = parseInt(orderData.phoneNo, 10).toString();
  //     const body = `userName=test_iPay9_api&password=test_iPay9_ap!t5r&orderNumber=${orderID}&amount=${totalSum}&currency=946&description=testBT&returnUrl=http://localhost:3000/finalizare-comanda&orderBundle={"orderCreationDate":"${currentDate}","customerDetails":{"email":"${orderData.emailAddress}","phone":${decimalPhoneNumber},"deliveryInfo":{"deliveryType":"comanda","country":"642","city":"${orderData.city}","postAddress":"${orderData.deliveryAddress}","postalCode":"12345"},"billingInfo":{"deliveryType":"comanda","country":"642","city":"${orderData.city}","postAddress":"${orderData.deliveryAddress}","postalCode":"12345"}}}`;

  //     const response = await fetch(apiBT, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/x-www-form-urlencoded"
  //       },
  //       body: body
  //     });

  //     if (response.ok) {
  //       // setOrderState("finishState");
  //       const jsonResponse = await response.json();
  //       console.log(jsonResponse);
  //       const returnUrl = jsonResponse.formUrl;
  //       console.log(returnUrl);
  //       if (orderData.paymentMethod == "card") window.location.replace(returnUrl);
  //     } else {
  //       console.error("Error sending order data to the API:", response.statusText);
  //       setOrderState("errorState");
  //     }
  //   } catch (error) {
  //     console.error("Unexpected error:", error);
  //     setOrderState("errorState");
  //   }
  // };

  const sendOrderData = () => {
    setOrderState("triggeredState");
  };


  useEffect(() => {
    payValidationCheck(setOrderState, updateOrder);
  }, []);
  

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
          price: productSessionStorage[item.id].price,
          discountedPrice: "",
          realStock: "",
          realStockCheck: "",
          fakeStock: "",
          fakeStockCheck: ""
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
    setorderData((orderData) => ({
      ...orderData,
      cartSum: subtotalPrepare,
      shippingTax: deliveryFee,
      cartProducts: JSON.stringify(explicitProductList)
    }));
  }, [subtotalPrepare]);

  useEffect(() => {
    // Now we use the memoized values instead of recalculating
    setError((completionState) => ({
      ...completionState,
      inputCompleted: inputCompleted,
      paymentSelected: paymentSelected,
    }));

    console.log("ORDER STATE: ", orderState);
  }, [orderState, inputCompleted, paymentSelected]); 


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
      setOrderState("pendingState");
      handleSend(orderData,setOrderState);
    }
    console.log("ORDER STATE: ", orderState);


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

  const inputObject = getInputFields(orderData, inputHandler);

  return (
    <div className={styles.FinishSection}>
      {orderState !== "finishState" ? (
        <>
          <div className={styles.topTitle}>
            <div className={styles.cartLine} />
            <h3 className={styles.finishOrderTitle}>{orderString.finishGuide}</h3>
            <div className={styles.cartLine} />
          </div>
          <div className={styles.infoBoxing}>
            <img src={images.finishOrder} />
            <h3>{orderString.deliveringInfor}</h3>
          </div>
          <div className={styles.finishOrderContainer}>
            <div className={styles.leftContainer}>
              <div>
                <h3 className={styles.topBillText}>{orderString.invoiceDetails}</h3>
              </div>
              {Object.values(inputObject).map((item: PropertyInput) => {
                return (
                  <div key={item.labelText} className={styles.groupInput}>
                    <div className={styles.inputBox}>
                      <label>
                        {item.labelText}
                        {item.mandatoryInput && <span className={styles.alertAsterisk}>{" * "}</span>}
                      </label>
                      <input
                        name={item.name}
                        type={"large"}
                        onChange={item.inputListener}
                        value={item.value}
                        autoComplete={item.inputOptions?.autoComplete}
                        list={item.inputOptions?.list}
                      />
                      {item.otherStructure?.dataList?.name && (
                        <datalist id={item.otherStructure.dataList.name}>
                          {Object.values(item.otherStructure.dataList.list).map((item:string, index:number) => (
                            <option key={`${item}-${index}`} value={item} />
                          ))}
                        </datalist>
                      )}
                    </div>
                  </div>
                );
              })}

              <div className={styles.groupInput}>
                <div className={styles.inputBox}>
                  <label className={styles.optionalNote}>{orderString.inputsLabels.orderMentions}</label>
                  <textarea
                    className={styles.textareaparticular}
                    spellCheck="false"
                    rows={2}
                    onChange={(event) => {
                      setorderData((orderData) => ({ ...orderData, orderNotes: event.target.value }));
                    }}
                    value={orderData.orderNotes}
                  />
                </div>
              </div>
              <div
                style={{
                  visibility: orderState === "errorState" && !completionState.inputCompleted ? "visible" : "hidden"
                }}
                className={styles.warningOrderWrapper}
              >
                <h4 className={styles.warningOrder} style={{ color: "red", margin: "auto", textAlign: "center" }}>
                  {orderString.shipping.inputError}
                </h4>
              </div>
            </div>
            <div className={styles.rightContainer}>
              <div className={styles.rightChild}>
                <div className={styles.legendsTable}>
                  <span>Comanda</span>
                </div>
                <ul className={styles.itemUl}>
                  {storedCart.map((item) => (
                    <li className={styles.itemLi}>
                      <span className={styles.productSummarizeTitle}>{productSessionStorage[item.id].title} </span>
                      <span className={styles.count}>{"x" + Number(item.itemNumber)}</span>
                      <span className={styles.price}>{Number(productSessionStorage[item.id].price) + "lei"}</span>
                    </li>
                  ))}
                </ul>
                <div className={styles.costs}>
                  <span className={styles.subTotal}>{` ${orderString.totals.subTotal}: `}</span>
                  <span className={styles.subTotal}>{subtotalPrepare + " " + `${orderString.totals.currency}`}</span>
                </div>
                <div className={styles.costs}>
                  <span className={styles.subTotal}>{` ${orderString.totals.transport}:`}</span>
                  <span className={styles.subTotal}>{deliveryFee + " " + `${orderString.totals.currency}`}</span>
                </div>
                <div className={styles.costs}>
                  <span className={styles.subTotal}>{` ${orderString.totals.total} :`}</span>
                  <span className={styles.subTotal}>
                    {Number(subtotalPrepare) + Number(deliveryFee) + " " + `${orderString.totals.currency}`}
                  </span>
                </div>

                {/* <span className={styles.VATincluded}>{orderString.totals.TVAincluded}</span> */}
              </div>
              <div>
                {/* <span className={styles.deliveryInfo}>{orderString.shipping.estimation}</span>
                <img className={styles.carShip} src={images.deliveryCar} /> */}
              </div>
              <div>
                <div className={styles.deliveryCheckbox}>
                  <span className={styles.paymentDetails}>{orderString.shipping.paymentMethod}</span>

                  <div className={styles.checkboxer}>
                    <div>
                      <input
                        type="radio"
                        name="paymentDetails"
                        value="ramburs"
                        checked={paymentMethod === "ramburs"}
                        onChange={handleOptionChange}
                      />
                      <label> Ramburs</label>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="paymentDetails"
                        value="card"
                        checked={paymentMethod === "card"}
                        onChange={handleOptionChange}
                      />
                      <label> Card</label>
                    </div>
                  </div>
                </div>
              </div>
              <div className={styles.filledSpacePaymentMtd}>
                {orderState === "errorState" && orderData.paymentMethod === "" && (
                  <h4 className="text-center " style={{ color: "red", fontSize: "16px" }}>
                    {orderString.shipping.paymentMethodError}
                  </h4>
                )}
              </div>

              <div className={styles.paymentShipContainer}>
                <div className={styles.paymentContainer}>
                  <p className={styles.GDPRNotify}>
                    {orderString.policyAgreementOrder}
                    <NavHashLink replace to={orderString.policyAgremenet.link}>
                      <a className={styles.extensiveGdpr}>{orderString.policyAgremenet.name}</a>
                    </NavHashLink>
                  </p>

                  <div className={styles.groupInputTerms}>
                    <div className={styles.checkBoxStyle}>
                      <Checkboxer onSwitchEnabled={termAcceptHandler} />

                      <label htmlFor="acceptTerms" className={styles.acceptTerms}>
                        {orderString.policyAgremenet.constent.confirm}
                      </label>
                    </div>
                    <div className={styles.filledSpaceTCAlert}>
                      {orderState === "errorState" && !completionState.termsAccepted && (
                        <h4 className={styles.termConditionAlert}>{orderString.policyAgremenet.constent.error}</h4>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.btnBlue}>
                <button onClick={sendOrderData} type="submit"
                style={{
                  backgroundColor: orderState === 'pendingState' ? '#f7ca18' : '',
                  color: orderState === "pendingState" ? 'black': ''
                }}>
                   {orderState === 'pendingState' ? 'Se incarca...' : 'Catre plata'}
                </button>
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
