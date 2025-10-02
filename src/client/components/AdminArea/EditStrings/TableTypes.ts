// TableTypes.ts
export type JSONDict = { [k: string]: string | JSONDict };
export type HereInterface = JSONDict; // ✅ add this

export type GetStringsResponse = { resultSent: unknown };
export type getType = GetStringsResponse;

export type DisState =
  | { internalState: "UPLOAD_INIT"; buttonState: "active" | "inactive"; infoText: string }
  | { internalState: "PENDING_UPLOAD"; buttonState: "inactive"; infoText: string }
  | { internalState: "SUCCES_UPLOAD"; buttonState: "active"; infoText: string }
  | { internalState: "INIT_UPLOAD"; buttonState: "active" | "inactive"; infoText: string };

export interface TableProps { tableID: string }

export const TableState = {
  DATA_UPDATE: "DATA_UPDATED",
  INPUT_INTERACTING: "INPUT_INTERACTING",
  SEND_CLICKED: "SEND_CLICKED",
  PARAM_RESET: "RESET_PARAMS",
} as const;

export type TableAction =
  | { type: typeof TableState.DATA_UPDATE }
  | { type: typeof TableState.INPUT_INTERACTING }
  | { type: typeof TableState.SEND_CLICKED }
  | { type: typeof TableState.PARAM_RESET };
