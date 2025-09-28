// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, CardHeader, CardBody } from "shards-react";
import PageTitle from "../components/common/PageTitle";
import { getData } from "../../../../data/ProdFetch";
import { Link, useLocation } from "react-router-dom";
import { deleteProduct } from "../../../../services/emails";
import PopModal from "../../PopModal";

const ProductsPage = () => {
  const [productsOnline, setProductsOnline] = useState();
  const [delPopUp, setDeletePopup] = useState({ productInfo: null, productLink: null, popUp: false });

  const deleteProduct = (data) => {
    setDeletePopup({
      productInfo: data.productToDelete.title,
      productLink: data.productToDelete.productID,
      popUp: true
    });
  };

  const dialogPopup = (event, payload) => {
    if (event === "modal_Event") {
      if (payload === "YES") {
        console.log("DELETE THE PRODUCT CALL");
      } else {
        setDeletePopup((delPopUp) => ({ ...delPopUp, productInfo: null, productLink: null, popUp: false }));
      }
    }
  };

  useEffect(() => {
    getData().then((finalData) => {
      // console.log("Products PAGE: ", finalData);
      setProductsOnline(finalData);
    });
  }, []);

  console.info(productsOnline);

  return (
    <Container fluid className="main-content-container px-4">
      {delPopUp.popUp && <PopModal title={`Doresti sa stergi ${delPopUp.productInfo}?`} eventHandler={dialogPopup} />}
      <Row noGutters className="page-header py-4">
        <PageTitle sm="4" title="Product List" subtitle="View & Edit Products" className="text-sm-left" />
      </Row>
      <Row>{/* <RangeDatePicker  onValues={handleDateInputs}/> */}</Row>
      <Row>
        <Col lg={5} sm={12} xs={12} className="my-2 d-sm-flex d-md-block flex-sm-row ">
          <Link to="/admin/products/add">
            <button className="btn btn-sm btn-primary  mx-1 ">Add product</button>
          </Link>
          <button className="btn btn-sm btn-secondary  mx-1">Something else</button>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card small className="mb-4">
            <CardHeader className="border-bottom">
              <h6 className="m-0">Product List</h6>
            </CardHeader>
            <CardBody className="p-0 pb-3">
              <table className="table mb-0">
                <thead className="bg-light">
                  <tr>
                    {tableTypes.map((item) => (
                      <th key={item} scope="col" className="border-0">
                        {item}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {productsOnline &&
                    Object.values(productsOnline)?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td>
                            {
                              <img
                                style={{ height: "50px", aspectRatio: "1/1" }}
                                className="object-fit-cover img-thumbnail "
                                src={Array.from(item.imageProduct)[0]}
                              />
                            }
                          </td>
                          <td className="font-weight-bold">
                            <a className="text-secondary text-decoration-none" href={`/produs/${item.ID}`}>
                              {item.title}
                            </a>
                          </td>
                          <td>{item.price}</td>
                          <td>
                            <Link to={`/admin/products/edit/${item.ID}`} className="btn btn-primary btn-sm">
                              EDITEAZA
                            </Link>
                            <button
                              onClick={() =>
                                deleteProduct({ productToDelete: { title: item.title, productID: item.ID } })
                              }
                              className="btn btn-danger btn-sm mx-md-1"
                            >
                              STERGE
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

const tableTypes = ["Image", "Name", "Price", "Actions"];

export default ProductsPage;
