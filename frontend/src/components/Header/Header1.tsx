import React from "react";
import css from "./Header1.module.css";
import { Link } from "react-router-dom";
import {
  toggleLoginMode,
  toggleRegisterMode
} from '../../pages/Login/Login.duck';
import { useAppDispatch } from "../../store/hooks";

const Header1: React.FC = () => {
  const dispatch = useAppDispatch();

  const routeLogin = () => {
    dispatch(toggleLoginMode());
  }

  const routeRegister = () => {
    dispatch(toggleRegisterMode());
  }

  return (
    <header>
      <div className={css.container}>
        <div className={css.containerLeft}>
          <Link className={css.main} to={('/')}>Trang chủ</Link>
          <Link className={css.infor} to={('/')}>Thông tin</Link>
        </div>
        <div className={css.containerRight}>
          <Link  to={('/login')} onClick={routeLogin}>
            <button className={css.login}>
              Đăng nhập
            </button>
          </Link>
          <Link className={css.register} to={('/login')} onClick={routeRegister}>Tạo tài khoản</Link>
        </div>
      </div>
    </header>
  );
};

export default Header1;