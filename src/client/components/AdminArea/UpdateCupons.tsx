// @ts-nocheck

import React, { useState, useEffect } from "react";
import styles from "./UpdateProducts.module.scss";
import { getData } from "../../data/productList";
import ShowProduct from "./ShowProduct";
import { NavHashLink } from "react-router-hash-link";
import { deleteProduct } from "./../../services/emails";
import ShowCupon from "./ShowCupon";
type eventShot = {
  eventType: string;
  eventPayload: string;
};

interface cuponInterface {
  ID: any;
  // ID: any;
  cuponCode: string;
  cuponDiscount: number;
}
const UpdateCupons = () => {
  const [cuponsOnline, setCuponsOnline] = useState<cuponInterface[]>();

  const handleFire = (event: eventShot) => {
    console.log(event);
    if (event.eventType === "deleteProduct") {
      if (typeof cuponsOnline !== "undefined") {
        let productToDelete = cuponsOnline[event.eventPayload];
        deleteProduct(productToDelete);
      }
    }
  };

  useEffect(() => {
    if (cuponsOnline == null) {
      getData().then((finalData) => {
        console.log("Cupons Online: ", finalData);
        setCuponsOnline(finalData);
      });
    }
  }, [cuponsOnline]);

  console.info("cuponsOnline");
  console.info(cuponsOnline);

  return (
    <>
      <div className={styles.productPanel}>
        <div className={styles.controlArea}>
          <h3>{"Cupon List"}</h3>
          <div className={styles.otherActions}>
            <NavHashLink replace to={"/admin/cupondiscount/add"}>
              <div className={styles.actionButton}>
                <span className={styles.textInside}>{"Adauga "}</span>
              </div>
            </NavHashLink>
          </div>
        </div>

        <table className={styles.tableStyle}>
          <tr>
            <th>Preview</th>
            <th>Title</th>
            <th>Action</th>
          </tr>

          {cuponsOnline != null
            ? Object.values(cuponsOnline).map((item) => <ShowCupon handleFire={handleFire} cuponName={item} />)
            : ""}

          {/* <ShowProduct handleFire={handleFire} productName={item} /> */}
        </table>
      </div>
    </>
  );
};

export default UpdateCupons;
