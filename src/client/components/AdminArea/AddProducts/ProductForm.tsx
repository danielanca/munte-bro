import React from "react";
import { Row, Col, Form, Button, Badge, InputGroup, Card, Alert } from "react-bootstrap";
import type { ProductFormProps } from "./EditProductTypes";
import { toSlug, splitToArray, arrayTextDraft } from "./EditProductHelpers";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

const storage = getStorage(); // uses your default initialized Firebase app

const safeStr = (v: unknown) => (typeof v === "string" ? v : "");
const safeNum = (v: unknown) => (Number.isFinite(Number(v)) ? Number(v) : 0);
const safeBool = (v: unknown) => (typeof v === "boolean" ? v : false);
const safeArr = <T,>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

const ProductForm: React.FC<ProductFormProps> = ({
  model,
  setModel,
  setField,
  isValid,
  saving,
  onCancel,
  onPreview,
  onSubmit,
}) => {
  // normalize so UI never crashes
  const title = safeStr(model.title);
  const productCode = safeStr(model.productCode);
  const category = safeStr(model.category);
  const ID = safeStr(model.ID);
  const treatmentDuration = safeStr(model.treatmentDuration);

  const price = safeNum(model.price);
  const discountedPrice = safeNum(model.discountedPrice);
  const realStock = safeNum(model.realStock);
  const fakeStock = safeNum(model.fakeStock);
  const realStockCheck = safeBool(model.realStockCheck);
  const fakeStockCheck = safeBool(model.fakeStockCheck);

  const shortDescription = safeStr(model.shortDescription);
  const firstDescription = safeStr(model.firstDescription);
  const usageInstructions = safeStr(model.usageInstructions);
  const ingredients = safeStr(model.ingredients);
  const precautions = safeStr(model.precautions);
  const jsonContent = safeStr(model.jsonContent);

  const mainImage = safeStr(model.mainImage as any);
  const ambianceImages = safeArr<string>(model.ambianceImages);
  const descriptionImages = safeArr<string>(model.descriptionImages);
  const ULbeneficii = safeArr<string>(model.ULbeneficii);

  const [uploading, setUploading] = React.useState({
    main: false,
    ambiance: false,
    description: false,
  });

  const uploadOne = async (file: File, folder: string) => {
    const id = ID || toSlug(title) || "temp";
    const path = `products/${id}/${folder}/${Date.now()}-${file.name}`;
    const r = ref(storage, path);
    await uploadBytes(r, file);
    return await getDownloadURL(r);
  };

  const uploadMany = async (files: FileList, folder: string) => {
    const arr = Array.from(files);
    const urls = await Promise.all(arr.map((f) => uploadOne(f, folder)));
    return urls;
  };

  // text / number / checkbox / arrays (for ULbeneficii etc.)
  const onText = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setField(name as keyof typeof model, value ?? "");
    if (name === "title" && !model.ID) setField("ID", toSlug(value));
  };
  const onNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const n = Number(value);
    setField(name as keyof typeof model, Number.isFinite(n) ? n : 0);
  };
  const onCheckbox = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setField(name as keyof typeof model, !!checked);
  };
  const onArray = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setField(name as keyof typeof model, splitToArray(value)); // still useful for ULbeneficii, comma-separated
  };

  // FILE UPLOAD HANDLERS
  const onMainImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setUploading((u) => ({ ...u, main: true }));
      const url = await uploadOne(file, "main");
      setField("mainImage", url);
    } finally {
      setUploading((u) => ({ ...u, main: false }));
      e.target.value = ""; // reset input
    }
  };

  const onAmbianceFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setUploading((u) => ({ ...u, ambiance: true }));
      const urls = await uploadMany(files, "ambiance");
      setField("ambianceImages", [...ambianceImages, ...urls]);
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
      setField("descriptionImages", [...descriptionImages, ...urls]);
    } finally {
      setUploading((u) => ({ ...u, description: false }));
      e.target.value = "";
    }
  };

  const removeChip = (
    field: "ambianceImages" | "descriptionImages",
    idx: number
  ) =>
    setModel((prev) => ({
      ...prev,
      [field]: safeArr<string>((prev as any)[field]).filter((_, i) => i !== idx),
    }));

  return (
    <>
      <Alert variant="info" className="mb-4">
        <strong>Imagini:</strong> Alege fișierele de pe calculator. Se încarcă în Firebase Storage și se
        atașează automat produsului. <em>Nu mai lipim linkuri.</em>
      </Alert>

      {/* Basic Product Information */}
      <Row className="g-3 mt-1">
        <Col lg={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Product name *</Form.Label>
            <Form.Control
              name="title"
              value={title}
              onChange={onText}
              placeholder="Nume produs"
              className="form-control-lg"
            />
          </Form.Group>
        </Col>
        <Col lg={3}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Product Code *</Form.Label>
            <Form.Control
              name="productCode"
              value={productCode}
              onChange={onText}
              placeholder="ex: C80"
            />
          </Form.Group>
        </Col>
        <Col lg={3}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Category *</Form.Label>
            <Form.Control
              name="category"
              value={category}
              onChange={onText}
              placeholder="ex: Sare De Baie"
            />
          </Form.Group>
        </Col>
      </Row>

      <Row className="g-3 mt-1">
        <Col lg={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Link ID (slug)</Form.Label>
            <Form.Control
              name="ID"
              value={ID}
              onChange={onText}
              placeholder="ex: sare-de-baie-lime"
            />
            <Form.Text className="text-muted">
              Dacă lași gol, se generează automat din titlu:{" "}
              <code>{toSlug(title) || "—"}</code>
            </Form.Text>
          </Form.Group>
        </Col>
        <Col lg={6}>
          <Form.Group className="mb-3">
            <Form.Label className="fw-semibold">Treatment Duration</Form.Label>
            <Form.Control
              name="treatmentDuration"
              value={treatmentDuration}
              onChange={onText}
              placeholder="ex: 6 Luni"
            />
          </Form.Group>
        </Col>
      </Row>

      {/* FILE UPLOAD SECTIONS */}
      <Row className="g-4 mt-3">
        {/* Main Display Image */}
        <Col lg={4}>
          <Card className="h-100 border-primary">
            <Card.Header className="bg-primary text-white">
              <h6 className="mb-0">Main Display Image *</h6>
              <small>Imaginea principală a produsului</small>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Încarcă imagine</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={onMainImageFile}
                  disabled={uploading.main}
                />
                <Form.Text className="text-muted d-block mt-1">
                  {uploading.main ? "Se încarcă..." : "PNG/JPG, ~5–8MB ok"}
                </Form.Text>

                {mainImage && (
                  <div className="mt-3">
                    <img
                      src={mainImage}
                      alt="Main"
                      style={{ width: "100%", maxHeight: 220, objectFit: "cover", borderRadius: 8 }}
                    />
                  </div>
                )}
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* Ambiance Gallery Images */}
        <Col lg={4}>
          <Card className="h-100 border-warning">
            <Card.Header className="bg-warning text-dark">
              <h6 className="mb-0">Ambiance Images (Gallery)</h6>
              <small>Poți încărca mai multe</small>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Încarcă imagini</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onAmbianceFiles}
                  disabled={uploading.ambiance}
                />
                <Form.Text className="text-muted d-block mt-1">
                  {uploading.ambiance ? "Se încarcă..." : "Selectează una sau mai multe imagini"}
                </Form.Text>

                <div className="mt-3 d-flex flex-wrap gap-2">
                  {ambianceImages.map((img, i) => (
                    <Badge
                      key={`amb-${i}`}
                      bg="light"
                      text="dark"
                      className="p-0 d-inline-flex align-items-center"
                      style={{ borderRadius: 8, overflow: "hidden" }}
                    >
                      <img
                        src={img}
                        alt="amb"
                        style={{ width: 90, height: 60, objectFit: "cover" }}
                      />
                      <Button
                        variant="outline-dark"
                        size="sm"
                        className="py-0 px-2 border-0"
                        onClick={() => removeChip("ambianceImages", i)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>

        {/* Description Images */}
        <Col lg={4}>
          <Card className="h-100 border-info">
            <Card.Header className="bg-info text-white">
              <h6 className="mb-0">Description Images</h6>
              <small>Imagini pentru zona de descriere</small>
            </Card.Header>
            <Card.Body>
              <Form.Group>
                <Form.Label>Încarcă imagini</Form.Label>
                <Form.Control
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={onDescriptionFiles}
                  disabled={uploading.description}
                />
                <Form.Text className="text-light d-block mt-1">
                  {uploading.description ? "Se încarcă..." : "Opțional — pentru conținutul paginii"}
                </Form.Text>

                <div className="mt-3 d-flex flex-wrap gap-2">
                  {descriptionImages.map((img, i) => (
                    <Badge
                      key={`desc-${i}`}
                      bg="light"
                      text="dark"
                      className="p-0 d-inline-flex align-items-center"
                      style={{ borderRadius: 8, overflow: "hidden" }}
                    >
                      <img
                        src={img}
                        alt="desc"
                        style={{ width: 90, height: 60, objectFit: "cover" }}
                      />
                      <Button
                        variant="outline-dark"
                        size="sm"
                        className="py-0 px-2 border-0"
                        onClick={() => removeChip("descriptionImages", i)}
                      >
                        ×
                      </Button>
                    </Badge>
                  ))}
                </div>
              </Form.Group>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Prices & Stock */}
      <Row className="g-3 mt-3">
        <Col lg={3}>
          <Form.Group>
            <Form.Label className="fw-semibold">Price (RON) *</Form.Label>
            <InputGroup>
              <Form.Control type="number" name="price" value={price} onChange={onNumber} min={0} />
              <InputGroup.Text>RON</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col lg={3}>
          <Form.Group>
            <Form.Label className="fw-semibold">Discount Price (RON)</Form.Label>
            <InputGroup>
              <Form.Control type="number" name="discountedPrice" value={discountedPrice} onChange={onNumber} min={0} />
              <InputGroup.Text>RON</InputGroup.Text>
            </InputGroup>
          </Form.Group>
        </Col>
        <Col lg={3}>
          <Form.Group>
            <Form.Label className="fw-semibold">Real Stock</Form.Label>
            <Form.Control type="number" name="realStock" value={realStock} onChange={onNumber} min={0} />
          </Form.Group>
          <Form.Check
            className="mt-2"
            type="switch"
            id="realStockCheck"
            label="Use Real Stock"
            name="realStockCheck"
            checked={realStockCheck}
            onChange={onCheckbox}
          />
        </Col>
        <Col lg={3}>
          <Form.Group>
            <Form.Label className="fw-semibold">Fake Stock</Form.Label>
            <Form.Control type="number" name="fakeStock" value={fakeStock} onChange={onNumber} min={0} />
          </Form.Group>
          <Form.Check
            className="mt-2"
            type="switch"
            id="fakeStockCheck"
            label="Use Fake Stock"
            name="fakeStockCheck"
            checked={fakeStockCheck}
            onChange={onCheckbox}
          />
        </Col>
      </Row>

      {/* Descriptions */}
      <Row className="g-3 mt-3">
        <Col lg={6}>
          <Form.Group>
            <Form.Label className="fw-semibold">Short Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="shortDescription"
              value={shortDescription}
              onChange={onText}
              spellCheck={false}
              placeholder="Scurt rezumat pentru lista de produse..."
            />
          </Form.Group>
        </Col>
        <Col lg={6}>
          <Form.Group>
            <Form.Label className="fw-semibold">First Description *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="firstDescription"
              value={firstDescription}
              onChange={onText}
              spellCheck={false}
              placeholder="Descrierea principală de sus a paginii..."
            />
          </Form.Group>
        </Col>
      </Row>

      {/* Benefits */}
      <Row className="g-3 mt-1">
        <Col lg={12}>
          <Form.Group className="mb-2">
            <Form.Label className="fw-semibold">Benefits (ULbeneficii)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="hidratare, relaxare, detoxifiere... (separate prin virgulă)"
              value={arrayTextDraft(ULbeneficii)}
              onChange={onArray}
              name="ULbeneficii"
              spellCheck={false}
            />
            <div className="mt-2 d-flex flex-wrap gap-2">
              {ULbeneficii.map((b, i) => (
                <Badge bg="light" text="dark" key={`${b}-${i}`} className="px-2 py-2 d-inline-flex align-items-center">
                  <span className="me-2">{b}</span>
                  {/* keep simple remove here if needed */}
                </Badge>
              ))}
            </div>
          </Form.Group>
        </Col>
      </Row>

      {/* Product Details */}
      <Row className="g-3 mt-1">
        <Col lg={6}>
          <Form.Group>
            <Form.Label className="fw-semibold">Usage Instructions</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="usageInstructions"
              value={usageInstructions}
              onChange={onText}
              spellCheck={false}
              placeholder="Mod de utilizare, durata băii, frecvență..."
            />
          </Form.Group>
        </Col>
        <Col lg={6}>
          <Form.Group>
            <Form.Label className="fw-semibold">Ingredients</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              name="ingredients"
              value={ingredients}
              onChange={onText}
              spellCheck={false}
              placeholder="Ingredientele produsului..."
            />
          </Form.Group>
        </Col>
      </Row>

      <Form.Group className="mt-3">
        <Form.Label className="fw-semibold">Precautions & Contraindications</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="precautions"
          value={precautions}
          onChange={onText}
          spellCheck={false}
          placeholder="Contraindicații, măsuri de precauție..."
        />
      </Form.Group>

      {/* Full HTML Description */}
      <Form.Group className="mt-4">
        <Form.Label className="fw-semibold">Full description HTML</Form.Label>
        <Form.Control
          as="textarea"
          rows={8}
          name="jsonContent"
          value={jsonContent}
          onChange={onText}
          spellCheck={false}
          placeholder="<h2>...</h2> <ul>...</ul>"
        />
        <Form.Text className="text-muted">
          Poți lipi HTML-ul complet cu descrieri detaliate.
        </Form.Text>
      </Form.Group>

      {/* Action Buttons */}
      <div className="d-flex justify-content-end gap-2 mt-4 p-3 bg-light rounded">
        <Button variant="outline-secondary" onClick={onCancel} size="lg">
          Cancel
        </Button>
        <Button variant="outline-primary" onClick={onPreview} size="lg">
          Preview
        </Button>
        <Button onClick={onSubmit} disabled={!isValid || saving} size="lg" className="px-4">
          {saving ? "Saving..." : "Save Product"}
        </Button>
      </div>
    </>
  );
};

export default ProductForm;
