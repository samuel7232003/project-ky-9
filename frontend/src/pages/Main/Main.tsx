import css from "./Main.module.css";
import { Link, Route, Routes } from "react-router-dom";
import KnowledgeLib from "./KnowledgeLib/KnowledgeLib";
import image3 from "../../assets/images/image 3.png";
import image4 from "../../assets/images/image 4.png";
import image5 from "../../assets/images/image 5.png";
import chevron_left from "../../assets/images/chevron-left.png";
import chevron_right from "../../assets/images/chevron-right.png";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleMenu } from "./Main.duck";

function Main() {
  const dispatch = useAppDispatch();
  const { isOpenMenu } = useAppSelector((state) => state.main);
  const contentWidth = isOpenMenu ? "calc(100vw - 308px)" : "calc(100vw - 24px)";

  const handleMenuClick = () => {
    dispatch(toggleMenu());
  };

  return (
      <div className={css.container}>
        {isOpenMenu ? (
          <div className={css.tools}>
            <div className={css.toolsList}>
              <p className={css.toolsTitle}>Công cụ:</p>
              <Link to={"/"} className={css.buttonTool}>
                <figure className={css.imgContainer}>
                  <img src={image3} alt="" />
                </figure>
                <p className={css.buttonToolText}>Drone giám sát</p>
              </Link>
              <Link to={"/"} className={css.buttonTool}>
                <figure className={css.imgContainer}>
                  <img src={image4} alt="" />
                </figure>
                <p className={css.buttonToolText}>Tình trạng cây trồng</p>
              </Link>
              <Link to={"/main/lib"} className={css.buttonTool}>
                <figure className={css.imgContainer}>
                  <img src={image5} alt="" />
                </figure>
                <p className={css.buttonToolText}>Thư viện tri thức</p>
              </Link>
            </div>
            <figure className={css.chevron} onClick={handleMenuClick}>
              <img src={chevron_left} alt="" />
            </figure>
          </div>
        ) : (
          <figure className={css.chevron} style={{backgroundColor: "rgba(255, 253, 253, 0.8)"}} onClick={handleMenuClick}>
            <img src={chevron_right} alt="" />
          </figure>
        )}
        <div className={css.content} style={{ width: contentWidth }}>
          <MainRoute />
        </div>
      </div>
  );
}

function MainRoute() {
  return (
    <Routes>
      <Route index element={<KnowledgeLib />} />

      <Route path="lib" element={<KnowledgeLib />} />
    </Routes>
  );
}

export default Main;
