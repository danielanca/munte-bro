import React, { useState } from "react";
import { addProduct } from "../../data/productList";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";

// Correct the interface to allow arrays of strings
interface productType {
  ID: string;
  ULbeneficii: string[]; // Change to string[] for multiple benefits
  firstDescription: string;
  imageProduct: string[]; // Change to string[] for multiple image URLs
  jsonContent: string;
  price: string;
  reviews: Record<string, any>; // Use Record to allow flexible review objects
  shortDescription: string;
  title: string;
}

const AddProduct: React.FC = () => {
  const [product, setProduct] = useState<productType>({
    ID: "",
    ULbeneficii: [], // Initialize as an empty array to hold multiple strings
    firstDescription: "",
    imageProduct: [], // Initialize as an empty array to hold multiple image URLs
    jsonContent: "",
    price: "",
    reviews: {}, // Initialize as an empty object for reviews
    shortDescription: "",
    title: "",
  });

  const navigate = useNavigate();

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    const generatedID = title.toLowerCase().replace(/\s+/g, "-").replace(/-+$/, "");

    setProduct((prevProduct) => ({
      ...prevProduct,
      title: title,
      ID: generatedID,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setProduct((prevProduct) => {
      if (name === "imageProduct" || name === "ULbeneficii") {
        return {
          ...prevProduct,
          [name]: value.split(",").map((item) => item.trim()), // Split comma-separated values into an array
        };
      } else {
        return {
          ...prevProduct,
          [name]: value,
        };
      }
    });
  };

  const handleAddProduct = async () => {
    try {
      await addProduct(product); // Ensure addProduct is typed correctly to accept productType
      console.log("Product added successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to add product:", error);
    }
  };

  return (
    <section className="addProductSection">
      <h2>Add New Product</h2>
      <form>
        <div>
          <label>Title:</label>
          <input type="text" name="title" value={product.title} onChange={handleTitleChange} />
        </div>
        <div>
          <label>Product ID:</label>
          <input type="text" name="ID" value={product.ID} readOnly />
        </div>
        <div>
          <label>First Description:</label>
          <textarea name="firstDescription" value={product.firstDescription} onChange={handleChange} />
        </div>
        <div>
          <label>Short Description:</label>
          <textarea name="shortDescription" value={product.shortDescription} onChange={handleChange} />
        </div>
        <div>
          <label>Price:</label>
          <input type="text" name="price" value={product.price} onChange={handleChange} />
        </div>
        <div>
          <label>Image URLs (comma-separated):</label>
          <input
            type="text"
            name="imageProduct"
            value={product.imageProduct.join(", ")} // Join the array of URLs back into a string
            onChange={handleChange}
          />
        </div>
        <div>
          <label>ULbeneficii (comma-separated):</label>
          <input
            type="text"
            name="ULbeneficii"
            value={product.ULbeneficii.join(", ")} // Join the array of benefits back into a string
            onChange={handleChange}
          />
        </div>
        <div>
          <label>JSON Content:</label>
          <textarea name="jsonContent" value={product.jsonContent} onChange={handleChange} />
        </div>
        <div>
          <label>Reviews (as JSON):</label>
          <textarea name="reviews" value={JSON.stringify(product.reviews)} onChange={handleChange} />
        </div>
        <button type="button" className="blueBtn" onClick={handleAddProduct}>
          Add Product
        </button>
      </form>
    </section>
  );
};

export default AddProduct;
