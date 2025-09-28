import React, { useState } from "react";
import styles from "./ShowProduct.module.scss";
import { HashLink, NavHashLink } from "react-router-hash-link";
import PopModal from "./PopModal";

interface cuponInterface {
  ID: any;
  // ID: any;
  cuponCode: string;
  cuponDiscount: number;
}
type eventShot = {
  eventType: string;
  eventPayload: string;
};
interface cuponProps {
  cuponName: cuponInterface;
  handleFire: (event: eventShot) => void;
}

const ShowCupon = ({ cuponName, handleFire }: cuponProps) => {
  const [confirmDeleteModal, setConfirmDeleteModal] = useState<boolean>(false);

  const handleModal = (event: string, payload: string) => {
    if (event === "modal_Event" && payload === "YES") {
      handleFire({ eventType: "deleteProduct", eventPayload: cuponName.ID });
    }
    setConfirmDeleteModal(false);
  };

  return (
    <>
      {confirmDeleteModal && (
        <PopModal title={`Doresti sa stergi ${cuponName.cuponCode}?`} eventHandler={handleModal} />
      )}
      <tr className={styles.productRow}>
        <td>
          {/* <div className={styles.imageWrap}>
            <img className={styles.productImage} src={Array.from(cuponName.imageProduct)[0]}></img>
          </div> */}
        </td>
        <td>
          <div className={styles.titleWrap}>
            <span className={styles.productTitle}>{cuponName.cuponDiscount}</span>
          </div>
        </td>
        <td className={styles.actionAreaAdmin}>
          <HashLink className={styles.HashLinkStyle} to={"/admin/cupondiscount/edit/" + cuponName.ID}>
            <div className={styles.addCartWrap}>
              <div className={styles.actionButton}>
                <span className={styles.textInside}>{"EDITEAZA"}</span>
              </div>
            </div>
          </HashLink>
          <div onClick={() => setConfirmDeleteModal(true)} className={styles.actionButtonAlert}>
            <span className={styles.textInside}>{"Sterge"}</span>
          </div>
        </td>
      </tr>
    </>
  );
};
// <HashLink onClick={gotoElement} className={styles.HashLinkStyle} to={"/produs/" + productName.ID}>
export default ShowCupon;
