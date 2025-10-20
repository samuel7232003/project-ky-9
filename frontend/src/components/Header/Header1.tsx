import React from "react";
import css from "./Header1.module.css";
import { useTranslation } from "../../hooks/useTranslation";
import { Link } from "react-router-dom";

const Header1: React.FC = () => {

  return (
    <header>
      <div className={css.container}>
        <div className={css.containerLeft}>
          <Link className={css.main} to={('/')}>Trang chủ</Link>
          <Link className={css.infor} to={('/')}>Thông tin</Link>
        </div>
        <div className={css.containerRight}>
          <Link  to={('/login')}>
            <button className={css.login}>
              Đăng nhập
            </button>
          </Link>
          <Link className={css.register} to={('/register')}>Tạo tài khoản</Link>
        </div>
      </div>
    </header>
  );
};

export default Header1;