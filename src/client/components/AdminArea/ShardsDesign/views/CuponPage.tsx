import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import { getCuponData } from "../../../../data/CuponFetch";

type Cupon = {
  ID: string;
  cuponCode: string;
  cuponDiscount: number | string;
  // add any other fields you actually use later
};

type CuponMap = Record<string, Cupon>;

const toArray = (data: Cupon[] | CuponMap | null | undefined): Cupon[] => {
  if (!data) return [];
  return Array.isArray(data) ? data : Object.values(data);
};

const CuponPage: React.FC = () => {
  const [cuponsOnline, setCuponsOnline] = useState<Cupon[] | CuponMap | null>(null);
  const cupons = useMemo(() => toArray(cuponsOnline), [cuponsOnline]);

  const [deleteState, setDeleteState] = useState<{ id?: string; name?: string } | null>(null);

  useEffect(() => {
    (async () => {
      const finalData = await getCuponData();
      setCuponsOnline(finalData as Cupon[] | CuponMap);
    })();
  }, []);

  const handleDeleteClick = (c: Cupon) => {
    setDeleteState({ id: c.ID, name: c.ID });
    // example call (uncomment when your API is ready):
    // deleteCuponApi(c.ID).then(() => setCuponsOnline(prev => toArray(prev).filter(x => x.ID !== c.ID)));
  };

  return (
    <Container fluid className="px-4 py-3">
      <Row className="align-items-center mb-3">
        <Col>
          <h5 className="m-0">View &amp; Edit Cupons List</h5>
        </Col>
        <Col className="text-start text-lg-end mt-2 mt-lg-0">
          <Link to="/admin/cupondiscount/add">
            <Button size="sm" variant="primary">Add Cupon</Button>
          </Link>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Header>
              <strong>Cupon List</strong>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Cupon Code</th>
                    <th>Cupon Discount</th>
                    {/* <th>Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {cupons.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="text-center py-4">No cupons found.</td>
                    </tr>
                  ) : (
                    cupons.map((item) => (
                      <tr key={item.ID}>
                        <td className="fw-semibold">
                          <a className="text-decoration-none" href={`/produs/${item.ID}`}>{item.ID}</a>
                        </td>
                        <td>{item.cuponCode}</td>
                        <td>{Number(item.cuponDiscount)} %</td>
                        {/* <td>
                          <Link to={`/admin/cupondiscount/edit/${item.ID}`}>
                            <Button size="sm" variant="outline-primary" className="me-2">Edit</Button>
                          </Link>
                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => handleDeleteClick(item)}
                          >
                            Delete
                          </Button>
                        </td> */}
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Example delete feedback (simple, no Modal) */}
      {deleteState?.id && (
        <div className="alert alert-warning mt-2 py-2">
          Selected for deletion: <strong>{deleteState.name}</strong>
        </div>
      )}
    </Container>
  );
};

export default CuponPage;
