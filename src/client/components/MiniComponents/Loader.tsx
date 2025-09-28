import styles from "./../MiniComponents/Loader.module.scss";

const Loader = () => {
  return (
    <div className={styles.wrapperLoader}>
      <div className={styles.spinner}>
        <div className={styles.spinnerItem} />
        <div className={styles.spinnerItem} />
        <div className={styles.spinnerItem} />
        <div className={styles.spinnerItem} />
        <div className={styles.spinnerItem} />
      </div>
    </div>
  );
};

export default Loader;
