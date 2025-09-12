/* eslint-disable react/jsx-key */
import React, { useState, useEffect, useMemo } from "react";
import OrderDone from "./OrderDone";
import { updateOrder } from "./../../services/emails";
import Checkboxer from "../mini/Checkboxer/Checkboxer";
import { NavHashLink } from "react-router-hash-link";
import { makeCheck } from "./../../functions/utilsFunc";
import { ErrorProps, OrderProps, ExplicitProdListProps, PropertyInput, InputProps } from "./typeProps";
import { productConstants } from "../../data/componentStrings";
import strings from "../../data/strings.json";
import { ProductsFromSessionStorage, CartInfoItemCookie } from "./../../data/constants";
import styles from "./../CartPage/FinishOrder.module.scss";
import images from "./../../data/images";
import { useOrderObject } from "./useOrderData";
import { getInputFields } from "./inputFields";
import { areInputsValid } from "./funcs";
import { payValidationCheck, handleSend, shipmentSend } from "../../utils/fetchers";
import CityInput from "./CityInput";
import CountyInput from "./CountyInput";
import { useNavigate } from "react-router-dom";

type deliveryType = "COURIER" | "EASYBOX" | "NOT_SELECTED";
type paymentType = "CARD" | "RAMBURS" | "NOT_SELECTED";
interface Suggestion {
  name: string;
}
const FinishOrder = ({ clearNotification }: OrderProps) => {
  const navigate = useNavigate();
  let { orderFinishPage: orderString } = strings;
  let itemsSessionStorage = sessionStorage.getItem(ProductsFromSessionStorage);
  let productSessionStorage = itemsSessionStorage != null ? JSON.parse(itemsSessionStorage) : null;
  let storedCart: any[] = [];
  let subtotalPrepare: number = 0;
  const [results, setResults] = useState<any>([]);
  const [choosedDelivery, setDelivery] = useState<deliveryType>("NOT_SELECTED");
  const [paymentMethod, setPaymentMethod] = useState<paymentType>("NOT_SELECTED");

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
    inputCompleted: false,
  });
  const { orderData, setorderData } = useOrderObject();

  const inputCompleted = useMemo(() => {
    return areInputsValid(orderData);
  }, [orderData]); // Recompute only if orderData changes

  const paymentSelected = useMemo(() => {
    return orderData.paymentMethod !== "";
  }, [orderData.paymentMethod]);

  const sendOrderData = () => {
    setOrderState("triggeredState");
  };

  const inputHandler = (data: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = data.target;
    setorderData((orderData: any) => ({
      ...orderData,
      [name]: value,
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
        });
      });
    } else {
      console.log("Product session storage is null");
      new Error("Product Session Storage is null");
    }
  }
  const termAcceptHandler = () => {
    setError(completionState => ({
      ...completionState,
      termsAccepted: !completionState.termsAccepted,
    }));
  };

  useEffect(() => {
    if (orderState === "finishState") {
      //window.scrollTo(0, 0);  
      localStorage.removeItem(CartInfoItemCookie);

      if (typeof clearNotification === "function") {
        clearNotification(0);
      } else {
        console.error("clearNotification is not a function");
      }  
      navigate("/thank-you");   
    }
  }, [orderState, clearNotification, navigate]);  

  useEffect(() => {
    setorderData(orderData => ({
      ...orderData,
      cartSum: subtotalPrepare,
      shippingTax: deliveryFee,
      cartProducts: JSON.stringify(explicitProductList),
    }));
  }, [subtotalPrepare]);

  useEffect(() => {
    // if (orderState === "initState") {
    //   return;
    // }
    if (orderState == "initState" || orderState == "requestState" || orderState == "errorState") {
      if (areInputsValid(orderData)) {
        setError(completionState => ({
          ...completionState,
          inputCompleted: true,
        }));
      } else {
        setError(completionState => ({
          ...completionState,
          inputCompleted: false,
        }));
      }
      if (orderData.paymentMethod !== "") {
        setError(completionState => ({
          ...completionState,
          paymentSelected: true,
        }));
      }
    }
  }, [orderState, orderData]);

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
      handleSend(orderData, setOrderState);
      shipmentSend(orderData, setorderData, setOrderState);
    }

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
    console.log("Results are:", results);
  }, [results]);
  const inputObject = getInputFields(orderData, inputHandler);

  const easyboxHandler = (easybox: Suggestion) => {
    console.log("Easybox selected:", easybox);
    setorderData({ ...orderData, lockerName: easybox.name });
  };

  const countyHandler = (county: any) => {
    console.log("County selected:", county);
    console.log("County ID selected:", county.id);
    setorderData({ ...orderData, countyID: county.id, city: county.county + " " + county.city });
  };

  useEffect(() => {
    payValidationCheck(setOrderState, updateOrder);
  }, []);

  useEffect(() => {
    // Now we use the memoized values instead of recalculating
    setError(completionState => ({
      ...completionState,
      inputCompleted: inputCompleted,
      paymentSelected: paymentSelected,
    }));

    console.log("ORDER STATE: ", orderState);
  }, [orderState, inputCompleted, paymentSelected]);

  useEffect(() => {
    console.log("ERRORS are:", completionState);
  }, [completionState]);

  return (
    <div className={styles.FinishSection}>    
        
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
                  <div className={styles.groupInput}>
                    <div className={styles.inputBox}>
                      <label>
                        {item.labelText}
                        {item.mandatoryInput && <span className={styles.alertAsterisk}>{"*"}</span>}
                      </label>
                      {item.name === "city" ? (
                        <CountyInput onCountySelect={countyHandler} />
                      ) : (
                        <input
                          name={item.name}
                          type={"large"}
                          onChange={item.inputListener}
                          value={item.value}
                          autoComplete={item.inputOptions?.autoComplete}
                          list={item.inputOptions?.list}
                        />
                      )}
                      {/* {item.otherStructure?.dataList?.name && (
                        <datalist id={item.otherStructure.dataList.name}>
                          {Object.values(item.otherStructure.dataList.list).map((item) => (
                            <option value={item} />
                          ))}
                        </datalist>
                      )} */}
                    </div>
                  </div>
                );
              })}

              <div className={styles.groupInput}>
                <div className={styles.inputBox}>
                  <label className={styles.optionalNote}>{orderString.inputsLabels.orderMentions}</label>
                  <textarea
                    className={styles.textareaparticular}
                    spellCheck='false'
                    rows={2}
                    onChange={event => {
                      setorderData(orderData => ({
                        ...orderData,
                        orderNotes: event.target.value,
                      }));
                    }}
                    value={orderData.orderNotes}
                  />
                </div>
              </div>
            </div>
            <div className={styles.rightContainer}>
              <div className={styles.rightChild}>
                <div className={styles.legendsTable}>
                  <span>{orderString.totals.product}</span>
                  <span>{orderString.totals.subTotal}</span>
                </div>
                <ul className={styles.itemUl}>
                  {storedCart.map(item => (
                    <li className={styles.itemLi}>
                      <span className={styles.productSummarizeTitle}>{productSessionStorage[item.id].title}</span>
                      <span className={styles.count}>{Number(item.itemNumber) + "x"}</span>
                      <span className={styles.price}>{Number(productSessionStorage[item.id].price)}</span>
                    </li>
                  ))}
                </ul>
                <span className={styles.subTotal}>
                  {` ${orderString.totals.subTotal}: ${orderString.totals.currency}  ` + subtotalPrepare}
                </span>
                <span className={styles.subTotal}>
                  {` ${orderString.totals.transport}: ${orderString.totals.currency} ` + deliveryFee}
                </span>
                <span className={styles.subTotal}>{" - - - - - - - - -  - - - -"}</span>
                <span className={styles.subTotal}>
                  {` ${orderString.totals.total} : ${orderString.totals.currency} ` +
                    (Number(subtotalPrepare) + Number(deliveryFee))}
                </span>
                <span className={styles.VATincluded}>{orderString.totals.TVAincluded}</span>
              </div>
              <div>
                <span className={styles.deliveryInfo}>{orderString.shipping.estimation}</span>
                <img className={styles.carShip} src={images.deliveryCar} />
              </div>
              <div>
                <div className={styles.deliveryCheckbox}>
                  <span className={styles.paymentDetails}>{orderString.shipping.paymentMethod}</span>

                  <div>
                    {/* <div className={styles.checkboxer}>
                      <Checkboxer
                        enabled={paymentMethod === "CARD"}
                        onSwitchEnabled={() => {
                          const newPaymentMethod = paymentMethod === "CARD" ? "NOT_SELECTED" : "CARD";
                          setPaymentMethod(newPaymentMethod);
                          setorderData({ ...orderData, paymentMethod: newPaymentMethod });
                        }}
                        name={orderString.shipping.deliveryMethods.courierDelivery}
                      />
                      <label className={styles.methodPaymentCheck} htmlFor='delivercheck'>
                        {"Plata Card"}
                      </label>
                    </div> */}
                    <div className={styles.checkboxer}>
                      <Checkboxer
                        enabled={paymentMethod === "RAMBURS"}
                        onSwitchEnabled={() => {
                          const newPaymentMethod = paymentMethod === "RAMBURS" ? "NOT_SELECTED" : "RAMBURS";
                          setPaymentMethod(newPaymentMethod);
                          setorderData({ ...orderData, paymentMethod: newPaymentMethod });
                        }}
                        name={orderString.shipping.deliveryMethods.courierDelivery}
                      />
                        <label className={styles.methodPaymentCheck} htmlFor='delivercheck'>
                          Ramburs / Card <span className={styles.codcard}>(Plata card disponibila la curier) 🚚</span>
                        </label>

                    </div>
                    {/* <div>
                      <input
                        type='radio'
                        name='paymentDetails'
                        value='ramburs'
                        checked={paymentMethod === "ramburs"}
                        onChange={handleOptionChange}
                      />
                      <label> Ramburs</label>
                    </div>
                    <div>
                      <input
                        type='radio'
                        name='paymentDetails'
                        value='card'
                        checked={paymentMethod === "card"}
                        onChange={handleOptionChange}
                      />
                      <label> Card</label>
                    </div> */}
                  </div>
                </div>
              </div>
              <div className={styles.filledSpacePaymentMtd}>
                {orderState === "errorState" && orderData.paymentMethod === "" && (
                  <h4 className='text-center ' style={{ color: "red" }}>
                    {orderString.shipping.paymentMethodError}
                  </h4>
                )}
              </div>
              <div>
                <div className={styles.deliveryCheckbox}>
                  <span className={styles.paymentDetails}>{"Metoda de livrare"}</span>

                  <div className={styles.checkboxer}>
                    <Checkboxer
                      enabled={choosedDelivery === "COURIER"}
                      onSwitchEnabled={() => {
                        const newDeliver = choosedDelivery === "COURIER" ? "NOT_SELECTED" : "COURIER";
                        setDelivery(newDeliver);
                        setorderData({ ...orderData, deliveryMethod: newDeliver });
                      }}
                      name={orderString.shipping.deliveryMethods.courierDelivery}
                    />
                    <label className={styles.methodPaymentCheck} htmlFor='delivercheck'>
                      {"Curier - Sameday"}
                    </label>
                  </div>
                  <div className={styles.checkboxer}>
                    <Checkboxer
                      enabled={choosedDelivery === "EASYBOX"}
                      onSwitchEnabled={() => {
                        const newDeliver = choosedDelivery === "EASYBOX" ? "NOT_SELECTED" : "EASYBOX";
                        setDelivery(newDeliver);
                        setorderData({ ...orderData, deliveryMethod: newDeliver });
                      }}
                      name={orderString.shipping.deliveryMethods.easyboxDelivery}
                    />
                    <label className={styles.methodPaymentCheck} htmlFor='delivercheck'>
                      <img
                        width={100}
                        height={50}
                        src='https://firebasestorage.googleapis.com/v0/b/diniubire-89ce0.appspot.com/o/ProductMedia%2Feasybox.svg?alt=media&token=3f1610ed-956c-4234-b45e-4429e3dace3b'
                      />
                    </label>
                  </div>
                  {choosedDelivery === "EASYBOX" && (
                    <div className={styles.groupInput}>
                      <div className={styles.inputBox}>
                        <CityInput onEasyboxSelect={easyboxHandler} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              style={{
                visibility: orderState === "errorState" && !completionState.inputCompleted ? "visible" : "hidden",
              }}
              className={styles.warningOrderWrapper}
            >
              <h4 className={styles.warningOrder} style={{ color: "red", margin: "auto", textAlign: "center" }}>
                {orderString.shipping.inputError}
              </h4>
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

                    <label htmlFor='acceptTerms' className={styles.acceptTerms}>
                      {orderString.policyAgremenet.constent.confirm}
                    </label>
                  </div>
                  <div className={styles.filledSpaceTCAlert}>
                    {orderState === "errorState" && !completionState.termsAccepted && (
                      <h4 className={styles.termConditionAlert}>{orderString.policyAgremenet.constent.error}</h4>
                    )}
                  </div>
                </div>
                <button onClick={sendOrderData} type='submit' className={styles.finishOrder}>
                  {orderState != "pendingState" ? (
                    <p>{orderString.orderItself.sendFinishOrder.nameButton}</p>
                  ) : (
                    <p>{". . ."}</p>
                  )}
                </button>
                <div>
                  {orderState == "pendingState" && (
                    <p className={styles.emailSendStyle}>{orderString.orderItself.sendFinishOrder.pendingMessage}</p>
                  )}
                </div>
                <div>                 
                    <p className={styles.orderinfoMsg}>{orderString.infomessage}</p>
                </div>
              </div>
            </div>
          </div>        
    </div>
  );
};

export default FinishOrder;
