import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductWithID, updateProduct } from "../../data/productList";
import "./AddProduct.css";

interface productType {
  ID: string;
  ULbeneficii: [];
  firstDescription: string;
  imageProduct: [];
  jsonContent: string;
  price: string;
  reviews: {};
  shortDescription: string;
  title: string;
}

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const productId = id || "";
  const navigate = useNavigate();

  const [product, setProduct] = useState<productType | null>(null);
  const [reviewsInput, setReviewsInput] = useState<string>("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProductWithID(productId);
        console.log("Fetched product data:", productData);
        if (productData) {
          setProduct(productData[productId]);
          setReviewsInput(
            JSON.stringify(productData[productId]?.reviews || {}, null, 2) // Pretty-printed JSON
          );
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [productId]);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    setProduct(prevProduct => {
      if (!prevProduct) return null;

      if (name === "imageProduct" || name === "ULbeneficii") {
        return {
          ...prevProduct,
          [name]: value.split(",").map(item => item.trim()),
        };
      } else if (name === "reviews") {
        setReviewsInput(value);
        try {
          const parsedReviews = value ? JSON.parse(value) : {}; // Safely parse JSON
          return {
            ...prevProduct,
            reviews: parsedReviews,
          };
        } catch (error) {
          console.error("Invalid JSON input:", error);
          return prevProduct; // Do not update reviews if JSON is invalid
        }
      } else {
        return {
          ...prevProduct,
          [name]: value,
        };
      }
    });
  };

  const handleUpdateProduct = async () => {
    if (!product) return;

    try {
      // Explicitly include reviews to ensure it stays intact
      const updatedProduct = {
        ...product,
        reviews: product.reviews || {}, // Default to empty object if reviews are undefined/null
      };

      await updateProduct(updatedProduct.ID, updatedProduct);
      console.log("Product updated successfully");
      navigate("/admin/products");
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  if (!product) return <div>Loading...</div>;

  return (
    <section className='addProductSection'>
      <h2>Edit Product</h2>
      <form>
        <div>
          <label>Title:</label>
          <input type='text' name='title' value={product.title} onChange={handleChange} />
        </div>
        <div>
          <label>Product ID:</label>
          <input type='text' name='ID' value={product.ID} readOnly />
        </div>
        <div>
          <label>First Description:</label>
          <textarea name='firstDescription' value={product.firstDescription} onChange={handleChange} />
        </div>
        <div>
          <label>Short Description:</label>
          <textarea name='shortDescription' value={product.shortDescription} onChange={handleChange} />
        </div>
        <div>
          <label>Price:</label>
          <input type='text' name='price' value={product.price} onChange={handleChange} />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type='text'
            name='imageProduct'
            value={Array.isArray(product.imageProduct) ? product.imageProduct.join(", ") : product.imageProduct}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>ULbeneficii (comma-separated):</label>
          <input
            type='text'
            name='ULbeneficii'
            value={Array.isArray(product.ULbeneficii) ? product.ULbeneficii.join(", ") : product.ULbeneficii}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>JSON Content:</label>
          <textarea name='jsonContent' value={product.jsonContent} onChange={handleChange} />
        </div>
        <div>
          <label>Reviews (as JSON string):</label>
          <textarea
            name='reviews'
            value={reviewsInput}
            onChange={handleChange}
            placeholder='Enter reviews as a JSON string'
          />
          {!isValidJSON(reviewsInput) && <p style={{ color: "red" }}>Invalid JSON format</p>}
        </div>
        <button type='button' className='blueBtn' onClick={handleUpdateProduct}>
          Update Product
        </button>
      </form>
    </section>
  );
};

const isValidJSON = (str: string): boolean => {
  try {
    JSON.parse(str);
    return true;
  } catch (error) {
    return false;
  }
};

export default EditProduct;
