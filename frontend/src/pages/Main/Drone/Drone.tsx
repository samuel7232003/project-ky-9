import css from "./Drone.module.css";
import React from "react";

const Drone: React.FC = () => {
  return (
    <div className={css.droneContainer}>
      <div className={css.droneDetector}>
        <div className={css.droneCamera}></div>
        <div className={css.droneFeatures}>
          <span className={css.droneFeaturesText}>Tổng số người: </span>
          <button className={css.droneFeaturesButton}>Chụp ảnh và nhận diện</button>
        </div>
      </div>
      <div className={css.droneControls}>
        <div className={css.controlLeft}>
          <button className={css.controlButton}>Tăng độ cao</button>
          <button className={css.controlButton}>Giảm độ cao</button>
        </div>
        <div className={css.controlRight}>
          <button className={css.controlButton}>Đi tới</button>
          <button className={css.controlButton}>Đi lui</button>
          <button className={css.controlButton}>Sang trái</button>
          <button className={css.controlButton}>Sang phải</button>
        </div>
      </div>
    </div>
  );
};

export default Drone;