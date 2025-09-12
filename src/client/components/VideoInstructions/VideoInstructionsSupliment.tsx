import React from "react";
import Vimeo from "@u-wave/react-vimeo";
import styles from "./VideoInstructions.module.scss";

const VideoInstructionsSupliment = () => {
  return (
    <div className={styles.blockPageSupliment}>
      <div className={styles.videoContainer}>
        <Vimeo video={"856566165"} autoplay responsive />
        <h2 className={styles.goPlay}>{"Video Suplimentar Punga A"}</h2>
      </div>
    </div>
  );
};

export default VideoInstructionsSupliment;
