import React, { useState } from "react";
import styles from "./CuponReducere.module.scss"
import CuponPage from "./ShardsDesign/views/CuponPage";

export default function CuponReducere() {
    const [formData, setFormData] = useState({
        ID: "",
        cuponCode: "",
        cuponCut: 0
    })

  
    return (
        // <div>
        //     <div className={styles.mainContainer}>
        //         <input className={styles.cuponReducereCode} type="text" name="cuponCode" value={formData.cuponCode} onChange={handleChange} state={{ cuponCodeText: formData.cuponCode }} />
        //         <div className={styles.cuponPercentParent}>
        //             <input className={styles.cuponReducereInput} type="number" name="cuponCut" value={formData.cuponCut} onChange={handleChange} state={{ cuponCutPercent: formData.cuponCut }} />
        //             <h2 className={styles.percentageParent}>%</h2>
        //         </div>
        //     </div>
        // </div>
        <>
            <CuponPage />
        </>
    )
}

