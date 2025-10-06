import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ProductPreview from "../Product/ProductPreview";
import { getProductWithID } from "../../data/productList";
import { Container, Row, Col, Card, Button, Alert } from "react-bootstrap";
import { doc, setDoc } from "firebase/firestore";
import styles from "./EditProduct.module.scss";
import { db } from "../../firebase";
import { toSlug, splitToArray, EMPTY_PRODUCT } from "./AddProducts/EditProductHelpers";
import type { EditableProduct } from "./AddProducts/EditProductTypes";
import ProductForm from "./AddProducts/ProductForm";

const EditProduct: React.FC = () => {
  const [openPreviewArea, setOpenPreviewArea] = useState(false);
  const [productListUpdated, setProducts] = useState<any>();
  const [editSent, setEditSent] = useState<"ok" | "err" | null>(null);
  const [saving, setSaving] = useState(false);
  const [model, setModel] = useState<EditableProduct>(EMPTY_PRODUCT);

  const navigate = useNavigate();
  const params = useParams();
  const IDParam = params.id ?? "";

  const isValid = useMemo(() => {
    return (
      model.title.trim().length > 2 &&
      (model.ID || toSlug(model.title)).trim().length > 2 &&
      model.price >= 0 &&
      model.discountedPrice >= 0 &&
      model.productCode.trim().length > 0 &&
      model.category.trim().length > 0 &&
      model.mainImage.trim().length > 0 // Changed from null check to string length check
    );
  }, [model]);

  useEffect(() => {
    if (productListUpdated == null && IDParam) {
      getProductWithID(IDParam as string).then((finalData) => setProducts(finalData));
    }
  }, [IDParam, productListUpdated]);

  useEffect(() => {
    if (editSent) {
      const t = setTimeout(() => setEditSent(null), 4000);
      return () => clearTimeout(t);
    }
  }, [editSent]);

  const setField = (name: keyof EditableProduct, value: any) =>
    setModel((prev) => ({ ...prev, [name]: value }));

  const addProductFirestore = async (payload: EditableProduct) => {
    const finalID = (payload.ID || toSlug(payload.title)).trim();
    
    // Combine all image URLs from the different sections
    const allImageUrls = [
      payload.mainImage, // main image URL
      ...payload.ambianceImages, // ambiance image URLs
      ...payload.descriptionImages, // description image URLs
      ...payload.imageProduct // legacy image URLs
    ].filter(url => url.trim().length > 0); // Remove empty strings

    // Prepare the product data for Firestore
    const productData = {
      ...payload,
      imageProduct: allImageUrls, // Combine all images into imageProduct array
      ID: finalID,
    };

    const ref = doc(db, "products", "activeProds");
    await setDoc(ref, { [finalID]: productData }, { merge: true });
  };

  const submitAddOperation = async () => {
    if (!isValid) return;
    try {
      setSaving(true);
      await addProductFirestore(model);
      setEditSent("ok");
      // Reset form after successful save
      setTimeout(() => {
        setModel(EMPTY_PRODUCT);
      }, 2000);
    } catch (e) {
      console.error(e);
      setEditSent("err");
    } finally {
      setSaving(false);
    }
  };

  const previewOperation = () => setOpenPreviewArea(true);
  const cancelOperation = () => navigate("/admin/manage-product");

  return (
    <Container fluid className="px-3 px-lg-4 py-4">
      <Row className="g-4">
        <Col>
          <div className={styles.editPage}>
            <Card className={`${styles.cardModern} border-0`}>
              <Card.Header className={`${styles.cardHeader} bg-white border-0 d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center py-4`}>
                <div className="mb-3 mb-md-0">
                  <h5 className="mb-2 fw-bold text-dark">Add / Edit Product</h5>
                  <small className="text-muted">Completează detaliile produsului și salvează în Firestore.</small>
                </div>
                <div className="d-flex flex-wrap gap-2 w-100 w-md-auto">
                  <Button 
                    variant="outline-secondary" 
                    onClick={cancelOperation}
                    className={styles.actionBtn}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="outline-primary" 
                    onClick={previewOperation}
                    className={styles.actionBtn}
                  >
                    Preview
                  </Button>
                  <Button 
                    onClick={submitAddOperation} 
                    disabled={!isValid || saving}
                    className={`${styles.saveBtn} ${styles.actionBtn}`}
                  >
                    {saving ? (
                      <>
                        <span className={styles.spinner}></span>
                        Saving...
                      </>
                    ) : (
                      "Save Product"
                    )}
                  </Button>
                </div>
              </Card.Header>

              <Card.Body className="pt-0">
                {editSent && (
                  <Alert
                    variant={editSent === "ok" ? "success" : "danger"}
                    className={`${styles.alertModern} mt-3`}
                    onClose={() => setEditSent(null)}
                    dismissible
                  >
                    <div className="d-flex align-items-center">
                      <i className={`bi ${editSent === "ok" ? "bi-check-circle-fill" : "bi-exclamation-circle-fill"} me-2`}></i>
                      {editSent === "ok" ? "Produsul a fost salvat cu succes!" : "Eroare la salvare. Încearcă din nou."}
                    </div>
                  </Alert>
                )}

                {/* <ProductForm 
                  model={model} 
                  setModel={setModel} 
                  setField={setField}
                  isValid={isValid}
                  saving={saving}
                  onCancel={cancelOperation}
                  onPreview={previewOperation}
                  onSubmit={submitAddOperation}
                /> */}
              </Card.Body>
            </Card>
          </div>
        </Col>
      </Row>

      {openPreviewArea && (
        <ProductPreview
          ID={(IDParam as string) || (model.ID || toSlug(model.title))}
          productListUpdated={{ [(model.ID || toSlug(model.title)) as string]: model }}
        />
      )}
    </Container>
  );
};

export default EditProduct;