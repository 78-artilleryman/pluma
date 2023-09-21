import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "../ThemeToggle/ThemeToggle";
import logo from "../../assets/flumaLogo2.png";

import styles from "./Header.module.scss";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated, selectUser } from "../../store/auth/authSelectors";
import { logoutRequest } from "../../store/auth/authActions";
import ModalStyles from "../../utils/Modal.module.scss"; // Modal 스타일 파일 import

const Header = () => {
  const isLogin = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const dispatch = useDispatch();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const openLogoutModal = () => {
    setLogoutModalOpen(true);
  };

  const closeLogoutModal = () => {
    setLogoutModalOpen(false);
  };

  const confirmLogout = () => {
    dispatch(logoutRequest());
    closeLogoutModal();
  };
  useEffect(() => {
    console.log(user);
  }, [user]);

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to={isLogin ? "/document" : "/"}>
          <img src={logo} alt="로고 이미지" className={styles.logo} />
        </Link>
      </div>

      <div className={styles.buttonsContainer}>
        <ThemeToggle />
        {user ? (
          <>
            <span>{user}</span>
            <button className={styles.button} onClick={openLogoutModal}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <Link to="/register" className={styles.button}>
              회원가입
            </Link>
            <Link to="/login" className={styles.button}>
              로그인
            </Link>
          </>
        )}
      </div>

      {/* 로그아웃 확인 모달 */}
      {isLogoutModalOpen && (
        <div className={ModalStyles.modalOverlay}>
          <div className={ModalStyles.modalContainer}>
            <p>정말 로그아웃 하시겠습니까?</p>
            <button onClick={confirmLogout} className={styles.dangerBtn}>
              로그아웃
            </button>
            <button onClick={closeLogoutModal} className={styles.button}>
              취소
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
