// TopProduct.tsx
import React from "react";
import { Card, Dropdown, Row, Col, ProgressBar } from "react-bootstrap";

type Variant =
  | "primary"
  | "success"
  | "info"
  | "warning"
  | "secondary"; // used for "purple"

type ProductStat = {
  id: number;
  title: string;
  value: number; // 0–100
  color: "primary" | "info" | "success" | "warning" | "purple";
};

const toBsVariant = (c: ProductStat["color"]): Variant =>
  c === "purple" ? "secondary" : (c as Variant);

const toTextClass = (c: ProductStat["color"]): string =>
  `text-${c === "purple" ? "secondary" : c}`;

const TopProduct: React.FC = () => {
  const progressbars: ProductStat[] = [
    { id: 1, title: "Desktops", value: 52, color: "primary" },
    { id: 2, title: "iPhones", value: 45, color: "info" },
    { id: 3, title: "Android", value: 48, color: "success" },
    { id: 4, title: "Tablets", value: 78, color: "warning" },
    { id: 5, title: "Cables", value: 63, color: "purple" },
  ];

  return (
    <Card>
      <Card.Body>
        <div className="float-end">
          <Dropdown align="end">
            <Dropdown.Toggle as="a" className="text-reset" id="dropdownMenuButton5">
              <span className="fw-semibold">Sort By:</span>{" "}
              <span className="text-muted">
                Yearly<i className="mdi mdi-chevron-down ms-1" />
              </span>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item href="#">Monthly</Dropdown.Item>
              <Dropdown.Item href="#">Yearly</Dropdown.Item>
              <Dropdown.Item href="#">Weekly</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <h4 className="card-title mb-4">Top Selling Products</h4>

        {progressbars.map((p) => (
          <Row className="align-items-center g-0 mt-3" key={p.id}>
            <Col sm={3}>
              <p className="text-truncate mt-1 mb-0">
                <i className={`mdi mdi-circle-medium ${toTextClass(p.color)} me-2`} />
                {p.title}
              </p>
            </Col>
            <Col sm={9}>
              <div className="mt-1" style={{ height: 6 }}>
                <ProgressBar now={p.value} variant={toBsVariant(p.color)} style={{ height: 6 }} />
              </div>
            </Col>
          </Row>
        ))}
      </Card.Body>
    </Card>
  );
};

export default TopProduct;
