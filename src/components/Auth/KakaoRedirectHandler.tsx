import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { kakaoLoginRequest } from "../../store/auth/authActions"; // 가정된 액션
import { ClimbingBoxLoader } from "react-spinners";
import { getTheme } from "src/store/theme/themeSelectors";
const KakaoRedirectHandler: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useSelector(getTheme);
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      dispatch(kakaoLoginRequest(code)); // 카카오 로그인 요청 액션 디스패치
    } else {
      navigate("/login"); // 로그인 실패 시 이동할 경로
    }
  }, [dispatch, navigate]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        height: "100vh", // 화면 전체 높이를 차지하도록 설정합니다.
      }}
    >
      <h2 style={{ margin: "2rem" }}>카카오 로그인 시도 중</h2>
      <ClimbingBoxLoader size={30} color={theme === "dark" ? "#ffffff" : "#000000"} />
    </div>
  );
};

export default KakaoRedirectHandler;
