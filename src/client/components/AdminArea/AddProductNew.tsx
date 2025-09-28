// @ts-nocheck

import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductPreview from "../Product/ProductPreview";
import { ProductListType, ProductModel } from "./../../utils/OrderInterfaces";
import { getProductWithID } from "../../data/productList";
import { addProduct } from "./../../services/emails";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import PageTitle from "../AdminArea/ShardsDesign/components/common/PageTitle";
import styles from "./EditProduct.module.scss";

const EditProduct = () => {
  const [openPreviewArea, setOpenPreviewArea] = useState<boolean>(false);
  const [productListUpdated, setProducts] = useState<any>();
  const [editSent, setEditSent] = useState<boolean>(false);
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
    title: ""
  });

  const navigate = useNavigate();

  console.log("EDIT PRODUCTS PARAM:", useParams());
  let params = useParams();
  let ID: any = params.id !== undefined ? params.id : "";

  const inputHandler = (data: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value, type } = data.target;

    let dataValues = value;

    setEditProductModel((prevFormData) => {
      if (type === "checkbox" && "checked" in data.target) {
        dataValues = data.target.checked ? "true" : "false";
      }
      return { ...prevFormData, [name]: dataValues };
    });
  };

  // const inputHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  //   const { name, type, value } = event.target;
  //   let finalVal: string | boolean = value; // Allow both string and boolean types

  //   if (event.target instanceof HTMLInputElement && type === "checkbox") {
  //     finalVal = event.target.checked;
  //     console.log("Checkbox updated to:", finalVal);
  //   }

  //   setEditProductModel((prevFormData) => {
  //     return { ...prevFormData, [name]: finalVal };
  //   });
  // };

  const separatorHandler = (data: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = data.target;
    if (name === "imageProduct" || name === "ULbeneficii") {
      setEditProductModel((editproductModel) => ({
        ...editproductModel,
        [name]: value.split(",")
      }));
    }
  };

  const submitAddOperation = () => {
    if (editproductModel.title != "") {
      addProduct(editproductModel).then((response) => {
        console.log("Product addition request sent to Cloud!");
        //needs to process the response
      });
    }
  };
  const previewOperation = () => {
    setOpenPreviewArea(true);
  };

  useEffect(() => {
    if (editSent) {
      const timer = setTimeout(() => {
        setEditSent(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [editSent]);

  const cancelOperation = () => {
    navigate("/admin/manage-product");
  };

  useEffect(() => {
    if (productListUpdated == null) {
      getProductWithID(ID).then((finalData) => {
        setProducts(finalData);
      });
    }
  });

  return (
    <Container  className="main-content-container px-4">
      {/* <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Cupon List" subtitle={"Add Cupon"} className="text-sm-left" />
      </Row> */}
      <Row>
        <Col>
          <div className={styles.editPage}>
            <div className={styles.addAreaContainer}>
              <h3>Add Cupon</h3>
              <div className={styles.inputContainer}>
                <div className={styles.imageContainer}>
                  <label htmlFor="imageProduct">{"Images"}</label>
                  <p>{"Linkurile spre imagini trebuie separate de virgula"}</p>
                  <textarea
                    spellCheck="false"
                    className={styles.imageTextArea}
                    onChange={separatorHandler}
                    name="imageProduct"
                  />
                </div>
              </div>
              <div className={styles.inputContainer}>
                <div className={styles.rowSpacer}>
                  <div className={styles.inputFielder}>
                    <label htmlFor="title">{"Product name"}</label>
                    <input onChange={inputHandler} name="title" />
                  </div>
                  <div className={styles.inputFielder}>
                    <label htmlFor="ID">{"Link ID Name:"}</label>
                    <input onChange={inputHandler} name="ID" />
                  </div>
                  <div className={styles.inputFielder}>
                    <label htmlFor="price">{"Price (RON)"}</label>
                    <input onChange={inputHandler} name="price" />
                  </div>
                  <div className={styles.inputFielder}>
                    <label htmlFor="discountedPrice">{"Discount Price (RON)"}</label>
                    <input onChange={inputHandler} name="discountedPrice" />
                  </div>

                  <div className={styles.eachContainer}>
                    <div className={styles.inputFielder}>
                      <label htmlFor="realStock">{"Real Stock"}</label>
                      <input onChange={inputHandler} name="realStock" />
                    </div>
                    <div className={styles.inputFielder}>
                      <label htmlFor="realStockCheck">{"Real Stock Check"}</label>
                      <input onChange={inputHandler} name="realStockCheck" />
                    </div>
                  </div>

                  <div className={styles.eachContainer}>
                    <div className={styles.inputFielder}>
                      <label htmlFor="fakeStock">{"Fake Stock"}</label>
                      <input onChange={inputHandler} name="fakeStock" />
                    </div>
                    <div className={styles.inputFielder}>
                      <label htmlFor="fakeStockCheck">{"Fake Stock Check"}</label>
                      <input onChange={inputHandler} name="fakeStockCheck" />
                    </div>
                  </div>
                </div>
                <div className={styles.rowSpacerTextArea}>
                  <div className={styles.inputFielderTextArea}>
                    <label htmlFor="shortDescription">{"short Description"}</label>
                    <textarea spellCheck="false" onChange={inputHandler} name="shortDescription" />
                  </div>
                  <div className={styles.inputFielderTextArea}>
                    <label htmlFor="firstDescription">{"first Description"}</label>
                    <textarea spellCheck="false" onChange={inputHandler} name="firstDescription" />
                  </div>
                </div>

                <div className={styles.editorElement}>
                  <label htmlFor="jsonContent">{"Full description HTML"}</label>
                  <textarea spellCheck="false" onChange={inputHandler} name="jsonContent" />
                </div>

                <div className={styles.actionControl}>
                  <button className={styles.saveButton} onClick={submitAddOperation}>
                    {"SAVE"}
                  </button>
                  <button onClick={previewOperation} className={styles.previewButton}>
                    {"PREVIEW"}
                  </button>
                  <button onClick={cancelOperation} className={styles.cancelButton}>
                    {"CANCEL"}
                  </button>
                </div>
                <div className={styles.dialogSpace}>
                  {editSent && <p className={styles.confirmationSaveText}>{"Modificarile au avut loc!"}</p>}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>
      {openPreviewArea && <ProductPreview ID={ID} productListUpdated={{ [ID]: editproductModel }} />}
    </Container>
  );
};

export default EditProduct;
