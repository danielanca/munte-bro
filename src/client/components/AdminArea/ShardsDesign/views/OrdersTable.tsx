import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import RangeDatePicker from "../components/common/RangeDatePicker";
import PageTitle from "../components/common/PageTitle";
import { requestOrdersList } from "../../../../services/emails";
import { convertDate } from "../../Dashboard/funcs";

type OrderItem = {
  timestamp: string | number;
  firstName: string;
  lastName: string;
  shippingTax: number;
  cartSum: number;
  paymentStatus: "PAID" | "NOT_PAID" | string;
  invoiceID: string | number;
};

type OrdersResponse = Record<string, OrderItem[]> | OrderItem[];

const DAY_OFFSET_MS = 86_400_000;

const OrdersTable: React.FC = () => {
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

  const handleDateInputs = (data: { dates: { startDate: string | number; endDate: string | number } }) => {
    setFilterDates({
      startDate: new Date(data.dates.startDate).getTime(),
      endDate: new Date(data.dates.endDate).getTime() + DAY_OFFSET_MS,
    });
  };

  useEffect(() => {
    if (!ordersLocal) return;
    if (filterDates.startDate && filterDates.endDate) {
      const filtered = ordersLocal.filter((order) => {
        const t = convertDate(order.timestamp);
        return t >= filterDates.startDate && t <= filterDates.endDate;
      });
      setOrdersList(filtered);
    } else {
      setOrdersList(ordersLocal);
    }
  }, [filterDates, ordersLocal]);

  const rows = useMemo(() => ordersList ?? [], [ordersList]);

  return (
    <Container fluid className="px-4">
      <Row className="py-4">
        <PageTitle sm="4" title="Lista comenzi" subtitle="Orders List" className="text-sm-left" />
      </Row>

      <Row className="mb-3">
        <RangeDatePicker onValues={handleDateInputs} />
      </Row>

      <Row>
        <Col>
          <Card className="mb-4">
            <Card.Header>
              <strong>Active Users</strong>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Data</th>
                    <th>Nume Client</th>
                    <th>Valoare comanda</th>
                    <th>Status Plata</th>
                    <th>Actiuni</th>
                    <th>Factura</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        No orders.
                      </td>
                    </tr>
                  ) : (
                    rows.map((item) => (
                      <tr key={String(item.invoiceID) + String(item.timestamp)}>
                        <td>{item.timestamp}</td>
                        <td className="fw-semibold">{`${item.firstName} ${item.lastName}`}</td>
                        <td>{`${(Number(item.shippingTax) + Number(item.cartSum)).toFixed(2)} RON`}</td>
                        <td>
                          <Button
                            size="sm"
                            className="w-50"
                            variant={item.paymentStatus === "PAID" ? "success" : "warning"}
                          >
                            {item.paymentStatus === "NOT_PAID" ? "UNPAID" : "PAID"}
                          </Button>
                        </td>
                        <td>
                          <Link target="_blank" to={`/order/${item.invoiceID}`}>
                            <Button size="sm" variant="primary">
                              VIZUALIZEAZA
                            </Button>
                          </Link>
                        </td>
                        <td>{`#${item.invoiceID}`}</td>
                      </tr>
                    ))
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

export default OrdersTable;
