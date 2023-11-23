import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../store/theme/themeReducers";
import { getTheme } from "../../store/theme/themeSelectors";
import styles from "./ThemeToggle.module.scss";

const ThemeToggle: React.FC = () => {
  const dispatch = useDispatch();
  const currentTheme = useSelector(getTheme); // 현재 테마 상태를 가져옵니다.

  const handleToggleTheme = () => {
    dispatch(toggleTheme()); // 테마 토글 액션을 디스패치합니다.
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
