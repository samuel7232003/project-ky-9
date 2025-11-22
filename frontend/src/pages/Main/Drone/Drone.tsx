import css from "./Drone.module.css";
import React from "react";

const Drone: React.FC = () => {
  return (
    <div className={css.droneContainer}>
      <div className={css.droneCamera}></div>
      <div className={css.droneControls}>
        <div className={css.controlLeft}>
          <button className={css.controlButton}>Speed More</button>
          <button className={css.controlButton}>Speed Less</button>
        </div>
        <div className={css.controlRight}>
          <button className={css.controlButton}>Move Forward</button>
          <button className={css.controlButton}>Move Backward</button>
          <button className={css.controlButton}>Rotate Left</button>
          <button className={css.controlButton}>Rotate Right</button>
        </div>
      </div>
    </div>
  );
};

export default Drone;
