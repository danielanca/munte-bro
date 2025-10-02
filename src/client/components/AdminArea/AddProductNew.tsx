import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductPreview from "../Product/ProductPreview";
import { ProductModel } from "../../utils/OrderInterfaces";
import { getProductWithID } from "../../data/productList";
import { addProduct } from "./../../services/emails";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap";
import styles from "./EditProduct.module.scss";

const EditProduct: React.FC = () => {
  const [openPreviewArea, setOpenPreviewArea] = useState(false);
  const [productListUpdated, setProducts] = useState<any>();
  const [editSent, setEditSent] = useState(false);
  const [editproductModel, setEditProductModel] = useState<ProductModel>({
    ID: "",
    price: "",
    discountedPrice: "",
    realStock: "",
    realStockCheck: "",
    fakeStock: "",
    fakeStockCheck: "",
    ULbeneficii: [],
    firstDescription: "",
    imageProduct: [],
    jsonContent: "",
    reviews: {},
    shortDescription: "",
    title: "",
  });

  const navigate = useNavigate();
  const params = useParams();
  const ID = params.id ?? "";

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    let v: string = value;
    if (type === "checkbox" && "checked" in e.target) v = e.target.checked ? "true" : "false";
    setEditProductModel((prev) => ({ ...prev, [name]: v }));
  };

  const separatorHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "imageProduct" || name === "ULbeneficii") {
      setEditProductModel((prev) => ({ ...prev, [name]: value.split(",") as any }));
    }
  };

  const submitAddOperation = () => {
    if (editproductModel.title) {
      addProduct(editproductModel).then(() => setEditSent(true));
    }
  };

  const previewOperation = () => setOpenPreviewArea(true);
  const cancelOperation = () => navigate("/admin/manage-product");

  useEffect(() => {
    if (editSent) {
      const t = setTimeout(() => setEditSent(false), 5000);
      return () => clearTimeout(t);
    }
  }, [editSent]);

  useEffect(() => {
    if (productListUpdated == null && ID) {
      getProductWithID(ID as string).then((finalData) => setProducts(finalData));
    }
  }, [ID, productListUpdated]);

  return (
    <Container className="px-4">
      <Row>
        <Col>
          <div className={styles.editPage}>
            <div className={styles.addAreaContainer}>
              <h3>Add Cupon</h3>

              <div className={styles.inputContainer}>
                <div className={styles.imageContainer}>
                  <Form.Label htmlFor="imageProduct">Images</Form.Label>
                  <p>Linkurile spre imagini trebuie separate de virgula</p>
                  <Form.Control
                    as="textarea"
                    spellCheck={false}
                    className={styles.imageTextArea}
                    onChange={separatorHandler}
                    name="imageProduct"
                  />
                </div>
              </div>

              <div className={styles.inputContainer}>
                <div className={styles.rowSpacer}>
                  <div className={styles.inputFielder}>
                    <Form.Label htmlFor="title">Product name</Form.Label>
                    <Form.Control onChange={inputHandler} name="title" />
                  </div>
                  <div className={styles.inputFielder}>
                    <Form.Label htmlFor="ID">Link ID Name:</Form.Label>
                    <Form.Control onChange={inputHandler} name="ID" />
                  </div>
                  <div className={styles.inputFielder}>
                    <Form.Label htmlFor="price">Price (RON)</Form.Label>
                    <Form.Control onChange={inputHandler} name="price" />
                  </div>
                  <div className={styles.inputFielder}>
                    <Form.Label htmlFor="discountedPrice">Discount Price (RON)</Form.Label>
                    <Form.Control onChange={inputHandler} name="discountedPrice" />
                  </div>

                  <div className={styles.eachContainer}>
                    <div className={styles.inputFielder}>
                      <Form.Label htmlFor="realStock">Real Stock</Form.Label>
                      <Form.Control onChange={inputHandler} name="realStock" />
                    </div>
                    <div className={styles.inputFielder}>
                      <Form.Label htmlFor="realStockCheck">Real Stock Check</Form.Label>
                      <Form.Control onChange={inputHandler} name="realStockCheck" />
                    </div>
                  </div>

                  <div className={styles.eachContainer}>
                    <div className={styles.inputFielder}>
                      <Form.Label htmlFor="fakeStock">Fake Stock</Form.Label>
                      <Form.Control onChange={inputHandler} name="fakeStock" />
                    </div>
                    <div className={styles.inputFielder}>
                      <Form.Label htmlFor="fakeStockCheck">Fake Stock Check</Form.Label>
                      <Form.Control onChange={inputHandler} name="fakeStockCheck" />
                    </div>
                  </div>
                </div>

                <div className={styles.rowSpacerTextArea}>
                  <div className={styles.inputFielderTextArea}>
                    <Form.Label htmlFor="shortDescription">short Description</Form.Label>
                    <Form.Control as="textarea" spellCheck={false} onChange={inputHandler} name="shortDescription" />
                  </div>
                  <div className={styles.inputFielderTextArea}>
                    <Form.Label htmlFor="firstDescription">first Description</Form.Label>
                    <Form.Control as="textarea" spellCheck={false} onChange={inputHandler} name="firstDescription" />
                  </div>
                </div>

                <div className={styles.editorElement}>
                  <Form.Label htmlFor="jsonContent">Full description HTML</Form.Label>
                  <Form.Control as="textarea" spellCheck={false} onChange={inputHandler} name="jsonContent" />
                </div>

                <div className={styles.actionControl}>
                  <Button className={styles.saveButton} onClick={submitAddOperation}>
                    SAVE
                  </Button>
                  <Button variant="secondary" onClick={previewOperation} className={styles.previewButton}>
                    PREVIEW
                  </Button>
                  <Button variant="outline-secondary" onClick={cancelOperation} className={styles.cancelButton}>
                    CANCEL
                  </Button>
                </div>

                <div className={styles.dialogSpace}>{editSent && <p className={styles.confirmationSaveText}>Modificarile au avut loc!</p>}</div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {openPreviewArea && <ProductPreview ID={ID as string} productListUpdated={{ [ID as string]: editproductModel }} />}
    </Container>
  );
};

export default EditProduct;
