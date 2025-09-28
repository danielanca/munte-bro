// @ts-nocheck
import React, { useEffect, useState } from "react";
import { Card, CardBody, Table, CardTitle, Col, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { Link } from "react-router-dom";
import { requestOrdersList } from "../../../services/emails";
import { convertDate } from "./funcs";
import styles from "./Dashboard.module.scss";

const dayOffSet = 1000 * 58 * 60 * 24;

const LatestTransaction = () => {
  const [ordersLocal, setOrdersLocal] = useState(null);
  const [filterDates, setFilterDates] = useState({ startDate: 0, endDate: 0 });
  const [ordersList, setOrdersList] = useState(null);

  useEffect(() => {
    requestOrdersList().then((res) => {
      if (typeof res === "object") {
        res.json().then((data) => {
          let ordersItems = Object.values(data)[0];
          setOrdersLocal(ordersItems);
          setOrdersList(ordersItems);
        });
      }
    });
  }, []);

  const handleDateInputs = (event) => {
    let { name, value } = event.target;
    let numericalDate = new Date(value).getTime();
    numericalDate = isNaN(numericalDate) ? 0 : numericalDate;
    if (numericalDate > 0 && name === "endDate") {
      numericalDate += dayOffSet;
    }
    setFilterDates((filterDates) => ({ ...filterDates, [name]: numericalDate }));
  };

  useEffect(() => {
    console.log("Filters dates are:", filterDates);
    if (filterDates.endDate !== 0 && filterDates.startDate !== 0) {
      let filteredList = ordersLocal.filter((orderObject) => {
        let newDateFormat = convertDate(orderObject.timestamp);
        if (newDateFormat >= filterDates.startDate && newDateFormat <= filterDates.endDate) {
          return true;
        }
      });
      console.log("Filtered list:", filteredList);
      setOrdersList(filteredList);
    } else {
      setOrdersList(ordersLocal);
    }
  }, [filterDates]);

  return (
    <Col lg={8}>
      <Card>
        <CardBody>
          <CardTitle className="h4 mb-4">Latest Transaction</CardTitle>
          <div className={styles.dateInputs}>
            <div className={styles.inputDateContainer}>
              <label htmlFor="startDate">Start Date</label>
              <input name="startDate" type={"date"} onChange={handleDateInputs}></input>
            </div>
            <div className={styles.inputDateContainer}>
              <label htmlFor="endDate">End Date</label>
              <input name="endDate" type={"date"} onChange={handleDateInputs}></input>
            </div>
          </div>

          <div className="table-responsive">
            <Table className="table-centered">
              <thead>
                <tr>
                  <th scope="col">Data</th>
                  <th scope="col">Factura</th>
                  <th scope="col">Client</th>
                  <th scope="col">Suma</th>
                  <th scope="col" colSpan="2">
                    PLATA
                  </th>
                </tr>
              </thead>
              {ordersList != null
                ? ordersList.map((item) => (
                    <tbody>
                      <tr>
                        <td>{item.timestamp}</td>
                        <td>
                          <Link target={"_blank"} to={`/order/${item.invoiceID}`} className="text-body fw-medium">
                            #{item.invoiceID}
                          </Link>
                        </td>
                        <td>{`${item.firstName} ${item.lastName}`}</td>
                        <td>{`${item.shippingTax + item.cartSum} RON `}</td>
                        <td>
                          <span
                            className={`badge badge-soft-${
                              item.paymentStatus === "PAID" ? "success" : "danger"
                            } font-size-20`}
                          >
                            {item.paymentStatus === "NOT_PAID" ? "Unpaid" : "Paid"}
                          </span>
                        </td>
                        <td>
                          <Link target={"_blank"} to={`/order/${item.invoiceID}`} className="btn btn-primary btn-sm">
                            VIZUALIZEAZA
                          </Link>
                        </td>
                      </tr>
                    </tbody>
                  ))
                : ""}
            </Table>
          </div>
          <div className="mt-3">
            <Pagination className="pagination pagination-rounded justify-content-center mb-0">
              <PaginationItem>
                <PaginationLink to="#">Previous</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink to="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem className="active">
                <PaginationLink to="#">2</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink to="#">3</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationLink to="#">Next</PaginationLink>
              </PaginationItem>
            </Pagination>
          </div>
        </CardBody>
      </Card>
    </Col>
  );
};

export default LatestTransaction;
