import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductPreview from "../Product/ProductPreview";
import { ProductModel } from "../../utils/OrderInterfaces";
import { getProductWithID } from "../../data/productList";
import { updateProduct } from "../../services/emails";
import { Container, Row, Col } from "react-bootstrap"; // ⬅️ swapped
import styles from "./EditProduct.module.scss";
import ImageComponent from "./ImageComponent/ImageComponent";

type RouteParams = { id?: string };

const EMPTY_PRODUCT: ProductModel = {
  ID: "",
  price: "",
  ULbeneficii: [],
  firstDescription: "",
  discountedPrice: "",
  realStock: "",
  realStockCheck: "",
  fakeStock: "",
  fakeStockCheck: "",
  imageProduct: ["", "", ""],
  jsonContent: "",
  reviews: {},
  shortDescription: "",
  title: "",
};

const EditProduct: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<RouteParams>();
  const ID = id ?? "";

  const [openPreviewArea, setOpenPreviewArea] = useState(false);
  const [editSent, setEditSent] = useState(false);
  const [product, setProduct] = useState<ProductModel>(EMPTY_PRODUCT);

  const inputHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const separatorHandler = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    if (name === "imageProduct" || name === "ULbeneficii") {
      setProduct((prev) => ({ ...prev, [name]: value.split(",") as any }));
    }
  };

  const handleUrlsUpdated = (newUrls: string[]) => {
    setProduct((prev) => {
      const updated = [...prev.imageProduct];
      newUrls.forEach((url, idx) => (updated[idx] = url));
      return { ...prev, imageProduct: updated };
    });
  };

  const onDelete = (index: number) => {
    setProduct((prev) => {
      const updated = prev.imageProduct.filter((_, i) => i !== index);
      const next = { ...prev, imageProduct: updated };
      void updateProduct(next);
      return next;
    });
  };

  const submitEditOperation = async () => {
    setEditSent(true);
    if (product.title.trim() !== "") {
      try {
        await updateProduct(product);
      } catch {}
    }
  };

  const previewOperation = () => setOpenPreviewArea((s) => !s);
  const cancelOperation = () => navigate("/admin/manage-product");

  useEffect(() => {
    let alive = true;
    const run = async () => {
      if (!ID) return;
      const result = await getProductWithID(ID);
      const next: ProductModel = Array.isArray(result)
        ? (result.find((p) => p.ID === ID) ?? EMPTY_PRODUCT)
        : (result ?? EMPTY_PRODUCT);
      if (alive) setProduct(next);
    };
    run();
    return () => {
      alive = false;
    };
  }, [ID]);

  useEffect(() => {
    if (!editSent) return;
    const t = setTimeout(() => setEditSent(false), 5000);
    return () => clearTimeout(t);
  }, [editSent]);

  const hasProduct = product.ID !== "";

  return (
    <Container fluid className="main-content-container px-4">
      <Row className="g-0 page-header py-4" /> {/* noGutters → g-0 */}
      <Row>
        <Col>
          <div className={styles.editPage}>
            {hasProduct && (
              <div className={styles.addAreaContainer}>
                <h3>Edit Product</h3>

                <div className={styles.inputContainer}>
                  <div className={styles.imageContainer}>
                    <label htmlFor="imageProduct">Images</label>
                    <div className={styles.imagesComponents}>
                      <ImageComponent
                        existingImageUrls={product.imageProduct}
                        onUrlsUpdated={handleUrlsUpdated}
                        onDelete={onDelete}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.inputContainer}>
                  <div className={styles.rowSpacer}>
                    <div className={styles.inputFielder}>
                      <label htmlFor="title">Product name</label>
                      <input onChange={inputHandler} name="title" value={product.title ?? ""} />
                    </div>

                    <div className={styles.inputFielder}>
                      <label htmlFor="ID">Link ID Name:</label>
                      <input
                        style={{ opacity: 0.6, pointerEvents: "none" }}
                        onChange={inputHandler}
                        name="ID"
                        value={product.ID ?? ""}
                        readOnly
                      />
                    </div>

                    <div className={styles.inputFielder}>
                      <label htmlFor="price">Price (RON)</label>
                      <input onChange={inputHandler} name="price" value={product.price ?? ""} />
                    </div>

                    <div className={styles.inputFielder}>
                      <label htmlFor="discountedPrice">Discounted Price (RON)</label>
                      <input
                        onChange={inputHandler}
                        name="discountedPrice"
                        value={product.discountedPrice ?? ""}
                      />
                    </div>

                    <div className={styles.eachContainer}>
                      <div className={styles.inputFielder}>
                        <label htmlFor="realStock">Real Stock</label>
                        <input
                          onChange={inputHandler}
                          name="realStock"
                          value={product.realStock ?? ""}
                        />
                      </div>
                      <div className={styles.inputFielder}>
                        <label htmlFor="realStockCheck">Real Stock Check</label>
                        <input
                          onChange={inputHandler}
                          name="realStockCheck"
                          value={product.realStockCheck ?? ""}
                        />
                      </div>
                    </div>

                    <div className={styles.eachContainer}>
                      <div className={styles.inputFielder}>
                        <label htmlFor="fakeStock">Fake Stock</label>
                        <input
                          onChange={inputHandler}
                          name="fakeStock"
                          value={product.fakeStock ?? ""}
                        />
                      </div>
                      <div className={styles.inputFielder}>
                        <label htmlFor="fakeStockCheck">Fake Stock Check</label>
                        <input
                          onChange={inputHandler}
                          name="fakeStockCheck"
                          value={product.fakeStockCheck ?? ""}
                        />
                      </div>
                    </div>
                  </div>

                  <div className={styles.rowSpacerTextArea}>
                    <div className={styles.inputFielderTextArea}>
                      <label htmlFor="shortDescription">Short Description</label>
                      <textarea
                        spellCheck={false}
                        onChange={inputHandler}
                        name="shortDescription"
                        value={product.shortDescription ?? ""}
                      />
                    </div>

                    <div className={styles.inputFielderTextArea}>
                      <label htmlFor="firstDescription">First Description</label>
                      <textarea
                        spellCheck={false}
                        onChange={inputHandler}
                        name="firstDescription"
                        value={product.firstDescription ?? ""}
                      />
                    </div>
                  </div>

                  <div className={styles.editorElement}>
                    <label htmlFor="jsonContent">Full description HTML</label>
                    <textarea
                      spellCheck={false}
                      onChange={inputHandler}
                      name="jsonContent"
                      value={product.jsonContent ?? ""}
                    />
                  </div>

                  <div className={styles.actionControl}>
                    <button className={styles.saveButton} onClick={submitEditOperation}>
                      SAVE
                    </button>
                    <button onClick={previewOperation} className={styles.previewButton}>
                      PREVIEW
                    </button>
                    <button onClick={cancelOperation} className={styles.cancelButton}>
                      CANCEL
                    </button>
                  </div>

                  <div className={styles.dialogSpace}>
                    {editSent && (
                      <p className={styles.confirmationSaveText}>Modificarile au avut loc!</p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {openPreviewArea && <ProductPreview ID={ID} productListUpdated={{ [ID]: product }} />}
    </Container>
  );
};

export default EditProduct;
