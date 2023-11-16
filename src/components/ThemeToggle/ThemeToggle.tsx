// ThemeToggle.js

import React, { useState, useEffect } from "react";
import { getInitialTheme, toggleTheme } from "../../utils/theme";
import styles from "./ThemeToggle.module.scss"; // 테마 토글 스위치 컴포넌트의 스타일 파일을 불러옵니다.

const ThemeToggle: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState(getInitialTheme());

  useEffect(() => {
    setCurrentTheme(getInitialTheme());
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", currentTheme);
  }, [currentTheme]);

  const handleToggleTheme = () => {
    toggleTheme(setCurrentTheme);
    setCurrentTheme(getInitialTheme());
  };

  return (
    <div className={styles.themeToggle}>
      <label className={styles.switch}>
        <input type="checkbox" checked={currentTheme === "dark"} onChange={handleToggleTheme} />
        <span className={styles.slider}></span>
      </label>
      <span className={styles.themeText}>
        {currentTheme === "light" ? "라이트 모드" : "다크 모드"}
      </span>
    </div>
  );
};

export default ThemeToggle;
