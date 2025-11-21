// TableView.tsx
import React, { useEffect, useReducer, useState, useRef } from "react";
import { Card } from "react-bootstrap";
import stringify from "json-stable-stringify";
import { TableProps, GetStringsResponse, DisState, JSONDict, TableState, TableAction } from "./TableTypes";
import styles from "./TableView.module.scss";

const asDict = (v: string | JSONDict | undefined): JSONDict | undefined =>
  v && typeof v === "object" ? (v as JSONDict) : undefined;

function setIn(obj: JSONDict, path: string[], value: string): JSONDict {
  if (path.length === 0) return obj;
  const [key, ...rest] = path;
  const cur = obj[key];
  if (rest.length === 0) return { ...obj, [key]: value };
  const next: JSONDict = asDict(cur) ?? {};
  return { ...obj, [key]: setIn(next, rest, value) };
}

function firstRecord(o: JSONDict | null): JSONDict | undefined {
  if (!o) return;
  const ks = Object.keys(o);
  if (ks.length === 0) return;
  return asDict(o[ks[0]]);
}

function reduceMe(state: DisState, action: TableAction): DisState {
  switch (action.type) {
    case TableState.DATA_UPDATE:
      return { internalState: "SUCCES_UPLOAD", buttonState: "active", infoText: "Salvat!" };
    case TableState.INPUT_INTERACTING:
      if (state.internalState === "PENDING_UPLOAD") return state;
      return { ...state, buttonState: "active" };
    case TableState.SEND_CLICKED:
      return { internalState: "PENDING_UPLOAD", buttonState: "inactive", infoText: "In curs de salvare..." };
    case TableState.PARAM_RESET:
      return { ...state, internalState: "INIT_UPLOAD" };
    default:
      return state;
  }
}

const TableView: React.FC<TableProps> = ({ tableID }) => {
  const [theObject, setObject] = useState<JSONDict | null>(null);

  const [stateR, dispatch] = useReducer(reduceMe, {
    internalState: "UPLOAD_INIT",
    buttonState: "inactive",
    infoText: " ",
  } as DisState);

  const listPopulated = useRef(0);

  const changeInput = (event: React.FormEvent<HTMLInputElement>) => {
    const { name, value } = event.currentTarget;
    const path = name.split(",").map(s => s.trim()).filter(Boolean);
    if (!theObject) return;
    setObject(prev => (prev ? setIn(prev, path, value) : prev));
  };

  const changeFromChild = (address: string[], value: string) => {
    if (!theObject) return;
    setObject(prev => (prev ? setIn(prev, address, value) : prev));
  };

  const refreshAction = () => window.location.reload();

  useEffect(() => {
    if (theObject && listPopulated.current === 1) {
      dispatch({ type: TableState.INPUT_INTERACTING });
    } else if (theObject) {
      listPopulated.current = 1;
    }
  }, [theObject]);

  const sendToDatabase = () => {
    dispatch({ type: TableState.SEND_CLICKED });
    sendStringsList(tableID, JSON.stringify(theObject ?? {})).then((result: GetStringsResponse) => {
      if (result.resultSent) dispatch({ type: TableState.DATA_UPDATE });
    });
  };

  return (
    <div className={styles.tableContainer}>
      <h5 className="page-title px-3 text-muted">{tableID}</h5>

      <Card className="mb-3">
        <Card.Body className="p-0 pb-3">
          <table className="table mb-0">
            <TableHeader inputData={theObject} />
            <tbody>
              {theObject &&
                Object.keys(theObject).map((item, index) => (
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
        </Card.Body>
      </Card>

      <div className={styles.actionWrap}>
        <button
          onClick={sendToDatabase}
          className={stateR.buttonState === "active" ? styles.saveButton : styles.saveButtonInactive}
        >
          Save
        </button>
        <button className={styles.refreshButton} onClick={refreshAction}>
          Anulare
        </button>
      </div>

      {stateR.internalState === "PENDING_UPLOAD" ? (
        <p style={{ textAlign: "left" }}>Saving...</p>
      ) : stateR.internalState === "SUCCES_UPLOAD" ? (
        <p style={{ textAlign: "left" }}>Saved!</p>
      ) : null}
    </div>
  );
};

function TableHeader({ inputData }: { inputData: JSONDict | null }) {
  const headSource = firstRecord(inputData);
  return (
    <thead className="bg-light">
      <tr>
        <th></th>
        {headSource && Object.keys(headSource).map((k, i) => <th key={i}>{k}</th>)}
      </tr>
    </thead>
  );
}

type RowProps = {
  item: string;
  theObject: JSONDict;
  changeInput: (e: React.FormEvent<HTMLInputElement>) => void;
  generateTable: (obj: JSONDict, path: string[], cb: (addr: string[], value: string) => void) => JSX.Element;
  changeFromChild: (addr: string[], value: string) => void;
};

function TableRow({ item, theObject, changeInput, generateTable, changeFromChild }: RowProps) {
  const rowVal = theObject[item] as string | JSONDict;

  if (typeof rowVal === "string") {
    return (
      <tr>
        <th role="col" className="border-0" style={{ textAlign: "left" }}>
          {item}
        </th>
        <td>
          <input name={`${item},value`} onChange={changeInput} value={rowVal} />
        </td>
      </tr>
    );
  }

  const rowObj = rowVal as JSONDict;

  return (
    <tr>
      <th role="col" className="border-0" style={{ textAlign: "left" }}>
        {item}
      </th>
      {Object.keys(rowObj).map((innerKey, index) => {
        const cell = rowObj[innerKey];
        if (typeof cell === "object") {
          return (
            <td className="p-0" key={index}>
              {generateTable(cell as JSONDict, [item, innerKey], changeFromChild)}
            </td>
          );
        }
        return (
          <td key={index}>
            <input name={`${item},${innerKey}`} onChange={changeInput} value={String(cell)} />
          </td>
        );
      })}
    </tr>
  );
}

function generateTable(
  theObject: JSONDict,
  path: string[],
  inputHandler: (address: string[], value: string) => void
) {
  const first = firstRecord(theObject);

  return (
    <table className="table mb-0">
      <thead className="bg-light">
        <tr>
          <th></th>
          {first && Object.keys(first).map((k, i) => <th key={i}>{k}</th>)}
        </tr>
      </thead>

      <tbody>
        {Object.keys(theObject).map((k, i) => {
          const val = theObject[k];
          if (typeof val === "object") {
            return (
              <tr key={i} style={{ outline: "1px solid gray" }}>
                <th style={{ textAlign: "left" }}>{k}</th>
                <td className="p-0" colSpan={first ? Object.keys(first).length : 1}>
                  {generateTable(val as JSONDict, [...path, k], inputHandler)}
                </td>
              </tr>
            );
          }
          return (
            <tr key={i} style={{ outline: "1px solid gray" }}>
              <th style={{ textAlign: "left" }}>{k}</th>
              <td>
                <input onChange={(e) => inputHandler([...path, k], e.currentTarget.value)} value={String(val)} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TableView;
