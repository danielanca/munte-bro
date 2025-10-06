import { ProductModel } from "../../../utils/OrderInterfaces";

export type EditableProduct = Omit<ProductModel, "price" | "discountedPrice" | "realStock" | "fakeStock" | "realStockCheck" | "fakeStockCheck"> & {
  price: number;
  discountedPrice: number;
  realStock: number;
  fakeStock: number;
  realStockCheck: boolean;
  fakeStockCheck: boolean;
  // Changed from File to string for URLs
  productCode: string;
  category: string;
  mainImage: string; // URL string instead of File
  ambianceImages: string[]; // Array of URLs instead of File[]
  descriptionImages: string[]; // Array of URLs instead of File[]
  usageInstructions: string;
  ingredients: string;
  precautions: string;
  treatmentDuration: string;
  benefits: string[];
};

export interface ProductFormProps {
  model: EditableProduct;
  setModel: React.Dispatch<React.SetStateAction<EditableProduct>>;
  setField: (name: keyof EditableProduct, value: any) => void;
  isValid: boolean;
  saving: boolean;
  onCancel: () => void;
  onPreview: () => void;
  onSubmit: () => void;
}