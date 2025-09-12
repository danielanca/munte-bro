import React from "react";
import Vimeo from "@u-wave/react-vimeo";
import styles from "./VideoInstructions.module.scss";

const VideoInstructions = () => {
  return (
    <div className={styles.blockPage}>
      <div className={styles.videoContainer}>
        <Vimeo video={"781399139"} autoplay responsive />
        <h2 className={styles.goPlay}>{"Instructiuni video"}</h2>
      </div>
    </div>
  );
};

export default VideoInstructions;
