import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Table, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import PageTitle from "../components/common/PageTitle";
import PopModal from "../../PopModal";
// ⬇️ switch to Firestore services
import { listProducts, deleteProductByID } from "../../../../services/products";
import EditProduct from "../../AddProductNew";
// render edit on same route when query present

type Product = {
  ID: string | number;
  title: string;
  price: number | string;
  imageProduct?: Iterable<string> | string[];
};

type DeleteState = { productInfo: string | null; productLink: string | number | null; popUp: boolean };

const tableTypes = ["Image", "Name", "Price", "Actions"];

const ProductsPage: React.FC = () => {
  const [productsOnline, setProductsOnline] = useState<Product[] | Record<string, Product> | null>(null);
  const [delPopUp, setDeletePopup] = useState<DeleteState>({ productInfo: null, productLink: null, popUp: false });

  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const editId = search.get("id");
  const isCreate = search.get("new") === "1";

  useEffect(() => {
    (async () => {
      const finalData = await listProducts();   // ⬅️ pull from Firestore
      setProductsOnline(finalData as any);
    })();
  }, []);

  const products: Product[] = useMemo(() => {
    if (!productsOnline) return [];
    return Array.isArray(productsOnline) ? productsOnline : Object.values(productsOnline);
  }, [productsOnline]);

  const askDelete = (p: Product) => setDeletePopup({ productInfo: String(p.title), productLink: p.ID, popUp: true });

  const dialogPopup = async (event: string, payload: string) => {
    if (event !== "modal_Event") return;
    if (payload === "YES" && delPopUp.productLink != null) {
      try {
        await deleteProductByID(String(delPopUp.productLink)); // ⬅️ delete in Firestore
        setProductsOnline((prev) => {
          const arr = Array.isArray(prev) ? prev : prev ? Object.values(prev) : [];
          return arr.filter((x) => String(x.ID) !== String(delPopUp.productLink));
        });
      } finally {
        setDeletePopup({ productInfo: null, productLink: null, popUp: false });
      }
    } else {
      setDeletePopup({ productInfo: null, productLink: null, popUp: false });
    }
  };

  // ⬇️ If query indicates add/edit, show the form on this same URL
  if (isCreate || editId) {
    return <EditProduct />;
  }

  return (
    <Container fluid className="px-4">
      {delPopUp.popUp && (
        <PopModal title={`Doresti sa stergi ${delPopUp.productInfo}?`} eventHandler={dialogPopup} />
      )}

      <Row className="py-4">
        <PageTitle sm="4" title="Product List" subtitle="View & Edit Products" className="text-sm-left" />
      </Row>

      <Row className="mb-3">
        <Col lg={5} sm={12} xs={12} className="d-sm-flex d-md-block flex-sm-row gap-2">
          <Link to="/admin/products/add?new=1">
            <Button size="sm" variant="primary">Add product</Button>
          </Link>
          <Button size="sm" variant="secondary" onClick={() => window.location.reload()}>Refresh</Button>
        </Col>
      </Row>

      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Header>
              <h6 className="m-0">Product List</h6>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    {tableTypes.map((t) => (
                      <th key={t} className="border-0">{t}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-4">No products.</td>
                    </tr>
                  ) : (
                    products.map((item) => {
                      const firstImg =
                        Array.isArray(item.imageProduct)
                          ? item.imageProduct[0]
                          : item.imageProduct
                          ? Array.from(item.imageProduct as Iterable<string>)[0]
                          : undefined;

                      return (
                        <tr key={String(item.ID)}>
                          <td>
                            {firstImg && (
                              <img
                                src={firstImg}
                                alt={String(item.title)}
                                style={{ height: 50, aspectRatio: "1/1", objectFit: "cover" }}
                                className="img-thumbnail"
                              />
                            )}
                          </td>
                          <td className="fw-semibold">
                            <a className="text-secondary text-decoration-none" href={`/produs/${item.ID}`}>
                              {item.title}
                            </a>
                          </td>
                          <td>{item.price}</td>
                          <td>
                            <div className="d-flex gap-2">
                              {/* Edit on the same route using query param */}
                              <Link to={`/admin/products/add?id=${encodeURIComponent(String(item.ID))}`}>
                                <Button size="sm" variant="primary">EDITEAZA</Button>
                              </Link>
                              <Button size="sm" variant="danger" onClick={() => askDelete(item)}>
                                STERGE
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductsPage;
