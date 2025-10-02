// src/client/components/AdminArea/ShardsDesign/flux/constants.ts
export const Constants = {
  CHANGE: "CHANGE",
  TOGGLE_SIDEBAR: "TOGGLE_SIDEBAR",
} as const;

export type FluxActionType = typeof Constants[keyof typeof Constants];

export type FluxAction<P = unknown> = {
  actionType: FluxActionType;
  payload?: P;
};

export default Constants;
