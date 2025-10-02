import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { CuponModel } from "../../utils/OrderInterfaces";
import { addCupon } from "../../services/emails";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";

type RouteParams = { id?: string };

const EMPTY_COUPON: CuponModel = {
  ID: "",
  cuponCode: "",
  cuponDiscount: 0,
};

const EditCupon: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<RouteParams>();
  const [model, setModel] = useState<CuponModel>(EMPTY_COUPON);

  useEffect(() => {
    if (id) setModel((m) => ({ ...m, ID: id }));
  }, [id]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "cuponDiscount") {
      const n = value.trim() === "" ? 0 : Number(value);
      setModel((m) => ({ ...m, cuponDiscount: Number.isFinite(n) ? n : 0 }));
    } else {
      setModel((m) => ({ ...m, [name]: value }));
    }
  };

  const canSave = useMemo(() => {
    return String(model.ID).trim() !== "" && String(model.cuponCode).trim() !== "" && model.cuponDiscount >= 0;
  }, [model]);

  const onSubmit = async () => {
    if (!canSave) return;
    await addCupon(model);
    navigate("/admin/cupondiscount");
  };

  const onCancel = () => navigate("/admin/cupondiscount");

  return (
    <Container className="px-4 py-3">
      <Row className="justify-content-center">
        <Col md={8} lg={6}>
          <Card>
            <Card.Header as="h5">Add Cupon</Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3" controlId="ID">
                  <Form.Label>Link ID Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="ID"
                    placeholder="ex: SUMMER24"
                    value={String(model.ID)}
                    onChange={onChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="cuponCode">
                  <Form.Label>Cupon Code</Form.Label>
                  <Form.Control
                    type="text"
                    name="cuponCode"
                    placeholder="ex: DINMUNTE1"
                    value={String(model.cuponCode)}
                    onChange={onChange}
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="cuponDiscount">
                  <Form.Label>Cupon Discount (%)</Form.Label>
                  <Form.Control
                    type="number"
                    name="cuponDiscount"
                    min={0}
                    step={1}
                    placeholder="ex: 10"
                    value={Number.isFinite(model.cuponDiscount) ? model.cuponDiscount : 0}
                    onChange={onChange}
                  />
                </Form.Group>

                <div className="d-flex gap-2">
                  <Button variant="primary" onClick={onSubmit} disabled={!canSave}>
                    Save
                  </Button>
                  <Button variant="outline-secondary" onClick={onCancel}>
                    Cancel
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditCupon;
