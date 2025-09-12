import React from 'react';
import styles from './Receipt.module.css'; // Assuming you will create a .css module file
import logo from '../../AdminDashboard/assets/images/School logo copy.jpg';

const Receipt: React.FC = () => {
  return (
    <div className={styles.receiptContainer}>
      {[...Array(2)].map((_, index) => (
        <div key={index} className={styles.receiptSection}>
          <div className={styles.header}>
            <img src={logo} alt="Royal Montessori School" className={styles.logo} />
            <div className={styles.schoolInfo}>
              <h2>ROYAL MONTESSORI SCHOOL</h2>
              <p>Loc: Atua- Dohetso (Adjacent G&J restaurant)</p>
              <p>Contact: 0245605345 / 0596153710</p>
              <p>RMR 002</p>
            </div>
          </div>

          <div className={styles.body}>
            <div className={styles.row}>
              <p>Name: ___________________________________________</p>
              <p>Date: ________________________</p>
            </div>
            <div className={styles.row}>
              <p>Class: ________________________</p>
              <p>Amount (in figures): ________________________</p>
            </div>
            <div className={styles.row}>
              <p>Amount in words: ___________________________________________</p>
            </div>
            <div className={styles.row}>
              <p>Balance: ___________________________________________</p>
              <p>Sign: ________________________</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Receipt;
