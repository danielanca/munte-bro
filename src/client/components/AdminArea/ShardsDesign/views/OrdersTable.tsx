import React, {useRef, useEffect, useMemo, useState } from "react";
import { Container, Row, Col, Card, Button, Table, Spinner,Form  } from "react-bootstrap";
import { Link } from "react-router-dom";
import RangeDatePicker from "../components/common/RangeDatePicker";
import PageTitle from "../components/common/PageTitle";
import { listOrders, OrderDoc, OrderItem,bulkUpdatePaymentStatus, bulkUpdateOrderStatus,checkIfBlackList, setBlackList, } from "../../../../services/orders";

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
  orderStatus : "PENDING" | "READY" | "COMPLETED" | "CANCELLED" | "CUSTOMER CANCELLED" | string;
  paymentStatus: "PAID" | "UNPAID" | "REFUNDED" | string;
  routeId: string;      // always safe for /order/:id
  invoiceLabel: string; // displayed in the table (e.g., orderID)
  parcelId: string;
  items: OrderItem[];
  awb:string;

  deliveryAddress?: string;
  city?: string;
  meta?: Record<string, any>;

  // Added for blacklisting
  phoneNo?: string;
  emailAddress?: string;

};

const normalize = (o: OrderDoc): RowItem => {
  const ts =
    (o.createdAt && typeof (o.createdAt as any).toMillis === "function" && (o.createdAt as any).toMillis()) ||
    (typeof (o as any).timestamp === "number" ? (o as any).timestamp : Date.parse(String((o as any).timestamp || Date.now())));

  const shippingTax = toNumberRON((o as any).shippingTax);
  const cartSum = toNumberRON((o as any).cartSum);
  const paymentStatus = String((o as any).paymentStatus || "").toUpperCase();
  const orderStatus =  String((o as any).orderStatus || "").toUpperCase();
  // prefer orderID, else invoiceID, else Firestore doc id
  const routeId = String((o as any).orderID || (o as any).invoiceID || (o as any).id || "");
  const invoiceLabel = routeId;
  return {
    timestamp: Number.isFinite(ts) ? ts : Date.now(),
    firstName: (o as any).firstName || "",
    lastName: (o as any).lastName || "",
    shippingTax,
    parcelId : o.parcelId || "12345678",
    cartSum,
    orderStatus : orderStatus,
    paymentStatus: paymentStatus,
    routeId,
    invoiceLabel,
    items: o.items || [],
    awb:(o as any).awb,

    deliveryAddress: o.deliveryAddress,
    city: o.city,
    meta:o.meta,

    // Added
    phoneNo: o.phoneNo || "",
    emailAddress: o.emailAddress || "",

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
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PAID" | "UNPAID" | "REFUND">("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("recent");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  // ux state
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // multiple action

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const masterCheckboxRef = useRef<HTMLInputElement>(null);

  const [blacklistMap, setBlacklistMap] = useState<Map<string, boolean>>(new Map());
// Master checkbox
const allSelected = !!(
  ordersList &&
  selectedIds.size === ordersList.length &&
  ordersList.length > 0
);
const someSelected = selectedIds.size > 0 && selectedIds.size < (ordersList?.length ?? 0);

// Toggle one
const toggleSelect = (routeId: string) => {
  setSelectedIds(prev => {
    const next = new Set(prev);
    if (next.has(routeId)) {
      next.delete(routeId);
    } else {
      next.add(routeId);
    }
    return next;
  });
};

// Toggle all
const toggleSelectAll = () => {
  if (allSelected) {
    setSelectedIds(new Set());
  } else {
    setSelectedIds(new Set(ordersList?.map(o => o.routeId) ?? []));
  }
};

// ────────────────────────────────────────────────


const handlePayment = async (action: "refund" | "paid" | "unpaid") => {
  if (selectedIds.size === 0) return;

  const count = selectedIds.size;
  const idsArray = Array.from(selectedIds);

  let message = "";
  switch (action) {
    case "paid":
      message = `Marchezi ${count} comand${count === 1 ? 'ă' : 'e'} ca **PLĂTITĂ**?`;
      break;
    case "unpaid":
      message = `Marchezi ${count} comand${count === 1 ? 'ă' : 'e'} ca **NEPLĂTITĂ**?`;
      break;
   /* case "cancel":
      message = `Anulezi ${count} comand${count === 1 ? 'ă' : 'e'}? (ireversibil parțial)`;
      break;
  */
  }


  try {
    setLoading(true);

    switch (action) {
      case "paid":
        await bulkUpdatePaymentStatus(idsArray, "PAID");
        break;

      case "unpaid":
        await bulkUpdatePaymentStatus(idsArray, "UNPAID");
        break;

      case "refund":
        await bulkUpdatePaymentStatus(idsArray, "REFUND");
        break;

    }

    // Refresh the list
    const raw = await listOrders();
    const normalized = raw.map(normalize);
    setOrdersLocal(normalized);
    setOrdersList(normalized);

    setSelectedIds(new Set());
    alert("Acțiunea a fost realizată cu succes.");
  } catch (err: any) {
    console.error("Bulk action failed:", err);
    alert("Eroare: " + (err.message || "acțiunea nu a putut fi executată"));
  } finally {
    setLoading(false);
  }
};



const handleOrder = async (action: "pending" | "ready" | "completed" | "cancelled") => {
  if (selectedIds.size === 0) return;

  const count = selectedIds.size;
  const idsArray = Array.from(selectedIds);

  let message = "";
  switch (action) {
    case "pending":
      message = `Marchezi ${count} comand${count === 1 ? 'ă' : 'e'} ca **PLĂTITĂ**?`;
      break;
    case "ready":
      message = `Marchezi ${count} comand${count === 1 ? 'ă' : 'e'} ca **NEPLĂTITĂ**?`;
      break;
   /* case "cancel":
      message = `Anulezi ${count} comand${count === 1 ? 'ă' : 'e'}? (ireversibil parțial)`;
      break;
  */
  }


  try {
    setLoading(true);

    switch (action) {
      case "pending":
        await bulkUpdateOrderStatus(idsArray, "PENDING");
        break;

      case "ready":
        await bulkUpdateOrderStatus(idsArray, "READY");
        break;

      case "completed":
        await bulkUpdateOrderStatus(idsArray, "COMPLETED");
        break;

      case "cancelled":
        await  bulkUpdateOrderStatus(idsArray, "CANCELLED");
        const selectedOrders = ordersList?.filter(o => selectedIds.has(o.routeId)) ?? [];
        await setBlackList(selectedOrders);
        break;
        
    }

    // Refresh the list
    const raw = await listOrders();
    const normalized = raw.map(normalize);
    setOrdersLocal(normalized);
    setOrdersList(normalized);

    // Re-fetch blacklist map after refresh
    const uniquePhones = [...new Set(normalized.map(o => o.phoneNo).filter(Boolean))];
    const results = await Promise.all(
      uniquePhones.map(async (phone) => {
        const isBlacklisted = await checkIfBlackList(phone || "");
        return [phone, isBlacklisted] as [string, boolean];
      })
    );
    setBlacklistMap(new Map(results));


    setSelectedIds(new Set());
    alert("Acțiunea a fost realizată cu succes.");
  } catch (err: any) {
    console.error("Bulk action failed:", err);
    alert("Eroare: " + (err.message || "acțiunea nu a putut fi executată"));
  } finally {
    setLoading(false);
  }
};



const handleOrder = async (action: "pending" | "ready" | "completed" | "cancelled") => {
  if (selectedIds.size === 0) return;

  const count = selectedIds.size;
  const idsArray = Array.from(selectedIds);

  let message = "";
  switch (action) {
    case "pending":
      message = `Marchezi ${count} comand${count === 1 ? 'ă' : 'e'} ca **PLĂTITĂ**?`;
      break;
    case "ready":
      message = `Marchezi ${count} comand${count === 1 ? 'ă' : 'e'} ca **NEPLĂTITĂ**?`;
      break;
   /* case "cancel":
      message = `Anulezi ${count} comand${count === 1 ? 'ă' : 'e'}? (ireversibil parțial)`;
      break;
  */
  }


  try {
    setLoading(true);

    switch (action) {
      case "pending":
        await bulkUpdateOrderStatus(idsArray, "PENDING");
        break;

      case "ready":
        await bulkUpdateOrderStatus(idsArray, "READY");
        break;

      case "completed":
        await bulkUpdateOrderStatus(idsArray, "COMPLETED");
        break;

      case "cancelled":
        await  bulkUpdateOrderStatus(idsArray, "CANCELLED");
        const selectedOrders = ordersList?.filter(o => selectedIds.has(o.routeId)) ?? [];
        await setBlackList(selectedOrders);
        break;
        
    }

    // Refresh the list
    const raw = await listOrders();
    const normalized = raw.map(normalize);
    setOrdersLocal(normalized);
    setOrdersList(normalized);

    // Re-fetch blacklist map after refresh
    const uniquePhones = [...new Set(normalized.map(o => o.phoneNo).filter(Boolean))];
    const results = await Promise.all(
      uniquePhones.map(async (phone) => {
        const isBlacklisted = await checkIfBlackList(phone || "");
        return [phone, isBlacklisted] as [string, boolean];
      })
    );
    setBlacklistMap(new Map(results));


    setSelectedIds(new Set());
    alert("Acțiunea a fost realizată cu succes.");
  } catch (err: any) {
    console.error("Bulk action failed:", err);
    alert("Eroare: " + (err.message || "acțiunea nu a putut fi executată"));
  } finally {
    setLoading(false);
  }
};


useEffect(() => {
  if (masterCheckboxRef.current) {
    masterCheckboxRef.current.indeterminate = someSelected && !allSelected;
  }
}, [someSelected, allSelected]);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErrorMsg(null);
        const raw = await listOrders();
        const normalized = raw.map(normalize); 
        setOrdersLocal(normalized);
        setOrdersList(normalized);


        // Batch check blacklist for unique phones
        const uniquePhones = [...new Set(normalized.map(o => o.phoneNo).filter(Boolean))]; // Filter out undefined/empty
        const results = await Promise.all(
          uniquePhones.map(async (phone) => {
            const isBlacklisted = await checkIfBlackList(phone || "");
            return [phone, isBlacklisted] as [string, boolean];
          })
        );
        setBlacklistMap(new Map(results));
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

// inside OrdersTable component, use the exportToXML

function formatToDayMonth(ts: number) {
  const date = new Date(ts);

  const day = date.getDate(); // 1–31

  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const month = months[date.getMonth()]; // 0–11

  return `${day}${month}`;
}

const exportToSagaXML = () => {
  if (!viewRows || viewRows.length === 0) return;

  // Only export UNPAID orders (or adjust to PAID if needed)
  const exportRows = viewRows.filter(r => r.paymentStatus === "UNPAID");
  if (exportRows.length === 0) {
    alert("No orders available for export.");
    return;
  }

  const FURNIZOR = {
    nume: "DIN MUNTI STRABUNI S.R.L.",
    cif: "51976722",
    nrRegCom: "j2025042564004",
    adresa: "str. Fragariste nr.28, Turda, Cluj",
    banca: "TRANSILVANIA",
    iban: "RO30BTRLRONCRT0CY7486801",
  };

  const xmlOrders = exportRows.map(order => {
    let lineNr = 1;
    let totalValoare = 0;
    let totalTVA = 0;

    const itemLines = order.items.map(item => {
      const pret = Number(item.price || 0);
      const cantitate = Number(item.itemNumber || 1); // using itemNumber as quantity
      const valoare = pret * cantitate / 1.21; // net value
      const tva = pret * cantitate - valoare;

      totalValoare += valoare;
      totalTVA += tva;

      return `
        <Linie>
          <LinieNrCrt>${lineNr++}</LinieNrCrt>
          <Gestiune/>
          <Descriere>${item.name}</Descriere>
          <CodArticolFurnizor>${item.id}</CodArticolFurnizor>
          <CodArticolClient>${item.id}</CodArticolClient>
          <CodBare/>
          <InformatiiSuplimentare/>
          <UM>BUC</UM>
          <Cantitate>${cantitate}</Cantitate>
          <Pret>${pret.toFixed(2)}</Pret>
          <Valoare>${valoare.toFixed(2)}</Valoare>
          <ProcTVA>21</ProcTVA>
          <TVA>${tva.toFixed(2)}</TVA>
        </Linie>`;
    });

    if (order.shippingTax && order.shippingTax > 0) {
      const pret = order.shippingTax;
      const valoare = pret / 1.21;
      const tva = pret - valoare;

      totalValoare += valoare;
      totalTVA += tva;

      itemLines.push(`
        <Linie>
          <LinieNrCrt>${lineNr++}</LinieNrCrt>
          <Gestiune/>
          <Descriere>TAXA TRANSPORT</Descriere>
          <CodArticolFurnizor/>
          <CodArticolClient/>
          <CodBare/>
          <InformatiiSuplimentare/>
          <UM>BUC</UM>
          <Cantitate>1</Cantitate>
          <Pret>${pret.toFixed(2)}</Pret>
          <Valoare>${valoare.toFixed(2)}</Valoare>
          <ProcTVA>21</ProcTVA>
          <TVA>${tva.toFixed(2)}</TVA>
        </Linie>`);
    }

    const totalFactura = totalValoare + totalTVA;

    return `
      <Factura>
        <Antet>
          <FurnizorNume>${FURNIZOR.nume}</FurnizorNume>
          <FurnizorCIF>${FURNIZOR.cif}</FurnizorCIF>
          <FurnizorNrRegCom>${FURNIZOR.nrRegCom}</FurnizorNrRegCom>
          <FurnizorCapital/>
          <FurnizorAdresa>${FURNIZOR.adresa}</FurnizorAdresa>
          <FurnizorBanca>${FURNIZOR.banca}</FurnizorBanca>
          <FurnizorIBAN>${FURNIZOR.iban}</FurnizorIBAN>
          <FurnizorInformatiiSuplimentare/>
          <ClientNume>${order.firstName} ${order.lastName}</ClientNume>
          <ClientInformatiiSuplimentare/>
          <ClientCIF>0000000000000</ClientCIF>
          <ClientNrRegCom/>
          <ClientAdresa>${order.deliveryAddress || ""}</ClientAdresa>
          <ClientLocalitate>${order.city || ""}</ClientLocalitate>
          <ClientJudet/>
          <ClientBanca/>
          <ClientIBAN/>
          <FacturaNumar>${order.routeId}</FacturaNumar>
          <FacturaData>${new Date(order.timestamp).toLocaleDateString("ro-RO")}</FacturaData>
          <FacturaScadenta/>
          <FacturaTaxareInversa>Nu</FacturaTaxareInversa>
          <FacturaTVAIncasare>Nu</FacturaTVAIncasare>
          <FacturaInformatiiSuplimentare/>
          <FacturaMoneda>RON</FacturaMoneda>
          <FacturaCotaTVA>21</FacturaCotaTVA>
          <FacturaGreutate>0</FacturaGreutate>
        </Antet>
        <Detalii>
          <Continut>
            ${itemLines.join("")}
          </Continut>
        </Detalii>
        <Sumar>
          <TotalValoare>${totalValoare.toFixed(2)}</TotalValoare>
          <TotalTVA>${totalTVA.toFixed(2)}</TotalTVA>
          <Total>${totalFactura.toFixed(2)}</Total>
        </Sumar>
        <Observatii>
          <txtObservatii>${order.meta?.orderNotes || ""}</txtObservatii>
          <SoldClient/>
        </Observatii>
      </Factura>
    `;
  }).join("");

  const finalXML = `<?xml version="1.0" encoding="UTF-8"?>
<Facturi>
${xmlOrders}
</Facturi>`;

  const blob = new Blob([finalXML], { type: "application/xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "Saga-Invoices-"+formatToDayMonth(filterDates.startDate)+"-"+formatToDayMonth(filterDates.endDate)+".xml";
  a.click();
  URL.revokeObjectURL(url);
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
         <Col md="auto" sm="auto">
        <Button variant="success" onClick={exportToSagaXML}>
           Download XML
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
            onChange={(e) => setStatusFilter(e.target.value as "ALL" | "PAID" | "UNPAID" | "REFUND")}
          >
            <option value="ALL">Toate statusurile</option>
            <option value="PAID">PAID</option>
            <option value="UNPAID">UNPAID</option>
            <option value="REFUND">REFUND</option>
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
          <span className="badge bg-light text-dark fs-3">Comenzi: {viewRows.length}</span>
        </Col>
        <Col md="auto">
          <span className="badge bg-success fs-3">Total vizibil: {fmtRON(viewTotal)}</span>
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
            {(
  <div
    className="bg-light border-top p-3 d-flex align-items-center gap-3 flex-wrap"
    style={{
      position: "sticky",
      bottom: 0,
      zIndex: 10,
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(6px)",
    }}
  >
    <strong>Payment Status: {selectedIds.size} selectate</strong>

    <Button
      variant="outline-secondary"
      size="sm"
      onClick={() => setSelectedIds(new Set())}
    >
      Deselectează tot
    </Button>

    <div className="vr mx-2" />

    <Button variant="success" size="sm" onClick={() => handlePayment("paid")}>
      Marchează ca plătite
    </Button>

    <Button variant="warning" size="sm" onClick={() => handlePayment("unpaid")}>
      Marchează ca neplătite
    </Button>

    <Button variant="secondary" size="sm" onClick={() => handlePayment("refund")}>
      Rambursare
    </Button>
  </div>
)}


{(
  <div
    className="bg-light border-top p-3 d-flex align-items-center gap-3 flex-wrap"
    style={{
      position: "sticky",
      bottom: 0,
      zIndex: 10,
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(6px)",
    }}
  >
    <strong>Order Status: {selectedIds.size} selectate</strong>

    <Button
      variant="outline-secondary"
      size="sm"
      onClick={() => setSelectedIds(new Set())}
    >
      Deselectează tot
    </Button>

    <div className="vr mx-2" />

    <Button variant="success" size="sm" onClick={() => handleOrder("pending")}>
      In asteptare
    </Button>

    <Button variant="warning" size="sm" onClick={() => handleOrder("ready")}>
      Gata
    </Button>

    <Button variant="secondary" size="sm" onClick={() => handleOrder("completed")}>
     Finalizat
    </Button>

    <Button variant="danger" size="sm" onClick={() => handleOrder("cancelled")}>
     Anulat
    </Button>
  </div>
)}
              <Table responsive hover className="mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                  <th className="mx-3 text-center"><Form.Check
  ref={masterCheckboxRef}
  type="checkbox"
  checked={allSelected}
  onChange={toggleSelectAll}
/></th>

                    <th>Data</th>
                    <th>Nume Client</th>
                    <th>Valoare comanda</th>
                    <th>Telefon</th>
                    <th>Statutul Ordinului</th>
                    <th>Starea plății</th>
                    <th>Actiuni</th>
                    <th>Factura</th>
                  
                  </tr>
                </thead>
                <tbody className="px-4">
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
                      const isSelected = selectedIds.has(item.routeId);
                      const isBlacklisted = blacklistMap.get(item.phoneNo || "") ?? false;
                      const getPaymentVariant = (status: string) => {
                        if (status === "PAID") {
                          return "success"; // Green
                        } else if (status === "UNPAID") {
                          return "warning"; // Yellow
                        } else if (status === "REFUNDED") {
                          return "secondary"; // Gray
                        } else if (status === "CANCELLED") {
                          return "danger"; // Red
                        } else {
                          return "info"; // Blue fallback for unknowns
                        }
                      };

                      return (
                        <tr key={`${item.routeId}-${item.timestamp}`}>
                          <td className="text-center"> <Form.Check type="checkbox" checked={isSelected}
              onChange={() => toggleSelect(item.routeId)} /> </td>
                          <td>{new Date(item.timestamp).toLocaleString("ro-RO")}</td>
                          <td className="fw-semibold">
                            {`${item.firstName} ${item.lastName}`.trim() || "—"}
                            {isBlacklisted ? " 🚩" : ""}
                            
                              </td>
                          <td>{fmtRON(total)}</td>
                          <td>{item.phoneNo}</td>
                          <td>{item.orderStatus}</td>
                          <td>
                            <Button size="sm" className="w-100" variant={getPaymentVariant(item.paymentStatus)}>
                              {item.paymentStatus}
                            </Button>
                          </td>
                          <td>
                            <Link target="_blank" to={`/admin/order/${encodeURIComponent(item.routeId)}`}>
                              <Button size="sm" variant="primary">VIZUALIZEAZA</Button>
                            </Link>
                          </td>
                          <td>
                            {
                              item.awb !== "" && (
                              <Link target="_blank" to={`${item.awb}`}>
                              <Button size="sm" variant="primary">{`#${item.invoiceLabel}`}</Button>
                            </Link>
                              )

                            }
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

export default OrdersTable;
