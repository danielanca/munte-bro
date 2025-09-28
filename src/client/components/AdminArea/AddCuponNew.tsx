// EditCupon.tsx
// @ts-nocheck

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { CuponModel } from "../../utils/OrderInterfaces";
import { addCupon } from "../../services/emails";
import { Container, Row, Col } from "shards-react";
import styles from "./EditProduct.module.scss";

type RouteParams = { id?: string };

const EMPTY_COUPON: CuponModel = {
  ID: "",            // can be string or number per your iface; we use string in the form
  cuponCode: "",
  cuponDiscount: 0,
};

const EditCupon: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<RouteParams>();

  const [editSent, setEditSent] = useState(false);
  const [model, setModel] = useState<CuponModel>(EMPTY_COUPON);

  useEffect(() => {
    if (id) setModel((m) => ({ ...m, ID: id })); // keep as string in form
  }, [id]);

  const onChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = ev.target;
    const raw = ev.target.value; // always string from inputs

    if (name === "ID") {
      setModel((m) => ({ ...m, ID: raw }));
    } else if (name === "cuponCode") {
      setModel((m) => ({ ...m, cuponCode: raw }));
    } else if (name === "cuponDiscount") {
      const trimmed = raw.trim();
      const n = trimmed === "" ? 0 : Number(trimmed);
      setModel((m) => ({ ...m, cuponDiscount: Number.isFinite(n) ? n : 0 }));
    }
  };

  const canSave = useMemo(() => {
    const idOk = String(model.ID).trim().length > 0;         // ← coerce to string
    const codeOk = String(model.cuponCode).trim().length > 0;
    const discountOk = typeof model.cuponDiscount === "number" && model.cuponDiscount >= 0;
    return idOk && codeOk && discountOk;
  }, [model]);

  const onSubmit = async () => {
    if (!canSave) return;
    try {
      // If your backend expects ID as number, convert here:
      // const payload = { ...model, ID: isNaN(Number(model.ID)) ? model.ID : Number(model.ID) };
      await addCupon(model);
      setEditSent(true);
      setTimeout(() => navigate("/admin/cupondiscount"), 600);
    } catch (err) {
      console.error("Failed to add coupon:", err);
    }
  };

  const onCancel = () => navigate("/admin/cupondiscount");

  useEffect(() => {
    if (!editSent) return;
    const t = setTimeout(() => setEditSent(false), 4000);
    return () => clearTimeout(t);
  }, [editSent]);

  return (
    <Container  className="main-content-container px-4">
      <Row>
        <Col>
          <div className={styles.editPage}>
            <div className={styles.addAreaContainer}>
              <h3>Add Cupon</h3>

              <div className={styles.inputContainer}>
                <div className={styles.rowSpacer}>
                  <div className={styles.inputFielder}>
                    <label htmlFor="ID">Link ID Name:</label>
                    <input
                      id="ID"
                      name="ID"
                      value={String(model.ID)}                 // ← ensure string for the input
                      onChange={onChange}
                      className={styles.input}
                      placeholder="ex: SUMMER24"
                    />
                  </div>

                  <div className={styles.inputFielder}>
                    <label htmlFor="cuponCode">cuponCode</label>
                    <input
                      id="cuponCode"
                      name="cuponCode"
                      value={String(model.cuponCode)}
                      onChange={onChange}
                      className={styles.input}
                      placeholder="ex: DINMUNTE1"
                    />
                  </div>

                  <div className={styles.inputFielder}>
                    <label htmlFor="cuponDiscount">cuponDiscount (%)</label>
                    <input
                      id="cuponDiscount"
                      name="cuponDiscount"
                      type="number"
                      min={0}
                      step={1}
                      value={Number.isFinite(model.cuponDiscount) ? model.cuponDiscount : 0}
                      onChange={onChange}
                      className={styles.input}
                      placeholder="ex: 10"
                    />
                  </div>
                </div>

                <div className={styles.actionControl}>
                  <button className={styles.saveButton} onClick={onSubmit} disabled={!canSave}>
                    SAVE
                  </button>
                  <button onClick={onCancel} className={styles.cancelButton}>
                    CANCEL
                  </button>
                </div>

                {/* {editSent && (
                  <div className={styles.dialogSpace}>
                    <p className={styles.confirmationSaveText}>Cupon salvat!</p>
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default EditCupon;
