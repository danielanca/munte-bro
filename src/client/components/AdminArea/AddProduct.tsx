// import React, { useCallback, useMemo, useState } from "react";
// import { updateProduct } from "../../services/emails";
// import { ProductModel } from "../../utils/OrderInterfaces";
// import styles from "./AddProduct.module.scss";

// type FormState = ProductModel;

// const initialState: FormState = {
//   ID: "",
//   title: "",
//   shortDescription: "",
//   firstDescription: "",
//   jsonContent: "",
//   price: "",
//   reviews: {},
//   ULbeneficii: [],
//   imageProduct: [],
//   // optional fields - keep undefined until user types:
//   discountedPrice: undefined,
//   realStock: undefined,
//   realStockCheck: undefined,
//   fakeStock: undefined,
//   fakeStockCheck: undefined,
// };

// const AddProduct = () => {
//   const [form, setForm] = useState<FormState>(initialState);
//   const [saving, setSaving] = useState(false);

//   // Generic text/textarea
//   const onText = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//       const { name, value } = e.target;
//       setForm((s) => ({ ...s, [name]: value }));
//     },
//     []
//   );

//   // Optional text fields (empty -> undefined, so we don't write empty strings)
//   const onOptionalText = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const { name, value } = e.target;
//       setForm((s) => ({ ...s, [name]: value.trim() === "" ? undefined : value }));
//     },
//     []
//   );

//   // Comma-separated → string[]
//   const onCsv = useCallback(
//     (e: React.ChangeEvent<HTMLInputElement>) => {
//       const { name, value } = e.target;
//       const arr = value
//         .split(",")
//         .map((x) => x.trim())
//         .filter(Boolean);
//       setForm((s) => ({ ...s, [name]: arr }));
//     },
//     []
//   );

//   // If you want to toggle checks but your model stores them as strings,
//   // use a select or two-state input to write "true"/"false" strings:
//   const setCheckString = (name: "realStockCheck" | "fakeStockCheck") =>
//     (e: React.ChangeEvent<HTMLSelectElement>) => {
//       const { value } = e.target; // "true" | "false" | ""
//       setForm((s) => ({ ...s, [name]: value || undefined }));
//     };

//   const canSave = useMemo(() => {
//     if (!form.ID.trim()) return false;
//     if (!form.title.trim()) return false;
//     if (!form.price.trim()) return false; // price is required in your model
//     return true;
//   }, [form]);

//   const submitAddOperation = async () => {
//     if (!canSave || saving) return;
//     setSaving(true);
//     try {
//       // payload already matches ProductModel exactly
//       await updateProduct(form);
//       console.log("Product addition request sent to Cloud!");
//       setForm(initialState);
//     } catch (err) {
//       console.error("Failed to save product:", err);
//     } finally {
//       setSaving(false);
//     }
//   };

//   const cancelOperation = () => {
//     setForm(initialState);
//     console.log("Operation cancelled");
//   };

//   return (
//     <div className={styles.addAreaContainer}>
//       <h2>ADD PRODUCT</h2>

//       <div className={styles.inputContainer}>
//         <div className="d-flex flex-column">
//           <label htmlFor="title">Product name</label>
//           <input id="title" name="title" value={form.title} onChange={onText} />
//         </div>

//         <div className="d-flex flex-column">
//           <label htmlFor="ID">Link ID Name</label>
//           <input id="ID" name="ID" value={form.ID} onChange={onText} />
//         </div>

//         <div className="d-flex flex-column">
//           <label htmlFor="price">Price (RON)</label>
//           <input id="price" name="price" value={form.price} onChange={onText} />
//         </div>

//         <div className="d-flex flex-column">
//           <label htmlFor="discountedPrice">Discounted Price (RON)</label>
//           <input
//             id="discountedPrice"
//             name="discountedPrice"
//             value={form.discountedPrice ?? ""}
//             onChange={onOptionalText}
//             placeholder="optional"
//           />
//         </div>

//         <div className="d-flex flex-column">
//           <label htmlFor="shortDescription">Short Description</label>
//           <input
//             id="shortDescription"
//             name="shortDescription"
//             value={form.shortDescription}
//             onChange={onText}
//           />
//         </div>

//         <div className="d-flex flex-column">
//           <label htmlFor="firstDescription">First Description</label>
//           <input
//             id="firstDescription"
//             name="firstDescription"
//             value={form.firstDescription}
//             onChange={onText}
//           />
//         </div>

//         <div className="d-flex flex-column">
//           <label htmlFor="ULbeneficii">Key advantages (comma-separated)</label>
//           <input id="ULbeneficii" name="ULbeneficii" onChange={onCsv} />
//         </div>

//         <div className="d-flex flex-column">
//           <label htmlFor="imageProduct">Images (comma-separated URLs)</label>
//           <input id="imageProduct" name="imageProduct" onChange={onCsv} />
//         </div>

//         <div className="d-flex flex-column">
//           <label htmlFor="jsonContent">Full description HTML</label>
//           <textarea
//             id="jsonContent"
//             spellCheck="false"
//             name="jsonContent"
//             value={form.jsonContent}
//             onChange={onText}
//           />
//         </div>

//         {/* OPTIONAL STOCK FIELDS (all strings in your model) */}
//         <div className="d-flex flex-column">
//           <label htmlFor="realStock">Real Stock (string)</label>
//           <input
//             id="realStock"
//             name="realStock"
//             value={form.realStock ?? ""}
//             onChange={onOptionalText}
//             placeholder="e.g. 12"
//           />
//         </div>

//         <div className="d-flex flex-column">
//           <label htmlFor="realStockCheck">Real Stock Check</label>
//           <select
//             id="realStockCheck"
//             name="realStockCheck"
//             value={form.realStockCheck ?? ""}
//             onChange={setCheckString("realStockCheck")}
//           >
//             <option value="">(unset)</option>
//             <option value="true">true</option>
//             <option value="false">false</option>
//           </select>
//         </div>

//         <div className="d-flex flex-column">
//           <label htmlFor="fakeStock">Fake Stock (string)</label>
//           <input
//             id="fakeStock"
//             name="fakeStock"
//             value={form.fakeStock ?? ""}
//             onChange={onOptionalText}
//             placeholder="e.g. 5"
//           />
//         </div>

//         <div className="d-flex flex-column">
//           <label htmlFor="fakeStockCheck">Fake Stock Check</label>
//           <select
//             id="fakeStockCheck"
//             name="fakeStockCheck"
//             value={form.fakeStockCheck ?? ""}
//             onChange={setCheckString("fakeStockCheck")}
//           >
//             <option value="">(unset)</option>
//             <option value="true">true</option>
//             <option value="false">false</option>
//           </select>
//         </div>

//         <div className={styles.actionControl}>
//           <button onClick={submitAddOperation} disabled={!canSave || saving}>
//             {saving ? "SAVING..." : "SAVE"}
//           </button>
//           <button onClick={cancelOperation} className={styles.cancelButton}>
//             CANCEL
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddProduct;
