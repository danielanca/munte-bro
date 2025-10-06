import type { EditableProduct } from "./EditProductTypes";

export const toSlug = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[ăâîșşțţ]/g, (m) =>
      ({ 'ă': 'a', 'â': 'a', 'î': 'i', 'ș': 's', 'ş': 's', 'ț': 't', 'ţ': 't' } as const)[m] || m
    )
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\-_ ]+/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

export const splitToArray = (v: string) =>
  v
    .split(/[\n, ]/g)
    .map((x) => x.trim())
    .filter(Boolean);

export const EMPTY_PRODUCT: EditableProduct = {
  ID: "",
  title: "",
  price: 0,
  discountedPrice: 0,
  realStock: 0,
  realStockCheck: false,
  fakeStock: 0,
  fakeStockCheck: false,
  ULbeneficii: [],
  firstDescription: "",
  imageProduct: [],
  jsonContent: "",
  reviews: {},
  shortDescription: "",
  // New fields as strings
  productCode: "",
  category: "",
  mainImage: "", // Empty string instead of null
  ambianceImages: [], // Empty array instead of File[]
  descriptionImages: [], // Empty array instead of File[]
  usageInstructions: "",
  ingredients: "",
  precautions: "",
  treatmentDuration: "",
  benefits: [],
};
export const arrayTextDraft = (arr: string[]) => arr.join(", ");