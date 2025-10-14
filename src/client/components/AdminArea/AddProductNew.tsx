import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import ProductPreview from "../Product/ProductPreview";
import { ProductModel } from "../../utils/OrderInterfaces";
import { getProductWithID as getProductByID, upsertProduct } from "../../services/products";
import { Container, Row, Col, Card, Button, Form, Badge, Alert } from "react-bootstrap";
import styles from "./EditProduct.module.scss";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase";

const toSlug = (s: string) =>
  (s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const EMPTY_PRODUCT: ProductModel = {
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
};

const EditProduct: React.FC = () => {
  const [openPreviewArea, setOpenPreviewArea] = useState(false);
  const [productListUpdated, setProducts] = useState<any>();
  const [editSent, setEditSent] = useState(false);

  const [mainImageUrl, setMainImageUrl] = useState<string>("");
  const [ambianceUrls, setAmbianceUrls] = useState<string[]>([]);
  const [descriptionUrls, setDescriptionUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState({ main: false, ambiance: false, description: false });

  const [editproductModel, setEditProductModel] = useState<ProductModel>(EMPTY_PRODUCT);
  const [reviewInput, setReviewInput] = useState<string>("");

  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const qID = new URLSearchParams(location.search).get("id") ?? "";
  const ID = ((params.id as string) || qID) ?? "";

  const resetForm = () => {
    setEditProductModel(EMPTY_PRODUCT);
    setMainImageUrl("");
    setAmbianceUrls([]);
    setDescriptionUrls([]);
    setOpenPreviewArea(false);
    setProducts(undefined);
    setReviewInput("");
  };

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    let v: string = value;
    if (type === "checkbox" && "checked" in e.target) v = e.target.checked ? "true" : "false";
    setEditProductModel((prev) => ({ ...prev, [name]: v }));
  };

  const benefitsHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = e.target;
    setEditProductModel((prev) => ({
      ...prev,
      ULbeneficii: value.split(",").map((s) => s.trim()).filter(Boolean) as any,
    }));
  };

  const addReview = () => {
    if (!reviewInput.trim()) return;
    
    const newReview = {
      rating: 5, // Default 5 stars
      comment: reviewInput.trim(),
      date: new Date().toISOString(),
      reviewer: "Admin" // Or you can add an input for reviewer name
    };

    setEditProductModel((prev) => ({
      ...prev,
      reviews: {
        ...prev.reviews,
        [Date.now().toString()]: newReview
      }
    }));
    
    setReviewInput("");
  };

  const removeReview = (reviewId: string) => {
    setEditProductModel((prev) => {
      const newReviews = { ...prev.reviews };
      delete newReviews[reviewId];
      return { ...prev, reviews: newReviews };
    });
  };

  const folderBase = toSlug(editproductModel.ID || editproductModel.title || "produs");

  const uploadOne = async (file: File, folder: "main" | "ambiance" | "description") => {
    const path = `products/${folderBase}/${folder}/${Date.now()}-${file.name}`;
    const r = ref(storage, path);
    await uploadBytes(r, file);
    return await getDownloadURL(r);
  };

  const uploadMany = async (files: FileList, folder: "ambiance" | "description") => {
    const arr = Array.from(files);
    return await Promise.all(arr.map((f) => uploadOne(f, folder)));
  };

  const onMainImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading((u) => ({ ...u, main: true }));
      const url = await uploadOne(file, "main");
      setMainImageUrl(url);
    } finally {
      setUploading((u) => ({ ...u, main: false }));
      e.target.value = "";
    }
  };

  const onAmbianceFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setUploading((u) => ({ ...u, ambiance: true }));
      const urls = await uploadMany(files, "ambiance");
      setAmbianceUrls((prev) => [...prev, ...urls]);
    } finally {
      setUploading((u) => ({ ...u, ambiance: false }));
      e.target.value = "";
    }
  };

  const onDescriptionFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setUploading((u) => ({ ...u, description: true }));
      const urls = await uploadMany(files, "description");
      setDescriptionUrls((prev) => [...prev, ...urls]);
    } finally {
      setUploading((u) => ({ ...u, description: false }));
      e.target.value = "";
    }
  };

  const removeAmbianceAt = (i: number) => setAmbianceUrls((xs) => xs.filter((_, idx) => idx !== i));
  const removeDescriptionAt = (i: number) => setDescriptionUrls((xs) => xs.filter((_, idx) => idx !== i));

  const submitAddOperation = async () => {
    const combinedImages = [mainImageUrl, ...ambianceUrls, ...descriptionUrls].filter(Boolean);
    const currentID = (editproductModel.ID || toSlug(editproductModel.title)).trim();
    if (!currentID) {
      alert("Setează un ID sau un titlu pentru a genera un ID.");
      return;
    }

    const payload: ProductModel = {
      ...editproductModel,
      ID: currentID,
      imageProduct: combinedImages,
    };

    try {
      await upsertProduct(payload);
      setEditSent(true);
      if (!ID) resetForm();
    } catch (err) {
      console.error(err);
      alert("A apărut o eroare la salvare.");
    }
  };

  useEffect(() => {
    if (!editSent) return;
    const t = setTimeout(() => setEditSent(false), 5000);
    return () => clearTimeout(t);
  }, [editSent]);

  useEffect(() => {
    const load = async () => {
      const targetId = ID?.trim();
      if (!targetId) return;
      const existing = await getProductByID(targetId);
      if (!existing) return;

      setProducts({ [targetId]: existing });
      setEditProductModel({
        ID: existing.ID ?? "",
        price: existing.price ?? "",
        discountedPrice: existing.discountedPrice ?? "",
        realStock: existing.realStock ?? "",
        realStockCheck: existing.realStockCheck ?? "",
        fakeStock: existing.fakeStock ?? "",
        fakeStockCheck: existing.fakeStockCheck ?? "",
        ULbeneficii: existing.ULbeneficii ?? [],
        firstDescription: existing.firstDescription ?? "",
        imageProduct: existing.imageProduct ?? [],
        jsonContent: existing.jsonContent ?? "",
        reviews: existing.reviews ?? {},
        shortDescription: existing.shortDescription ?? "",
        title: existing.title ?? "",
      });

      const imgs = existing.imageProduct ?? [];
      setMainImageUrl(imgs[0] || "");
      setAmbianceUrls(imgs.slice(1));
      setDescriptionUrls([]);
    };
    load();
  }, [ID]);

  const productForPreview: ProductModel = {
    ...editproductModel,
    imageProduct: [mainImageUrl, ...ambianceUrls, ...descriptionUrls].filter(Boolean),
  };

  return (
    <Container className="px-4">
      <Row>
        <Col>
          <div className={styles.editPage}>
            <div className={styles.addAreaContainer}>
              <h3>Add / Edit Product</h3>

              {/* FILE UPLOADS */}
              <div className={styles.inputContainer}>
                <Alert variant="info" className="mb-3">Încarcă imaginile de pe calculator. Linkurile NU mai sunt folosite.</Alert>

                <Row className="g-4">
                  {/* main image */}
                  <Col lg={4}>
                    <Card className="h-100 border-primary">
                      <Card.Header className="bg-primary text-white">
                        <h6 className="mb-0">Main Display Image *</h6>
                        <small>Imaginea principală</small>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group>
                          <Form.Label>Încarcă</Form.Label>
                          <Form.Control type="file" accept="image/*" onChange={onMainImageFile} disabled={uploading.main} />
                          <Form.Text className="text-muted d-block mt-1">{uploading.main ? "Se încarcă..." : "PNG/JPG"}</Form.Text>
                          {mainImageUrl && (
                            <img src={mainImageUrl} alt="main" style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 8, marginTop: 12 }} />
                          )}
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* ambiance */}
                  <Col lg={4}>
                    <Card className="h-100 border-warning">
                      <Card.Header className="bg-warning text-dark">
                        <h6 className="mb-0">Ambiance Images (Gallery)</h6>
                        <small>Poți încărca mai multe</small>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group>
                          <Form.Label>Încarcă</Form.Label>
                          <Form.Control type="file" multiple accept="image/*" onChange={onAmbianceFiles} disabled={uploading.ambiance} />
                          <Form.Text className="text-muted d-block mt-1">{uploading.ambiance ? "Se încarcă..." : "Selectează una sau mai multe"}</Form.Text>
                          <div className="mt-3 d-flex flex-wrap gap-2">
                            {ambianceUrls.map((img, i) => (
                              <Badge key={`amb-${i}`} bg="light" text="dark" className="p-0 d-inline-flex align-items-center" style={{ borderRadius: 8, overflow: "hidden" }}>
                                <img src={img} alt="amb" style={{ width: 90, height: 60, objectFit: "cover" }} />
                                <Button variant="outline-dark" size="sm" className="py-0 px-2 border-0" onClick={() => removeAmbianceAt(i)}>×</Button>
                              </Badge>
                            ))}
                          </div>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Col>

                  {/* description */}
                  <Col lg={4}>
                    <Card className="h-100 border-info">
                      <Card.Header className="bg-info text-white">
                        <h6 className="mb-0">Description Images</h6>
                        <small>Opțional — pentru conținut</small>
                      </Card.Header>
                      <Card.Body>
                        <Form.Group>
                          <Form.Label>Încarcă</Form.Label>
                          <Form.Control type="file" multiple accept="image/*" onChange={onDescriptionFiles} disabled={uploading.description} />
                          <Form.Text className="text-light d-block mt-1">{uploading.description ? "Se încarcă..." : "Opțional"}</Form.Text>
                          <div className="mt-3 d-flex flex-wrap gap-2">
                            {descriptionUrls.map((img, i) => (
                              <Badge key={`desc-${i}`} bg="light" text="dark" className="p-0 d-inline-flex align-items-center" style={{ borderRadius: 8, overflow: "hidden" }}>
                                <img src={img} alt="desc" style={{ width: 90, height: 60, objectFit: "cover" }} />
                                <Button variant="outline-dark" size="sm" className="py-0 px-2 border-0" onClick={() => removeDescriptionAt(i)}>×</Button>
                              </Badge>
                            ))}
                          </div>
                        </Form.Group>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </div>

              {/* FIELDS */}
              <div className={styles.inputContainer}>
                <div className={styles.rowSpacer}>
                  <div className={styles.inputFielder}>
                    <Form.Label htmlFor="title">Product name</Form.Label>
                    <Form.Control onChange={inputHandler} name="title" value={editproductModel.title ?? ""} />
                  </div>
                  <div className={styles.inputFielder}>
                    <Form.Label htmlFor="ID">Link ID Name</Form.Label>
                    <Form.Control onChange={inputHandler} name="ID" value={editproductModel.ID ?? ""} />
                  </div>
                  <div className={styles.inputFielder}>
                    <Form.Label htmlFor="price">Price (RON)</Form.Label>
                    <Form.Control onChange={inputHandler} name="price" value={String(editproductModel.price ?? "")} />
                  </div>
                  <div className={styles.inputFielder}>
                    <Form.Label htmlFor="discountedPrice">Discount Price (RON)</Form.Label>
                    <Form.Control onChange={inputHandler} name="discountedPrice" value={String(editproductModel.discountedPrice ?? "")} />
                  </div>
                  <div className={styles.inputFielder}>
                    <Form.Label htmlFor="realStock">Stock Quantity</Form.Label>
                    <Form.Control 
                      type="number" 
                      onChange={inputHandler} 
                      name="realStock" 
                      value={String(editproductModel.realStock ?? "")} 
                      placeholder="Enter stock quantity"
                    />
                  </div>
                </div>

                <div className={styles.rowSpacerTextArea}>
                  <div className={styles.inputFielderTextArea}>
                    <Form.Label htmlFor="shortDescription">Short Description</Form.Label>
                    <Form.Control as="textarea" spellCheck={false} onChange={inputHandler} name="shortDescription" value={editproductModel.shortDescription ?? ""} />
                  </div>
                </div>

                <div className={styles.inputFielder}>
                  <Form.Label htmlFor="ULbeneficii">Beneficii (separate prin virgulă)</Form.Label>
                  <Form.Control
                    as="textarea"
                    spellCheck={false}
                    onChange={benefitsHandler}
                    name="ULbeneficii"
                    value={(editproductModel.ULbeneficii ?? []).join(", ")}
                  />
                </div>

                {/* Reviews Section */}
                <div className={styles.inputFielder}>
                  <Form.Label htmlFor="reviews">Add Review (5 stars)</Form.Label>
                  <div className={styles.reviewInputContainer}>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Enter review comment..."
                      value={reviewInput}
                      onChange={(e) => setReviewInput(e.target.value)}
                    />
                    <Button 
                      className={styles.addReviewButton} 
                      onClick={addReview}
                      disabled={!reviewInput.trim()}
                    >
                      Add 5-Star Review
                    </Button>
                  </div>
                  
                  {/* Display existing reviews */}
                  {editproductModel.reviews && Object.keys(editproductModel.reviews).length > 0 && (
                    <div className={styles.reviewsList}>
                      <h6>Current Reviews:</h6>
                      {Object.entries(editproductModel.reviews).map(([reviewId, review]: [string, any]) => (
                        <div key={reviewId} className={styles.reviewItem}>
                          <div className={styles.reviewHeader}>
                            <span className={styles.stars}>★★★★★</span>
                            <span className={styles.reviewer}>{review.reviewer || "Anonymous"}</span>
                            <Button 
                              variant="outline-danger" 
                              size="sm" 
                              onClick={() => removeReview(reviewId)}
                              className={styles.removeReviewBtn}
                            >
                              ×
                            </Button>
                          </div>
                          <p className={styles.reviewComment}>{review.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.editorElement}>
                  <Form.Label htmlFor="jsonContent">Full description HTML</Form.Label>
                  <Form.Control as="textarea" spellCheck={false} onChange={inputHandler} name="jsonContent" value={String(editproductModel.jsonContent ?? "")} />
                </div>

                <div className={styles.actionControl}>
                  <Button className={styles.saveButton} onClick={submitAddOperation}>SAVE</Button>
                  <Button variant="secondary" onClick={() => setOpenPreviewArea(true)} className={styles.previewButton}>PREVIEW</Button>
                  <Button variant="outline-secondary" onClick={() => navigate("/admin/manage-product")} className={styles.cancelButton}>CANCEL</Button>
                </div>

                <div className={styles.dialogSpace}>
                  {editSent && <p className={styles.confirmationSaveText}>Modificarile au avut loc!</p>}
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {openPreviewArea && (
        <ProductPreview
          ID={ID || editproductModel.ID}
          productListUpdated={{ [ID || editproductModel.ID]: productForPreview }}
        />
      )}
    </Container>
  );
};

export default EditProduct;