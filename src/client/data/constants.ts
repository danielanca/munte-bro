export const CartInfoItemCookie: string = "cartData";
export const ProductsFromSessionStorage: string = "productsFetched";
export const CookiesTagConsent = "cookieConsentBrasov";
export const userAcceptedCookies = "userAccepted";

//Newsletter Component

export const inputStateEmail = {
  valid: "valid",
  notValid: "notValid",
  init: "init"
};
export type emailValidType =
  | typeof inputStateEmail.init
  | typeof inputStateEmail.notValid
  | typeof inputStateEmail.valid;

//Newsletter Subscrption state

export const Sub = { initState: "INIT", SubscribedState: "SUBSCRIBED", ErrorState: "ERROR" };

export type SubscriptionType = typeof Sub.initState | typeof Sub.SubscribedState | typeof Sub.ErrorState;

export const TableState = {
  DATA_UPDATE: "DATA_UPDATED",
  INPUT_INTERACTING: "INPUT_INTERACTING",
  SEND_CLICKED: "SEND_CLICKED",
  PARAM_RESET: "RESET_PARAMS"
};
