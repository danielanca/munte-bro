import React from "react";
import styles from "./Contactinfo.module.scss";
import { FaFacebookF, FaPinterestP, FaTiktok, FaInstagram } from "react-icons/fa";
import { FiPhone, FiMail } from "react-icons/fi";

const Contactinfo = () => {
  return (
    <div className={styles.contact}>
      <div className={styles.box}>
        <h2 className={styles.title}>SOCIAL</h2>
        <p className={styles.subtitle}>Urmaraste-ne in social media</p>

        <div className={styles.icons}>
          <a href="#"><FaFacebookF /></a>
          <a href="#"><FaPinterestP /></a>
          <a href="#"><FaTiktok /></a>
          <a href="#"><FaInstagram /></a>
        </div>
      </div>

      <div className={styles.box}>
        <h2 className={styles.title}>SUPORT CLIENTI</h2>
        <p className={styles.subtitle}>Luni-Duminica: 9-18</p>

        <div className={styles.contactLine}>
          <FiPhone /> <span>0752328965</span>
        </div>
        <div className={styles.contactLine}>
          <FiPhone /> <span>0759791474</span>
        </div>
        <div className={styles.contactLine}>
          <FiMail /> <span>dinmunte@gmail.com</span>
        </div>
      </div>
    </div>
  );
};

export default Contactinfo;
