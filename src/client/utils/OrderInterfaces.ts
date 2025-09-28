/* eslint-disable no-undef */

// ----------------------------------
// Helpers / common types
// ----------------------------------
export interface DayTime {
  day: number;
  month: number;
  year: number;
}

// Narrow-but-flexible payment status
export type PaymentStatus = "PAID" | "UNPAID" | (string & {});

// ----------------------------------
// Cart / Local Storage
// ----------------------------------
export interface LocalStorPropsCart {
  name: string;
  itemNumber: string; // keep as string (matches cookie/storage format)
  price: string;
  currency: string;

  discountedPrice?: string;
  realStock?: string;
  realStockCheck?: string;
  fakeStock?: string;
  fakeStockCheck?: string;
}

/** Cart item stored in localStorage */
export interface CartCookieItem {
  id: string;
  itemNumber: string; // string in storage; parse to number when needed
}

// Props passed into product/cart views
export interface CartProps {
  notifyMe: React.Dispatch<React.SetStateAction<number>>;
  productQuantity: number;
}

// ----------------------------------
// Orders
// ----------------------------------
export interface orderProps {
  firstName: string;
  lastName: string;
  deliveryAddress: string;
  city: string;
  phoneNo: string;

  emailAddress?: string;
  orderNotes?: string;
  cartProducts: string;
  cartSum: number;
  shippingTax?: number;
  paymentMethod: string;
  deliveryName?: string;
  paymentStatus?: string;

  // Present in first file only
  deliveryMethod?: string;
  lockerName?: string;
  awb?: string;

  // County fields differ between files; support both
  county?: string;   // added (second file)
  countyID?: string; // original (first file)
}

export interface OrderModel {
  invoiceID: string;
  paymentStatus: PaymentStatus;
}

export interface OrderViewProps {
  lastName?: string;
  firstName?: string;
  phoneNo?: string;
  deliveryAddress?: string;
  emailAddress?: string;
  city?: string;
  county?: string;
  paymentMethod?: string;
  cartProducts?: string;
  shippingTax?: number;
  cartSum?: number;
  orderNotes?: string;
  deliveryName?: string;
  timestamp?: string;
  invoiceID?: string;
}

// ----------------------------------
// Products
// ----------------------------------
export interface ProductModel {
  ID: string;

  ULbeneficii: string[];
  imageProduct: string[];

  firstDescription: string;
  jsonContent: string;
  price: string;
  shortDescription: string;
  title: string;

  reviews: Record<string, unknown>;

  discountedPrice?: string;
  realStock?: string;
  realStockCheck?: string;
  fakeStock?: string;
  fakeStockCheck?: string;
}

// Single product object shape (used in some places)
export interface productObject {
  ID: string;
  title: string;
  firstDescription: string;
  shortDescription: string;
  imageProduct: string[];
  jsonContent: string;
  price: string;
  reviews: Record<string, unknown>;
  ULbeneficii: string[];

  discountedPrice?: string;
  realStock?: string;
  realStockCheck?: string;
  fakeStock?: string;
  fakeStockCheck?: string;

  productTotalReviews?: number | string;
}

/** Canonical product item (use this for arrays) */
export interface ProductListItem {
  ID: string;
  title: string;
  firstDescription: string;
  shortDescription: string;
  imageProduct: string[];
  jsonContent: string;
  price: string;
  reviews: Record<string, unknown>;
  ULbeneficii: string[];

  discountedPrice?: string;
  realStock?: string;
  realStockCheck?: string;
  fakeStock?: string;
  fakeStockCheck?: string;

  productTotalReviews?: number | string;
}

/** Array form some loaders/hooks return */
export type ProductListArray = ProductListItem[];

/** Product list keyed by something (e.g., slug/ID) */
export interface ProductListType {
  [key: string]: {
    ID: string;
    title: string;
    firstDescription: string;
    shortDescription: string;
    imageProduct: string[];
    jsonContent: string;
    price: string;
    reviews: Record<string, unknown>;
    ULbeneficii: string[];

    discountedPrice?: string;
    realStock?: string;
    realStockCheck?: string;
    fakeStock?: string;
    fakeStockCheck?: string;

    productTotalReviews?: number | string;
  };
}

/** Handy aliases for components that accept either array or map */
export type ProductMap = ProductListType;
export type NormalizedProductData = ProductListArray | ProductMap | null | undefined;

// Props used by product renderers/cards
export interface ProdItemProps {
  // Prefer stricter type; keep wide enough for both call sites
  productObject: productObject | ProductListType;
  size?: string;
}

export interface ProductTypes {
  ID: string;
  productListUpdated?: ProductListType;
  addCartHandler?: () => void;

  // UI state + handlers
  productCountQuantity?: number;
  productQuantityIncrement?: () => void; // ✅ function handlers
  productQuantityDecrement?: () => void; // ✅ function handlers
}

// Initial model with safe defaults
export const authorInitialProduct: ProductModel = {
  ID: "",
  price: "",
  ULbeneficii: [],
  firstDescription: "",
  imageProduct: [],
  jsonContent: "",
  reviews: {},
  shortDescription: "",
  title: "",
};

// ----------------------------------
// Coupons
// ----------------------------------
export interface CuponModel {
  ID: string | number;
  cuponCode: string;
  cuponDiscount: number;
}

// ----------------------------------
// Invoice
// ----------------------------------
export interface InvoiceItem {
  product: string;
  price: number;
  quantity: number;
}

export interface InvoiceModel {
  client: {
    fullName: string;
    CUI: string;
    banca: string;
    adresa: string;
    email: string;
    telefon: string;
  };
  provider: {
    fullName: string;
    adresa: string;
    telefon: string;
  };
  items: InvoiceItem[];
}

export interface InvoiceOrderProps {
  invoiceObject: {
    lastName?: string;
    firstName?: string;
    phoneNo?: string;
    deliveryAddress?: string;
    emailAddress?: string;
    city?: string;
    county?: string;
    paymentMethod?: string;
    cartProducts?: string;
    shippingTax?: number;
    cartSum?: number;
    orderNotes?: string;
    deliveryName?: string;
    timestamp?: string;
    invoiceID?: string;
  };
  // If you later add companyInfo, place it here.
}
