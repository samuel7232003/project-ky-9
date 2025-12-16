import React from "react";
import css from "./Home.module.css";
import { useTranslation } from "../hooks/useTranslation";
import { Link } from "react-router-dom";
import leaf from "../assets/images/leaf.png";
import pictureIllustrate from "../assets/images/picture-illustrate.png";

function Home() {
  const { getLocalizedPath } = useTranslation();

  return (
    <div className={css.App}>
      <div className={css.container}>
        <div className={css.containerLeft}>
          <div className={css.containerText}>
            <p className={css.containerTitle}>
              DRONE GIÁM SÁT VÀ NHẬN DIỆN CON NGƯỜI
            </p>
            <p className={css.containerDescription}>
              Hệ thống điều khiển drone để thực hiện giám sát, theo dõi, phát hiện con người.
            </p>
          </div>
          <Link to={getLocalizedPath("/main")} style={{ position: "relative" }}>
            <button className={css.containerButton}>Bắt đầu ngay!</button>
            <img className={css.containerLeaf} src={leaf} alt="leaf" />
          </Link>
        </div>
        <div className={css.containerRight} style={{position: 'relative'}}>
          <img className={css.containerImage} src={pictureIllustrate} alt="Illustration" />
        </div>
      </div>
    </div>
  );
}

export default Home;
