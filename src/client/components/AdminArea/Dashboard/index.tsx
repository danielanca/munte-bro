// src/client/components/AdminArea/Dashboard/index.tsx
import React from "react";
import { Row, Col, Card, Breadcrumb } from "react-bootstrap";
import styles from "./Dashboard.module.scss";

const Dashboard: React.FC = () => {
  return (
    <div className={`page-content ${styles.background}`}>
      <Row>
        <Col xs={12}>
          <div className="page-title-box d-flex align-items-center justify-content-between">
            <h3 className={styles.adminText}>PANOUL ADMIN MONTANAIR.RO</h3>
            <div className="page-title-right">
              <Breadcrumb className="m-0">
                <Breadcrumb.Item active>Bine ai venit,</Breadcrumb.Item>
              </Breadcrumb>
            </div>
          </div>
        </Col>
      </Row>

      <Row>
        <Col lg={3}>
          <Card>
            <Card.Body>
              <div className={styles.productsWrap}>
                <h3>PRODUCT LISTS</h3>
                <a href="/admin/products">
                  <button>PRODUCTS PAGE</button>
                </a>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} />
        <Col lg={3} />
      </Row>

      <Row>{/* <LatestTransaction /> */}</Row>
    </div>
  );
};

export default Dashboard;
