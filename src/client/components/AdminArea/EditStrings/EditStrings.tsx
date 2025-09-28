// @ts-nocheck
import React, { useEffect, useState } from "react";
import TableView from "./TableView";
import { Row, Container, Col, Card } from "shards-react";
import PageTitle from "../ShardsDesign/components/common/PageTitle";
import styles from "./EditStrings.module.scss";

const EditStrings = () => {
  let fetchList = ["categoriesList", "FAQ", "legalInfo"];

  return (
    <Container fluid className="main-content-container px-4">
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Product List" subtitle={`Product`} className="text-sm-left" />
      </Row>
      <Row>
        <Col>
          <Card small className="mb-4">
            <div className={styles.editStringsPage}>
              {fetchList.map((item) => (
                <TableView tableID={item} />
              ))}
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditStrings;
