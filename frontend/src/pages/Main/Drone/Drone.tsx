import css from "./Drone.module.css";
import React, { useState, useEffect, useRef } from "react";

interface DroneProps {
  cameraUrl?: string;
  refreshInterval?: number;
}

const Drone: React.FC<DroneProps> = ({ 
  cameraUrl = process.env.REACT_APP_DRONE_CAMERA_URL || "", 
  refreshInterval = 1000 
}) => {
  const [imageError, setImageError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!cameraUrl) return;

    const updateImage = () => {
      if (imgRef.current) {
        const timestamp = new Date().getTime();
        const separator = cameraUrl.includes("?") ? "&" : "?";
        imgRef.current.src = `${cameraUrl}${separator}t=${timestamp}`;
      }
    };

    // Initial load
    updateImage();

    // Set up interval for refreshing image
    const intervalId = setInterval(updateImage, refreshInterval);

    return () => {
      clearInterval(intervalId);
    };
  }, [cameraUrl, refreshInterval]);

  const handleImageError = () => {
    setImageError(true);
  };

  const handleImageLoad = () => {
    setImageError(false);
  };

  return (
    <div className={css.droneContainer}>
      <div className={css.droneDetector}>
        <div className={css.droneCamera}>
          {cameraUrl ? (
            <>
              <img
                ref={imgRef}
                src={cameraUrl}
                alt="Drone camera feed"
                className={css.droneCameraImage}
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
              {imageError && (
                <div className={css.droneCameraError}>
                  Không thể tải hình ảnh từ camera
                </div>
              )}
            </>
          ) : (
            <div className={css.droneCameraPlaceholder}>
              Chưa có URL camera được cấu hình
            </div>
          )}
        </div>
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