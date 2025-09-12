import React from "react";
import styles from "./WallFrame.module.css"; // Use the module CSS

interface WallFrameProps {
  moonImageUrl: string; // The moon image URL passed as a prop
}

const WallFrame: React.FC<WallFrameProps> = ({ moonImageUrl }) => {
  return (
    <div className={styles.wall}>
      <div className={styles.Frame}>
        <div
          className={styles.picture}
          style={{ backgroundImage: `url(${moonImageUrl})` }} // Dynamically apply moon image as background
        ></div>
        <div className={styles.glass}></div>
      </div>
      <div className={styles.text}>
        <svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' viewBox='0 0 280.01 260.02'>
          <path d='M159.77,9.36a28.16,28.16,0,0,1,16.44,3.77...' fill='#333' />
        </svg>
      </div>
    </div>
  );
};

export default WallFrame;
