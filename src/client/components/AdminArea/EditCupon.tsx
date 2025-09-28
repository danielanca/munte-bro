// @ts-nocheck
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ProductPreview from "../Product/ProductPreview";
import { CuponModel, ProductListType, ProductModel } from "./../../utils/OrderInterfaces";
import { getData } from "../../data/ProdFetch";
import { updateCupon } from "./../../services/emails";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
// import PageTitle from "../AdminArea/ShardsDesign/components/common/PageTitle";
import styles from "./EditProduct.module.scss";

const EditCupon = () => {
  const [openPreviewArea, setOpenPreviewArea] = useState<boolean>(false);
  let params = useParams();
  let ID: any = params.id !== undefined ? params.id : "";
  console.log("EDIT CUPON PARAM:", useParams());
  const [CuponListUpdated, setCupons] = useState<CuponModel[]>();
  const [editSent, setEditSent] = useState<boolean>(false);
  const [editCuponModel, setEditCuponModel] = useState<CuponModel>({
    ID: "",
    cuponCode: "",
    cuponDiscount: 0
  });

  const navigate = useNavigate();

  const inputHandler = (data: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = data.target;
    setEditCuponModel((prevFormData) => {
      return { ...prevFormData, [name]: value };
    });
  };

  const separatorHandler = (data: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = data.target;
    if (name === "imageProduct" || name === "ULbeneficii") {
      setEditCuponModel((editCuponModel) => ({
        ...editCuponModel,
        [name]: value.split(",")
      }));
    }
  };

  const submitEditOperation = () => {
    setEditSent(true);
    if (editCuponModel.cuponCode !== "") {
      updateCupon(editCuponModel).then((response) => {
        console.log("EDIT process sent to Cloud!");
      });
    }
  };
  const previewOperation = () => {
    setOpenPreviewArea((prevState) => !prevState);
    // console.log(editCuponModel);
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
    navigate("/admin/cupondiscount");
  };

  useEffect(() => {
    if (CuponListUpdated == null) {
      getData(ID).then((finalData) => {
        setCupons(finalData);
      });
    }
  });

  useEffect(() => {
    if (CuponListUpdated != null) {
      setEditCuponModel(CuponListUpdated[ID]);
    }
  }, [CuponListUpdated]);

  return (
    <Container fluid className="main-content-container px-4">
      {/* <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Product List" subtitle={"Edit Product"} className="text-sm-left" />
      </Row> */}
      <Row>
        <Col>
          <div className={styles.editPage}>
            {CuponListUpdated != null ? (
              <div className={styles.addAreaContainer}>
                <h3>{" Edit Cupon"}</h3>

                <div className={styles.inputContainer}>
                  <div className={styles.rowSpacer}>
                    <div className={styles.inputFielder}>
                      <label htmlFor="ID">{"Link ID Name:"}</label>
                      <input
                        style={{ opacity: "0.6", pointerEvents: "none" }}
                        onChange={inputHandler}
                        name="ID"
                        value={editCuponModel.ID}
                        readOnly
                      />
                    </div>
                    <div className={styles.inputFielder}>
                      <label htmlFor="cuponCode">{"Cupon Code"}</label>
                      <input onChange={inputHandler} name="cuponCode" value={editCuponModel.cuponCode} />
                    </div>
                    <div className={styles.inputFielder}>
                      <label htmlFor="cuponDiscount">{"Cupon Discount"}</label>
                      <input onChange={inputHandler} name="cuponDiscount" value={editCuponModel.cuponDiscount} />
                    </div>
                  </div>

                  <div className={styles.actionControl}>
                    <button className={styles.saveButton} onClick={submitEditOperation}>
                      {"SAVE"}
                    </button>
                    <button onClick={cancelOperation} className={styles.cancelButton}>
                      {"CANCEL"}
                    </button>
                  </div>
                  {/* <div className={styles.dialogSpace}>
                    {editSent && <p className={styles.confirmationSaveText}>{"Modificarile au avut loc!"}</p>}
                  </div> */}
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </Col>
      </Row>
      {/* {openPreviewArea && <ProductPreview ID={ID} productListUpdated={{ [ID]: ProductModel }} />} */}
      {/* {openPreviewArea && <p>Mubbasher OP</p>} */}
    </Container>
  );
};

export default EditCupon;
