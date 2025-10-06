// @ts-nocheck
import React from "react";
import { NavHashLink } from "react-router-hash-link";
import Checkboxer from "../../MiniComponents/Checkboxer";
import styles from "../FinishOrder.module.css";

type Line = { id: string; name: string; qty: number; unit: number };

type Props = {
  lines: Line[];
  subtotal: number;
  deliveryFee: number;
  currency: string;
  orderString: any; // strings.orderFinishPage
  paymentMethod: string;
  onPaymentChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  showPaymentError: boolean;
  showTermsError: boolean;
  onToggleTerms: () => void;
  onSubmit: () => void;
  orderState:
    | "initState"
    | "requestState"
    | "validRequestState"
    | "pendingState"
    | "errorState"
    | "triggeredState"
    | "finishState";
  fmt: (n: number) => string;
};

const FinishOrderSummary: React.FC<Props> = ({
  lines,
  subtotal,
  deliveryFee,
  currency,
  orderString,
  paymentMethod,
  onPaymentChange,
  showPaymentError,
  showTermsError,
  onToggleTerms,
  onSubmit,
  orderState,
  fmt,
}) => {
  return (
    <div className={styles.rightContainer}>
      <div className={styles.rightChild}>
        <div className={styles.legendsTable}>
          <span>Comanda</span>
        </div>

        <ul className={styles.itemList}>
          {lines.map((l) => (
            <li key={l.id} className={styles.item}>
              <span className={styles.productTitle}>{l.name}</span>
              <span className={styles.count}>{"x" + l.qty}</span>
              <span className={styles.price}>{`${fmt(l.unit)} lei`}</span>
            </li>
          ))}
        </ul>

        <div className={styles.costs}>
          <span className={styles.subTotal}>{` ${orderString.totals.subTotal}: `}</span>
          <span className={styles.subTotal}>{`${fmt(subtotal)} ${currency}`}</span>
        </div>

        <div className={styles.costs}>
          <span className={styles.subTotal}>{` ${orderString.totals.transport}:`}</span>
          <span className={styles.subTotal}>{`${fmt(deliveryFee)} ${currency}`}</span>
        </div>

        <div className={styles.costs}>
          <span className={styles.subTotal}>{` ${orderString.totals.total} :`}</span>
          <span className={styles.subTotal}>{`${fmt(subtotal + deliveryFee)} ${currency}`}</span>
        </div>
      </div>

      {/* Payment method */}
      <div className={styles.deliveryCheckbox}>
        <span className={styles.paymentDetails}>{orderString.shipping.paymentMethod}</span>
        <div className={styles.radioGroup}>
          <div className={styles.radioOption}>
            <input
              type="radio"
              id="ramburs"
              name="paymentDetails"
              value="ramburs"
              checked={paymentMethod === "ramburs"}
              onChange={onPaymentChange}
            />
            <label htmlFor="ramburs">Ramburs</label>
          </div>
          <div className={styles.radioOption}>
            <input
              type="radio"
              id="card"
              name="paymentDetails"
              value="card"
              checked={paymentMethod === "card"}
              onChange={onPaymentChange}
            />
            <label htmlFor="card">Card</label>
          </div>
        </div>
      </div>

      <div className={styles.paymentError}>
        {showPaymentError && (
          <h4 className={styles.paymentErrorText}>{orderString.shipping.paymentMethodError}</h4>
        )}
      </div>

      {/* GDPR / Terms */}
      <div className={styles.termsContainer}>
        <div className={styles.paymentContainer}>
          <p className={styles.gdprText}>
            {orderString.policyAgreementOrder}
            <NavHashLink replace to={orderString.policyAgremenet.link}>
              <a className={styles.gdprLink}>{orderString.policyAgremenet.name}</a>
            </NavHashLink>
          </p>

          <div className={styles.termsInput}>
            <div className={styles.checkboxContainer}>
              <Checkboxer onSwitchEnabled={onToggleTerms} />
              <label htmlFor="acceptTerms" className={styles.acceptTerms}>
                {orderString.policyAgremenet.constent.confirm}
              </label>
            </div>
            <div className={styles.termsError}>
              {showTermsError && (
                <h4 className={styles.termsErrorText}>{orderString.policyAgremenet.constent.error}</h4>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className={styles.submitButton}>
 <button
  onClick={() => { if (orderState !== "pendingState") onSubmit(); }}
  type="button"
  className={orderState === "pendingState" ? styles.loading : ""}
  disabled={orderState === "pendingState" || lines.length === 0}
  aria-busy={orderState === "pendingState"}
>
  {orderState === "pendingState" ? "Se încarcă..." : "Către plată"}
</button>

</div>
    </div>
  );
};

export default FinishOrderSummary;
