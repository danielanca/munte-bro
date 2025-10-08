import React, { useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Table, Spinner } from "react-bootstrap";
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

type SortKey = "recent" | "oldest" | "name" | "amount";
type SortDir = "asc" | "desc";

const OrdersTable: React.FC = () => {
  const [ordersLocal, setOrdersLocal] = useState<RowItem[] | null>(null);
  const [ordersList, setOrdersList] = useState<RowItem[] | null>(null);
  const [filterDates, setFilterDates] = useState<{ startDate: number; endDate: number }>({ startDate: 0, endDate: 0 });

  // toolbar state
  const [query, setQuery] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "UNPAID">("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // ux state
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        const raw = await listOrders();
        const normalized = raw.map(normalize); 
        setOrdersLocal(normalized);
        setOrdersList(normalized);
      } catch (e: any) {
        console.error("Failed to fetch orders:", e);
        setOrdersLocal([]);
        setOrdersList([]);
        setErrorMsg("Nu s-au putut încărca comenzile.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDateInputs = (data: { dates: { startDate: string | number; endDate: string | number } }) => {
    setFilterDates({
      startDate: new Date(data.dates.startDate).getTime(),
      endDate: new Date(data.dates.endDate).getTime() + DAY_OFFSET_MS,
    });
  };

  const clearDates = () => setFilterDates({ startDate: 0, endDate: 0 });

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

  // derived view with search/status/sort
  const viewRows = useMemo(() => {
    let data = rows;

    // text search: name, invoice/order id
    const q = query.trim().toLowerCase();
    if (q) {
      data = data.filter((r) => {
        const full = `${r.firstName} ${r.lastName}`.trim().toLowerCase();
        return (
          full.includes(q) ||
          r.invoiceLabel.toLowerCase().includes(q) ||
          r.routeId.toLowerCase().includes(q)
        );
      });
    }

    // status filter
    if (statusFilter !== "ALL") {
      data = data.filter((r) => String(r.paymentStatus).toUpperCase() === statusFilter);
    }

    // sorting
    const sorted = [...data].sort((a, b) => {
      if (sortKey === "recent" || sortKey === "oldest") {
        return a.timestamp - b.timestamp; // flip by dir below
      }
      if (sortKey === "name") {
        const an = `${a.lastName || ""} ${a.firstName || ""}`.trim().toLowerCase();
        const bn = `${b.lastName || ""} ${b.firstName || ""}`.trim().toLowerCase();
        return an.localeCompare(bn);
      }
      // amount
      const at = (a.shippingTax || 0) + (a.cartSum || 0);
      const bt = (b.shippingTax || 0) + (b.cartSum || 0);
      return at - bt;
    });

    // direction flip + special case for "recent"/"oldest"
    const shouldDesc =
      sortKey === "recent"
        ? true // most recent => timestamp desc
        : sortKey === "oldest"
        ? false // oldest => asc
        : sortDir === "desc";

    return shouldDesc ? sorted.reverse() : sorted;
  }, [rows, query, statusFilter, sortKey, sortDir]);

  // summary for visible rows
  const viewTotal = useMemo(
    () => viewRows.reduce((acc, r) => acc + (r.shippingTax || 0) + (r.cartSum || 0), 0),
    [viewRows]
  );

  // quick reset
  const resetFilters = () => {
    setQuery("");
    setStatusFilter("ALL");
    setSortKey("recent");
    setSortDir("desc");
    clearDates();
  };

  return (
    <Container fluid className="px-4">
      <Row className="py-4">
        <PageTitle sm="4" title="Lista comenzi" subtitle="Orders List" className="text-sm-left" />
      </Row>

      {/* Date range + clear */}
      <Row className="mb-3 align-items-center g-2">
        <Col md={6} sm={12}>
          <RangeDatePicker onValues={handleDateInputs} />
        </Col>
        <Col md="auto">
          <Button variant="outline-secondary" onClick={clearDates}>
            Șterge intervalul
          </Button>
        </Col>
      </Row>

      {/* Filter toolbar */}
      <Row className="g-2 align-items-center mb-3">
        <Col md={4} sm={12}>
          <input
            className="form-control"
            placeholder="Caută (nume, #comandă)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </Col>
        <Col md={3} sm={6}>
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | "PAID" | "UNPAID")}
          >
            <option value="ALL">Toate statusurile</option>
            <option value="PAID">PAID</option>
            <option value="UNPAID">UNPAID</option>
          </select>
        </Col>
        <Col md={3} sm={6}>
          <select
            className="form-select"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
          >
            <option value="recent">Cele mai recente</option>
            <option value="oldest">Cele mai vechi</option>
            <option value="name">Nume (A–Z)</option>
            <option value="amount">Suma comandă</option>
          </select>
        </Col>
        <Col md="auto" sm="auto">
          <Button
            variant="outline-secondary"
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            title={`Direcție sortare: ${sortDir}`}
          >
            {sortDir === "asc" ? "↑" : "↓"}
          </Button>
        </Col>
        <Col md="auto" sm="auto">
          <Button variant="outline-dark" onClick={resetFilters}>Reset</Button>
        </Col>
      </Row>

      {/* Summary */}
      <Row className="mb-2 g-2">
        <Col md="auto">
          <span className="badge bg-light text-dark">Comenzi: {viewRows.length}</span>
        </Col>
        <Col md="auto">
          <span className="badge bg-success">Total vizibil: {fmtRON(viewTotal)}</span>
        </Col>
        {loading && (
          <Col md="auto">
            <Spinner animation="border" size="sm" /> <span className="text-muted">Se încarcă…</span>
          </Col>
        )}
        {errorMsg && !loading && (
          <Col md="auto">
            <span className="badge bg-danger">{errorMsg}</span>
          </Col>
        )}
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
                  {!loading && viewRows.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-4">
                        No orders.
                      </td>
                    </tr>
                  ) : (
                    viewRows.map((item) => {
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
