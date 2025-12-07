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

// Accept both the old string shape and the new numeric/boolean shape
export type Numish = number | string;
export type Boolish = boolean | string;

// Firestore timestamp type
export interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
}

export type AnyTimestamp = Date | FirestoreTimestamp | string;

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
  parcelId?: string;

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
// Products - Consolidated and Cleaned
// ----------------------------------

// Base product interface with all common fields
export interface ProductBase {
  ID: string;
  title: string;
  firstDescription: string;
  shortDescription: string;
  imageProduct: string[];
  jsonContent: string;
  price: Numish;
  reviews: Record<string, unknown>;
  ULbeneficii: string[];
  
  // Timestamp fields
  createdAt?: AnyTimestamp;
  updatedAt?: AnyTimestamp;
  
  // Optional fields
  discountedPrice?: Numish;
  realStock?: Numish;
  realStockCheck?: Boolish;
  fakeStock?: Numish;
  fakeStockCheck?: Boolish;
  productTotalReviews?: number | string;
}

// Main product interfaces extending the base
export interface ProductModel extends ProductBase {}

export interface ProductListItem extends ProductBase {}

export interface productObject extends ProductBase {}

/** Array form some loaders/hooks return */
export type ProductListArray = ProductListItem[];

/** Product list keyed by ID */
export interface ProductListType {
  [key: string]: ProductListItem;
}

/** Handy aliases for components that accept either array or map */
export type ProductMap = ProductListType;
export type NormalizedProductData = ProductListArray | ProductMap | null | undefined;

// Props used by product renderers/cards
export interface ProdItemProps {
  productObject: productObject | ProductListType;
  size?: string;
}

export interface ProductTypes {
  ID: string;
  productListUpdated?: ProductListType;
  addCartHandler?: () => void;

  // UI state + handlers
  productCountQuantity?: number;
  productQuantityIncrement?: () => void;
  productQuantityDecrement?: () => void;
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
    parcelId?: string;
    orderNotes?: string;
    deliveryName?: string;
    timestamp?: string;
    invoiceID?: string;
  };
}

// ----------------------------------
// Utility functions for product data
// ----------------------------------

/**
 * Check if a product is new (created within last 30 days)
 */
export const isProductNew = (createdAt: AnyTimestamp | undefined): boolean => {
  if (!createdAt) return false;
  
  try {
    let createdDate: Date;
    
    if (createdAt instanceof Date) {
      createdDate = createdAt;
    } else if (typeof createdAt === 'object' && 'seconds' in createdAt) {
      // Firestore timestamp object
      createdDate = new Date((createdAt as FirestoreTimestamp).seconds * 1000);
    } else if (typeof createdAt === 'string') {
      // ISO string
      createdDate = new Date(createdAt);
    } else {
      return false;
    }
    
    const currentDate = new Date();
    const diffTime = Math.abs(currentDate.getTime() - createdDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 30;
  } catch (error) {
    console.error('Error parsing createdAt:', error);
    return false;
  }
};

/**
 * Check if product has a valid discount
 */
export const hasProductDiscount = (price: Numish, discountedPrice?: Numish): boolean => {
  if (!discountedPrice) return false;
  
  // Handle empty string case
  if (discountedPrice === "" || discountedPrice === "0" || discountedPrice === 0) return false;
  
  const priceNum = typeof price === 'string' ? parseFloat(price.replace(',', '.')) : price;
  const discountedNum = typeof discountedPrice === 'string' ? parseFloat(discountedPrice.replace(',', '.')) : discountedPrice;
  
  // Check if discountedNum is a valid number and less than price
  return !isNaN(discountedNum) && discountedNum < priceNum;
};

/**
 * Format price for display
 */
export const formatProductPrice = (price: Numish): string => {
  if (typeof price === 'number') {
    return price.toFixed(2).replace('.', ',');
  }
  return price;
};

/**
 * Calculate discount percentage
 */
export const calculateDiscountPercentage = (price: Numish, discountedPrice: Numish): string => {
  const priceNum = typeof price === 'string' ? parseFloat(price.replace(',', '.')) : price;
  const discountedNum = typeof discountedPrice === 'string' ? parseFloat(discountedPrice.replace(',', '.')) : discountedPrice;
  
  if (isNaN(priceNum) || isNaN(discountedNum)) return "-0%";
  
  const percentage = ((priceNum - discountedNum) / priceNum) * 100;
  return `-${Math.round(percentage)}%`;
};

/**
 * Get display price (discounted if available, otherwise regular price)
 */
export const getDisplayPrice = (price: Numish, discountedPrice?: Numish): string => {
  const hasDisc = hasProductDiscount(price, discountedPrice);
  return hasDisc && discountedPrice ? formatProductPrice(discountedPrice) : formatProductPrice(price);
};

/**
 * Get original price for display (when discounted)
 */
export const getOriginalPrice = (price: Numish, discountedPrice?: Numish): string | null => {
  const hasDisc = hasProductDiscount(price, discountedPrice);
  return hasDisc ? formatProductPrice(price) : null;
};