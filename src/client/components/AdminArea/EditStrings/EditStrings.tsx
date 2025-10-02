// EditStrings.tsx
import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import TableView from "./TableView";
import styles from "./EditStrings.module.scss";

const EditStrings: React.FC = () => {
  const fetchList = ["categoriesList", "FAQ", "legalInfo"];

  return (
    <Container fluid className="px-4">
      <Row className="py-4">
        <Col sm="4">
          <h2 className="mb-0">Product List</h2>
          <div className="text-muted">Product</div>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Body className={styles.editStringsPage}>
              {fetchList.map((item) => (
                <TableView key={item} tableID={item} />
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditStrings;
