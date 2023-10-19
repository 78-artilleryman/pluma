// Home.tsx

import React, { useEffect } from "react";
import { getInitialTheme } from "../../utils/theme";
import styles from "./Home.module.scss"; // Home.module.scss 파일을 가져옵니다.
import Header from "../../components/Header/Header";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectIsAuthenticated } from "src/store/auth/authSelectors";
import { resetEmailAuthenticationRequest } from "src/store/auth/authActions";

const Home: React.FC = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();
  useEffect(() => {
    const initialTheme = getInitialTheme();
    document.documentElement.setAttribute("data-theme", initialTheme);
    dispatch(resetEmailAuthenticationRequest());
  }, []);
  const navigate = useNavigate();
  return (
    <div className={styles.homeContainer}>
      <Header />
      <div style={{ textAlign: "center", marginTop: "200px", width: "80%" }}>
        <h1 style={{ fontSize: "40px" }}>소설 창작의 편리한 파트너</h1>
        <p style={{ fontSize: "20px" }}>작품을 손쉽게 기록하고 관리하세요</p>
        <p style={{ fontSize: "15px" }}>
          소설 작가들이 작업을 더욱 편리하게 관리하고 창작에 집중할 수 있는 서비스입니다
        </p>
        <p style={{ fontSize: "20px" }}>
          작품의 가치를 높이고, 빛을 발하게 해주는 파일 관리 솔루션으로 소개합니다
        </p>
        <button
          className={styles.button}
          onClick={() => navigate(isAuthenticated ? "/document" : "/login")}
        >
          시작하기
        </button>
      </div>
      <div style={{ textAlign: "right", marginTop: "250px", width: "80%" }}>
        <h1 style={{ fontSize: "30px" }}>글을 쓰는 즐거움, 파일 관리의 간편함</h1>
        <p style={{ fontSize: "15px" }}>글 쓰는 과정을 더욱 즐겁게 만들며,</p>
        <p style={{ fontSize: "15px" }}>파일 관리를 효율적으로 수행할수 있도록 도움을 줍니다 </p>
      </div>
      <div style={{ textAlign: "left", marginTop: "250px", width: "80%", marginBottom: "100px" }}>
        <h1 style={{ fontSize: "30px" }}>작품에 AI 아트워크를 더하다</h1>
        <p style={{ fontSize: "15px" }}> 작품에 독특하고 아름다운 AI 생성 이미지를 통해</p>
        <p style={{ fontSize: "15px" }}>작가의 창작물을 더욱 풍부하게 만듭니다.</p>
      </div>
    </div>
  );
};

export default Home;
