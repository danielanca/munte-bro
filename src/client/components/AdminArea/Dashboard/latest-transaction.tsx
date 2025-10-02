import React, { useEffect, useMemo, useState } from "react";
import { Card, Table, Pagination, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { requestOrdersList } from "../../../services/emails";
import { convertDate } from "./funcs";
import styles from "./Dashboard.module.scss";

type OrderItem = {
  timestamp: string | number;
  invoiceID: string | number;
  firstName: string;
  lastName: string;
  shippingTax: number;
  cartSum: number;
  paymentStatus: "PAID" | "NOT_PAID" | string;
};

type OrdersResponse = Record<string, OrderItem[]> | OrderItem[];

const DAY_OFFSET_MS = 86_400_000;

const LatestTransaction: React.FC = () => {
  const [ordersLocal, setOrdersLocal] = useState<OrderItem[] | null>(null);
  const [ordersList, setOrdersList] = useState<OrderItem[] | null>(null);
  const [filterDates, setFilterDates] = useState<{ startDate: number; endDate: number }>({
    startDate: 0,
    endDate: 0,
  });

  useEffect(() => {
    (async () => {
      const res = await requestOrdersList();
      if (typeof res === "object" && "json" in res) {
        const data: OrdersResponse = await (res as Response).json();
        const items = Array.isArray(data) ? data : Object.values(data)[0];
        setOrdersLocal(items ?? null);
        setOrdersList(items ?? null);
      }
    })();
  }, []);

  const handleDateInputs = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let t = new Date(value).getTime();
    t = Number.isFinite(t) ? t : 0;
    if (t > 0 && name === "endDate") t += DAY_OFFSET_MS;
    setFilterDates((s) => ({ ...s, [name]: t }));
  };

  useEffect(() => {
    if (!ordersLocal) return;
    if (filterDates.startDate && filterDates.endDate) {
      const filtered = ordersLocal.filter((o) => {
        const ts = convertDate(o.timestamp);
        return ts >= filterDates.startDate && ts <= filterDates.endDate;
      });
      setOrdersList(filtered);
    } else {
      setOrdersList(ordersLocal);
    }
  }, [filterDates, ordersLocal]);

  const rows = useMemo(() => ordersList ?? [], [ordersList]);

  return (
    <Col lg={8}>
      <Card>
        <Card.Body>
          <h4 className="mb-4">Latest Transaction</h4>

          <Row className={styles.dateInputs}>
            <Col md={6} className={styles.inputDateContainer}>
              <label htmlFor="startDate">Start Date</label>
              <input id="startDate" name="startDate" type="date" onChange={handleDateInputs} />
            </Col>
            <Col md={6} className={styles.inputDateContainer}>
              <label htmlFor="endDate">End Date</label>
              <input id="endDate" name="endDate" type="date" onChange={handleDateInputs} />
            </Col>
          </Row>

          <div className="table-responsive mt-3">
            <Table responsive hover className="mb-0 align-middle">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Factura</th>
                  <th>Client</th>
                  <th>Suma</th>
                  <th colSpan={2}>PLATA</th>
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-4">No transactions.</td>
                  </tr>
                ) : (
                  rows.map((item) => (
                    <tr key={String(item.invoiceID) + String(item.timestamp)}>
                      <td>{item.timestamp}</td>
                      <td>
                        <Link target="_blank" to={`/order/${item.invoiceID}`} className="text-body fw-medium">
                          #{item.invoiceID}
                        </Link>
                      </td>
                      <td>{`${item.firstName} ${item.lastName}`}</td>
                      <td>{`${(Number(item.shippingTax) + Number(item.cartSum)).toFixed(2)} RON`}</td>
                      <td>
                        <span className={`badge bg-${item.paymentStatus === "PAID" ? "success" : "danger"}`}>
                          {item.paymentStatus === "NOT_PAID" ? "Unpaid" : "Paid"}
                        </span>
                      </td>
                      <td>
                        <Link target="_blank" to={`/order/${item.invoiceID}`}>
                          <Button size="sm" variant="primary">VIZUALIZEAZA</Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          <div className="mt-3">
            <Pagination className="justify-content-center mb-0">
              <Pagination.Item>Previous</Pagination.Item>
              <Pagination.Item>1</Pagination.Item>
              <Pagination.Item active>2</Pagination.Item>
              <Pagination.Item>3</Pagination.Item>
              <Pagination.Item>Next</Pagination.Item>
            </Pagination>
          </div>
        </Card.Body>
      </Card>
    </Col>
  );
};

export default LatestTransaction;
