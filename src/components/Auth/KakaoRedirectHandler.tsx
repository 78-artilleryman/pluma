import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { kakaoLoginRequest } from "../../store/auth/authActions"; // 가정된 액션

const KakaoRedirectHandler: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      dispatch(kakaoLoginRequest(code)); // 카카오 로그인 요청 액션 디스패치
    } else {
      navigate("/login"); // 로그인 실패 시 이동할 경로
    }
  }, [dispatch, navigate]);

  return <div>Processing Kakao Login...</div>;
};

export default KakaoRedirectHandler;
