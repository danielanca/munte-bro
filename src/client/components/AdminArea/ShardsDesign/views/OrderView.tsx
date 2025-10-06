import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Container, Table, Badge, Row, Col } from "react-bootstrap";
import { getOrderById, OrderDoc } from "../../../../services/orders";
import styles from "./OrderView.module.css";

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

const OrderView: React.FC = () => {
  const { id = "" } = useParams();
  const [order, setOrder] = useState<OrderDoc | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const doc = await getOrderById(id);
        setOrder(doc);
      } catch (e) {
        console.error("Failed to load order:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const lines = useMemo(() => {
    if (!order) return [];
    const raw = typeof order.cartProducts === "string" ? JSON.parse(order.cartProducts) : (order.cartProducts || []);
    return Array.isArray(raw) ? raw : [];
  }, [order]);

  if (loading) {
    return (
      <Container className={styles.wrap}>
        <div className={styles.loading}>Se încarcă…</div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container className={styles.wrap}>
        <Card className="p-4">
          <strong>Comanda nu a fost găsită.</strong>
          <div className="text-muted">ID: {id}</div>
        </Card>
      </Container>
    );
  }

  const created =
    (order.createdAt && typeof (order.createdAt as any).toMillis === "function" && new Date((order.createdAt as any).toMillis())) ||
    new Date();

  const shipping = toNumberRON(order.shippingTax);
  const subtotal = toNumberRON(order.cartSum);
  const total = subtotal + shipping;

  const paid = String(order.paymentStatus || "").toUpperCase() === "PAID";
  const method = (order.paymentMethod || "").toUpperCase();

  return (
    <Container className={styles.wrap}>
      <Row className="g-3">
        <Col lg={7}>
          <Card className={styles.headerCard}>
            <Card.Header className={styles.cardHeader}>
              <div className={styles.headerRow}>
                <div>
                  <div className={styles.hTitle}>Comanda #{order.orderID || order.invoiceID || order.id}</div>
                  <div className={styles.hSub}>{created.toLocaleString("ro-RO")}</div>
                </div>
                <div className={styles.statusWrap}>
                  <Badge bg={paid ? "success" : "warning"} className={styles.statusBadge}>
                    {paid ? "PAID" : "UNPAID"}
                  </Badge>
                  {method && <Badge bg="secondary" className={styles.methodBadge}>{method}</Badge>}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className={styles.metaGrid}>
                <div className={styles.kv}>
                  <span className={styles.k}>Nume client</span>
                  <span className={styles.v}>{`${order.firstName ?? ""} ${order.lastName ?? ""}`.trim() || "—"}</span>
                </div>
                <div className={styles.kv}>
                  <span className={styles.k}>Email</span>
                  <span className={styles.v}>{order.emailAddress || "—"}</span>
                </div>
                <div className={styles.kv}>
                  <span className={styles.k}>Telefon</span>
                  <span className={styles.v}>{order.phoneNo || "—"}</span>
                </div>
                <div className={styles.kv}>
                  <span className={styles.k}>Adresă</span>
                  <span className={styles.v}>
                    {order.deliveryAddress || "—"}, {order.city || ""}
                  </span>
                </div>
                <div className={styles.kv}>
                  <span className={styles.k}>Metodă livrare</span>
                  <span className={styles.v}>{order.deliveryName || "—"}</span>
                </div>
                <div className={styles.kv}>
                  <span className={styles.k}>Notițe</span>
                  <span className={styles.v}>{order.orderNotes || "—"}</span>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={5}>
          <Card className={styles.totalsCard}>
            <Card.Header className={styles.cardHeader}>
              <div className={styles.hTitle}>Total</div>
            </Card.Header>
            <Card.Body>
              <div className={styles.kv}>
                <span className={styles.k}>Subtotal</span>
                <span className={styles.v}>{fmtRON(subtotal)}</span>
              </div>
              <div className={styles.kv}>
                <span className={styles.k}>Transport</span>
                <span className={styles.v}>{fmtRON(shipping)}</span>
              </div>
              <div className={`${styles.kv} ${styles.totalRow}`}>
                <span className={styles.k}>Total</span>
                <span className={styles.v}>{fmtRON(total)}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mt-1">
        <Col>
          <Card>
            <Card.Header className={styles.cardHeader}>
              <div className={styles.hTitle}>Produse</div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive hover className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Imagine</th>
                    <th>Produs</th>
                    <th>Cant.</th>
                    <th>Preț</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {lines.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-4">Fără produse.</td>
                    </tr>
                  ) : (
                    lines.map((l: any) => {
                      const qty = Number(l.itemNumber) || 0;
                      const price = toNumberRON(l.discountedPrice || l.price);
                      return (
                        <tr key={l.id}>
                          <td>
                            {l.imageProduct ? (
                              <img src={l.imageProduct} alt={l.name} className={styles.imgThumb} />
                            ) : (
                              <div className={styles.noImg}>—</div>
                            )}
                          </td>
                          <td>{l.name}</td>
                          <td>{qty}</td>
                          <td>{fmtRON(price)}</td>
                          <td>{fmtRON(qty * price)}</td>
                        </tr>
                      );
                    })
                  )}
                  <tr>
                    <td colSpan={4} className="text-end"><b>Subtotal</b></td>
                    <td><b>{fmtRON(subtotal)}</b></td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-end">Transport</td>
                    <td>{fmtRON(shipping)}</td>
                  </tr>
                  <tr>
                    <td colSpan={4} className="text-end"><b>Total</b></td>
                    <td><b>{fmtRON(total)}</b></td>
                  </tr>
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default OrderView;
