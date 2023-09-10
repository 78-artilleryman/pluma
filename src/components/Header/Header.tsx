import React from "react";
import { Link } from "react-router-dom"; // react-router-dom을 사용하여 링크 생성
import ThemeToggle from "../ThemeToggle/ThemeToggle"; // 다크 모드 토글 컴포넌트
import logo from "../../assets/flumaLogo2.png";

import styles from "./Header.module.scss"; // CSS Modules 스타일

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <img src={logo} alt="로고 이미지" className={styles.logo} />
      </div>
      <div className={styles.buttonsContainer}>
        <ThemeToggle />
        <Link to="/register" className={styles.button}>
          회원가입
        </Link>
        <Link to="/login" className={styles.button}>
          로그인
        </Link>
      </div>
    </header>
  );
};

export default Header;
