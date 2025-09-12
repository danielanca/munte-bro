import React, { useEffect, useState } from "react";
import { getData, deleteProductByID, copyAllData } from "../../data/productList";
import { useNavigate } from "react-router-dom";
import ConfirmDialog from "./ConfirmDialog";
import "./Products.css";

interface productType {
  ID: string;
  ULbeneficii: string[];
  firstDescription: string;
  imageProduct: string[];
  jsonContent: string;
  price: string;
  reviews: {};
  shortDescription: string;
  title: string;
}

const Products: React.FC = () => {
  const [products, setProducts] = useState<{ [key: string]: productType }>({});
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getData();
      setProducts(data);
    };

    fetchProducts();
  }, []);

  const handleDelete = async (productID: string) => {
    setProductToDelete(productID);
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete) {
      try {
        await deleteProductByID(productToDelete);
        setProducts(prevProducts => {
          const updatedProducts = { ...prevProducts };
          delete updatedProducts[productToDelete];
          return updatedProducts;
        });
      } catch (error) {
        console.error("Failed to delete product:", error);
      }
      setShowConfirmDialog(false);
      setProductToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
    setProductToDelete(null);
  };

  const handleEdit = (productID: string) => {
    navigate(`edit-product/${productID}`);
  };

  const handleAddProduct = () => {
    navigate("add-product");
  };

  // useEffect(() => {
  //   const copyData = async () => {
  //     await copyAllData();
  //   };

  //   copyData();
  // }, []);

  return (
    <section>
      <h2 className="title">Products</h2>
      <table className="products-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            {/* <th>Inventory</th> */}
            <th>Price</th>
            <th>Category</th>
            <th></th>

            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(products).length > 0 ? (
            Object.entries(products).map(([id, product], index) => (
              <tr key={id}>
                <td>{index}</td>
                <td className="product-name">
                  <img src={product.imageProduct[0]} alt={product.title} className="product-image" />
                  {product.title}
                </td>
                <td>{product.ULbeneficii.length}</td>
                <td>RON {product.price}</td>
                <td>{product.ID}</td>
                <td className="actions">
                  <button className="edit-button" onClick={() => handleEdit(product.ID)}>
                    Edit
                  </button>
                  <button className="delete-button" onClick={() => handleDelete(product.ID)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6}>Loading products...</td>
            </tr>
          )}
        </tbody>
      </table>
      <button className="add-product-button" onClick={handleAddProduct}>
        Add Product
      </button>
      {showConfirmDialog && (
        <ConfirmDialog
          message="Are you sure you want to delete this product?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </section>
  );
};

export default Products;
