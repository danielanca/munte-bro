// @ts-nocheck
import React from "react";
import styles from "../FinishOrder.module.css";
import { PropertyInput } from "./typeProps";

type Props = {
  inputObject: Record<string, PropertyInput> | PropertyInput[];
  orderNotes: string;
  onOrderNotesChange: (val: string) => void;
  orderString: any; // strings.orderFinishPage
  showInputError: boolean;
};

const FinishOrderForm: React.FC<Props> = ({
  inputObject,
  orderNotes,
  onOrderNotesChange,
  orderString,
  showInputError,
}) => {
  const fields = Array.isArray(inputObject) ? inputObject : Object.values(inputObject);

  return (
    <div className={styles.leftContainer}>
      <div>
        <h3 className={styles.topBillText}>{orderString.invoiceDetails}</h3>
      </div>

      {fields.map((item) => (
        <div key={item.labelText} className={styles.groupInput}>
          <div className={styles.inputBox}>
            <label>
              {item.labelText}
              {item.mandatoryInput && <span className={styles.alertAsterisk}>{" * "}</span>}
            </label>
            <input
              name={item.name}
              type={"text"}
              onChange={item.inputListener}
              value={item.value}
              autoComplete={item.inputOptions?.autoComplete}
              list={item.inputOptions?.list}
            />
            {item.otherStructure?.dataList?.name && (
              <datalist id={item.otherStructure.dataList.name}>
                {Object.values(item.otherStructure.dataList.list).map((opt: string, idx: number) => (
                  <option key={`${opt}-${idx}`} value={opt} />
                ))}
              </datalist>
            )}
          </div>
        </div>
      ))}

      <div className={styles.groupInput}>
        <div className={styles.inputBox}>
          <label className={styles.optionalNote}>{orderString.inputsLabels.orderMentions}</label>
          <textarea
            className={styles.textarea}
            spellCheck="false"
            rows={2}
            onChange={(e) => onOrderNotesChange(e.target.value)}
            value={orderNotes}
          />
        </div>
      </div>

      <div
        style={{ visibility: showInputError ? "visible" : "hidden" }}
        className={styles.warningOrderWrapper}
      >
        <h4 className={styles.warningOrder}>{orderString.shipping.inputError}</h4>
      </div>
    </div>
  );
};

export default FinishOrderForm;
