import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Container, 
  Row, 
  Col, 
  Card, 
  Form, 
  Button,
  Alert 
} from "react-bootstrap";

import { CuponModel } from "../../utils/OrderInterfaces";
import { getData } from "../../data/ProdFetch";
import { updateCupon } from "../../services/emails";
import styles from "./EditProduct.module.scss";

const EditCupon: React.FC = () => {
  const [openPreviewArea, setOpenPreviewArea] = useState<boolean>(false);
  const params = useParams<{ id: string }>();
  const ID: string = params.id ?? "";
  const [cuponListUpdated, setCupons] = useState<CuponModel[] | null>(null);
  const [editSent, setEditSent] = useState<boolean>(false);
  const [editCuponModel, setEditCuponModel] = useState<CuponModel>({
    ID: "",
    cuponCode: "",
    cuponDiscount: 0
  });

  const navigate = useNavigate();

  const inputHandler = (data: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = data.target;
    setEditCuponModel((prevFormData) => {
      return { 
        ...prevFormData, 
        [name]: name === "cuponDiscount" ? Number(value) : value 
      };
    });
  };

  const submitEditOperation = (): void => {
    setEditSent(true);
    if (editCuponModel.cuponCode.trim() !== "") {
      updateCupon(editCuponModel).then((response) => {
        console.log("EDIT process sent to Cloud!");
      }).catch((error) => {
        console.error("Error updating cupon:", error);
      });
    }
  };

  const previewOperation = (): void => {
    setOpenPreviewArea((prevState) => !prevState);
  };

  useEffect(() => {
    if (editSent) {
      const timer = setTimeout(() => {
        setEditSent(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [editSent]);

  const cancelOperation = (): void => {
    navigate("/admin/cupondiscount");
  };

  useEffect(() => {
    if (cuponListUpdated === null && ID) {
      getData(ID).then((finalData: CuponModel[]) => {
        setCupons(finalData);
      }).catch((error) => {
        console.error("Error fetching cupon data:", error);
      });
    }
  }, [cuponListUpdated, ID]);

  useEffect(() => {
    if (cuponListUpdated !== null && cuponListUpdated !== undefined && ID) {
      const cupon = cuponListUpdated[ID as keyof typeof cuponListUpdated];
      if (cupon) {
        setEditCuponModel(cupon as CuponModel);
      }
    }
  }, [cuponListUpdated, ID]);

  return (
    <Container fluid className="main-content-container px-4">
      <Row className="page-header py-4">
        <Col>
          <h2 className="mb-0">Edit Cupon</h2>
          <p className="text-muted">Manage your cupon details</p>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <div className={styles.editPage}>
            {cuponListUpdated !== null ? (
              <Card>
                <Card.Header>
                  <h5 className="mb-0">Edit Cupon Details</h5>
                </Card.Header>
                <Card.Body>
                  <Form>
                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="ID">
                            <strong>Link ID Name:</strong>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="ID"
                            value={editCuponModel.ID}
                            onChange={inputHandler}
                            readOnly
                            plaintext
                            className="bg-light"
                          />
                          <Form.Text className="text-muted">
                            This field cannot be modified
                          </Form.Text>
                        </Form.Group>
                      </Col>
                      
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label htmlFor="cuponCode">
                            <strong>Cupon Code *</strong>
                          </Form.Label>
                          <Form.Control
                            type="text"
                            name="cuponCode"
                            value={editCuponModel.cuponCode}
                            onChange={inputHandler}
                            placeholder="Enter cupon code"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-4">
                          <Form.Label htmlFor="cuponDiscount">
                            <strong>Cupon Discount (%) *</strong>
                          </Form.Label>
                          <Form.Control
                            type="number"
                            name="cuponDiscount"
                            value={editCuponModel.cuponDiscount}
                            onChange={inputHandler}
                            placeholder="Enter discount percentage"
                            min="0"
                            max="100"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <div className={styles.actionControl}>
                      <Button 
                        variant="primary" 
                        onClick={submitEditOperation}
                        className="me-2"
                        disabled={!editCuponModel.cuponCode.trim()}
                      >
                        SAVE CHANGES
                      </Button>
                      <Button 
                        variant="outline-secondary" 
                        onClick={cancelOperation}
                      >
                        CANCEL
                      </Button>
                    </div>

                    {editSent && (
                      <Alert variant="success" className="mt-3">
                        Changes have been saved successfully!
                      </Alert>
                    )}
                  </Form>
                </Card.Body>
              </Card>
            ) : (
              <Card>
                <Card.Body className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2">Loading cupon data...</p>
                </Card.Body>
              </Card>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EditCupon;