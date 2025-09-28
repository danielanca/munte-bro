// @ts-nocheck
import React, { useEffect, useReducer, useState, useRef } from "react";
import { getStringsList, sendStringsList } from "../../../services/emails";
import { TableProps, getType, disState, HereInterface } from "./TableTypes";
import { TableState } from "../../../data/constants";
import stringify from "json-stable-stringify";
import styles from "./TableView.module.scss";
import { CardBody } from "shards-react";

const TableView = ({ tableID }: TableProps) => {
  const [theObject, setObject] = useState<HereInterface | null>(null);

  const [stateR, dispatch] = useReducer(reduceMe, {
    internalState: "UPLOAD_INIT",
    buttonState: "inactive",
    infoText: " "
  });

  let listPopulated = useRef(0);

  const changeInput = (event: React.FormEvent<HTMLInputElement>) => {
    let { name, value } = event.currentTarget;
    let sourcePath = name.split(",");
    console.log("SourcePath", sourcePath);
    if (theObject != null) {
      setObject((theObject) => ({
        ...theObject,
        [sourcePath[0]]: { ...theObject[sourcePath[0]], [sourcePath[1]]: value }
      }));
    }
  };

  const changeFromChild = (address: any, value: string) => {
    let FAQAddress = address[0];
    let questionList = address[1];
    let questionNumber = address[2];
    let answer = address[3];
    if (theObject != null) {
      setObject((theObject) => ({
        ...theObject,
        [FAQAddress]: {
          ...theObject[FAQAddress],
          [questionList]: {
            ...theObject[FAQAddress][questionList],
            [questionNumber]: {
              ...theObject[FAQAddress][questionList][questionNumber],
              [answer]: value
            }
          }
        }
      }));
    }
  };

  const refreshAction = () => window.location.reload();

  useEffect(() => {
    const fetchStringList = async () => {
      const result = await getStringsList(tableID);
      setObject(JSON.parse(stringify(result.resultSent)));
    };

    fetchStringList();
  }, []);

  useEffect(() => {
    if (theObject != null && listPopulated.current === 1) {
      dispatch({ type: TableState.INPUT_INTERACTING });
    } else if (theObject != null) {
      listPopulated.current = 1;
    }
    console.log("TheObject here up:", theObject);
  }, [theObject]);

  const sendToDatabase = () => {
    dispatch({ type: "SEND_CLICKED" });

    sendStringsList(tableID, JSON.stringify(theObject)).then((result: getType) => {
      if (result.resultSent) dispatch({ type: TableState.DATA_UPDATE });
    });
  };

  return (
    <div className={styles.tableContainer}>
      <h5 className="page-title px-3 text-muted">{tableID}</h5>
      <CardBody className="p-0 pb-3">
        <table className="table mb-0">
          <TableHeader inputData={theObject} />
          <tbody>
            {theObject != null &&
              Object.keys(theObject).map((item: string, index: number) => (
                <TableRow
                  key={index}
                  item={item}
                  theObject={theObject}
                  changeInput={changeInput}
                  generateTable={generateTable}
                  changeFromChild={changeFromChild}
                />
              ))}
          </tbody>
        </table>
      </CardBody>
      <div className={styles.actionWrap}>
        <button
          onClick={sendToDatabase}
          className={stateR.buttonState === "active" ? styles.saveButton : styles.saveButtonInactive}
        >
          {"Save"}
        </button>
        <button className={styles.refreshButton} onClick={refreshAction}>
          {"Anulare"}
        </button>
      </div>
      {stateR.internalState === "PENDING_UPLOAD" ? (
        <p style={{ textAlign: "left" }}>{"Saving..."}</p>
      ) : stateR.internalState === "SUCCES_UPLOAD" ? (
        <p style={{ textAlign: "left" }}>{"Saved!"}</p>
      ) : (
        ""
      )}
    </div>
  );
};

function generateTable(theObject: any, [...items]: string[], Inputhandler: (address: any, value: string) => void) {
  let address: string[] = [...items];

  return (
    <tbody>
      <tr>
        <th></th>
        {theObject != null &&
          Object.keys(Object.values(theObject)[0]).map((item, index) => <th key={index}>{item}</th>)}
      </tr>
      {theObject != null &&
        Object.keys(theObject).map((item: string, index: number) => (
          <tr key={index} style={{ outline: "1px solid gray" }}>
            <th style={{ textAlign: "left" }}>{item}</th>
            {Object.keys(theObject[item]).map((itemInside, index: number) => {
              return (
                <td key={index}>
                  <input
                    name={`${item},${itemInside}`}
                    onChange={(e) => {
                      address.push(item, itemInside);
                      Inputhandler(address, e.currentTarget.value);
                    }}
                    value={theObject[item][itemInside]}
                  />
                </td>
              );
            })}
          </tr>
        ))}
    </tbody>
  );
}

function TableHeader({ inputData }: { inputData: HereInterface | null }) {
  return (
    <thead className="bg-light">
      <tr>
        <th></th>
        {inputData != null &&
          Object.keys(Object.values(inputData)[0]).map((item, index) => <th key={index}>{item}</th>)}
      </tr>
    </thead>
  );
}

function TableRow({ item, theObject, changeInput, generateTable, changeFromChild }) {
  return (
    <tr>
      <th role={"col"} className={"border-0"} style={{ textAlign: "left" }}>
        {item}
      </th>
      {Object.keys(theObject[item]).map((itemInside, index: number) => {
        if (typeof theObject[item][itemInside] === "object") {
          return (
            <td className={"p-0"} key={index}>
              {generateTable(theObject[item][itemInside], [item, itemInside], changeFromChild)}
            </td>
          );
        } else
          return (
            <td key={index}>
              <input name={`${item},${itemInside}`} onChange={changeInput} value={theObject[item][itemInside]} />
            </td>
          );
      })}
    </tr>
  );
}

function reduceMe(state: disState, action: any) {
  switch (action.type) {
    case TableState.DATA_UPDATE:
      return {
        internalState: "SUCCES_UPLOAD",
        buttonState: "active",
        infoText: "Salvat!"
      };
    case TableState.INPUT_INTERACTING:
      return { ...state, buttonState: "active" };
    case TableState.SEND_CLICKED:
      return {
        internalState: "PENDING_UPLOAD",
        buttonState: "inactive",
        infoText: "In curs de salvare..."
      };
    case TableState.PARAM_RESET:
      return { ...state, internalState: "INIT_UPLOAD" };
    default:
      throw new Error();
  }
}

export default TableView;
