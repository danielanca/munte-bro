import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import RangeDatePicker from "../components/common/RangeDatePicker";
import PageTitle from "../components/common/PageTitle";
import { listOrders, OrderDoc } from "../../../../services/orders";

// helpers
const DAY_OFFSET_MS = 86_400_000;
const toNumberRON = (v: unknown): number => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const s = v.replace(/[^\d.,-]/g, "").replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : 0;
  }
  return 0;
};
const fmtRON = (n: number) =>
  new Intl.NumberFormat("ro-RO", { style: "currency", currency: "RON", minimumFractionDigits: 2 }).format(n);

type RowItem = {
  timestamp: number;
  firstName: string;
  lastName: string;
  shippingTax: number;
  cartSum: number;
  paymentStatus: "PAID" | "UNPAID" | string;
  routeId: string;      // always safe for /order/:id
  invoiceLabel: string; // displayed in the table (e.g., orderID)
};

const normalize = (o: OrderDoc): RowItem => {
  const ts =
    (o.createdAt && typeof (o.createdAt as any).toMillis === "function" && (o.createdAt as any).toMillis()) ||
    (typeof (o as any).timestamp === "number" ? (o as any).timestamp : Date.parse(String((o as any).timestamp || Date.now())));

  const shippingTax = toNumberRON((o as any).shippingTax);
  const cartSum = toNumberRON((o as any).cartSum);
  const status = String((o as any).paymentStatus || "").toUpperCase();

  // prefer orderID, else invoiceID, else Firestore doc id
  const routeId = String((o as any).orderID || (o as any).invoiceID || (o as any).id || "");
  const invoiceLabel = routeId;

  return {
    timestamp: Number.isFinite(ts) ? ts : Date.now(),
    firstName: (o as any).firstName || "",
    lastName: (o as any).lastName || "",
    shippingTax,
    cartSum,
    paymentStatus: status === "PAID" ? "PAID" : "UNPAID",
    routeId,
    invoiceLabel,
  };
};

const OrdersTable: React.FC = () => {
  const [ordersLocal, setOrdersLocal] = useState<RowItem[] | null>(null);
  const [ordersList, setOrdersList] = useState<RowItem[] | null>(null);
  const [filterDates, setFilterDates] = useState<{ startDate: number; endDate: number }>({ startDate: 0, endDate: 0 });

  useEffect(() => {
    (async () => {
      try {
        const raw = await listOrders();
        const normalized = raw.map(normalize);
        setOrdersLocal(normalized);
        setOrdersList(normalized);
      } catch (e) {
        console.error("Failed to fetch orders:", e);
        setOrdersLocal([]);
        setOrdersList([]);
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
      const filtered = ordersLocal.filter(
        (o) => o.timestamp >= filterDates.startDate && o.timestamp <= filterDates.endDate
      );
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
              <strong>Orders</strong>
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
                    rows.map((item) => {
                      const total = item.shippingTax + item.cartSum;
                      const paid = item.paymentStatus === "PAID";
                      return (
                        <tr key={`${item.routeId}-${item.timestamp}`}>
                          <td>{new Date(item.timestamp).toLocaleString("ro-RO")}</td>
                          <td className="fw-semibold">{`${item.firstName} ${item.lastName}`.trim() || "—"}</td>
                          <td>{fmtRON(total)}</td>
                          <td>
                            <Button size="sm" className="w-50" variant={paid ? "success" : "warning"}>
                              {paid ? "PAID" : "UNPAID"}
                            </Button>
                          </td>
                          <td>
<Link target="_blank" to={`/admin/order/${encodeURIComponent(item.routeId)}`}>
  <Button size="sm" variant="primary">VIZUALIZEAZA</Button>
</Link>
                          </td>
                          <td>{`#${item.invoiceLabel}`}</td>
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

export default OrdersTable;
