import React from "react";
import { Container, Row, Col, Card, Table } from "react-bootstrap";
import RangeDatePicker from "../components/common/RangeDatePicker";
import PageTitle from "../components/common/PageTitle";

const Tables: React.FC = () => (
  <Container fluid className="px-4">
    <Row className="py-4">
      <PageTitle sm="4" title="Lista comenzi" subtitle="Orders List" className="text-sm-left" />
    </Row>
    <Row className="mb-3">
      <RangeDatePicker />
    </Row>
    <Row>
      <Col>
        <Card className="mb-4">
          <Card.Header>
            <h6 className="m-0">Active Users</h6>
          </Card.Header>
          <Card.Body className="p-0">
            <Table responsive hover className="mb-0 align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Country</th>
                  <th>City</th>
                  <th>Phone</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>1</td>
                  <td>Ali</td>
                  <td>Kerry</td>
                  <td>Russian Federation</td>
                  <td>Gdańsk</td>
                  <td>107-0339</td>
                </tr>
                <tr>
                  <td>2</td>
                  <td>Clark</td>
                  <td>Angela</td>
                  <td>Estonia</td>
                  <td>Borghetto di Vara</td>
                  <td>1-660-850-1647</td>
                </tr>
                <tr>
                  <td>3</td>
                  <td>Jerry</td>
                  <td>Nathan</td>
                  <td>Cyprus</td>
                  <td>Braunau am Inn</td>
                  <td>214-4225</td>
                </tr>
                <tr>
                  <td>4</td>
                  <td>Colt</td>
                  <td>Angela</td>
                  <td>Liberia</td>
                  <td>Bad Hersfeld</td>
                  <td>1-848-473-7416</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
);

export default Tables;
