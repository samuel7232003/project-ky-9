import React from "react";
import css from "./Home.module.css";
import { useTranslation } from "../hooks/useTranslation";
import { Link } from "react-router-dom";
import leaf from "../assets/images/leaf.png";
import pictureIllustrate from "../assets/images/picture-illustrate.png";

function Home() {
  const { t } = useTranslation();

  return (
    <div className={css.App}>
      <div className={css.container}>
        <div className={css.containerLeft}>
          <div className={css.containerText}>
            <p className={css.containerTitle}>
              Hệ thống tìm hiểu tri thức và theo dõi sức khỏe cây trồng
            </p>
            <p className={css.containerDescription}>
              Tích hợp trí tuệ nhân tạo, đồ thị tri thức và hệ thống điều khiển
              drone để thực hiện giám sát, theo dõi, phát hiện bệnh trên cây
              trồng.
            </p>
          </div>
          <Link to={"/main"} style={{ position: "relative" }}>
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
