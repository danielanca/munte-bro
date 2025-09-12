// import styles from "./Loader.module.scss";
import "../Loading.css"

const Loader = () => {
  return (
    <>
    {/* <div className={styles.wrapperLoader}>
      <div className={styles.spinner}>
        <div className={styles.spinnerItem} />
        <div className={styles.spinnerItem} />
        <div className={styles.spinnerItem} />
        <div className={styles.spinnerItem} />
        <div className={styles.spinnerItem} />
      </div>
    </div> */}


    <main className="product-page">
      {/* First Container */}
      <div className="product-info">
        {/* First Column */}
        <div className="column">
          <div className="image-placeholder"></div>
          <div className="gallery-container">
            <div className="gallery-item">
              <div className="gallery-image-placeholder"></div>
            </div>
            <div className="gallery-item">
              <div className="gallery-image-placeholder"></div>
            </div>
          </div>
        </div>
        
        {/* Second Column */}
        <div className="column">
          <div className="title-placeholder"></div>
          <div className="short-description-placeholder"></div>
          <div className="prices-placeholder">
            <div className="cut-price-placeholder"></div>
            <div className="original-price-placeholder"></div>
          </div>
          <div className="time-placeholder"></div>
          <div className="button-placeholder"></div>
        </div>
      </div>
      
      {/* Banner Container */}
      <div className="banner-placeholder"></div>
    </main>




</>

  );
};

export default Loader;
