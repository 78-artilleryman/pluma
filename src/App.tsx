import React, { useEffect } from "react";
import { getInitialTheme } from "./utils/theme";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./pages/Home/Home";
import DocumentsList from "./pages/List/DocumentList";
import { selectIsAuthenticated } from "./store/auth/authSelectors";
import { checkTokenExpiration } from "./utils/tokenUtils"; // 토큰 만료 검사 함수 추가

import "./App.module.scss";
import DocumentDetailPage from "./pages/Detail/DocumentDetail";

function App() {
  const initialTheme = getInitialTheme();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useDispatch();

  // 초기 테마 설정 코드를 useEffect 밖으로 이동
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, [initialTheme]); // initialTheme을 의존성 배열에 추가

  useEffect(() => {
    if (isAuthenticated) {
      // 인증된 경우, 일정한 간격으로 토큰 만료 검사를 수행
      const tokenCheckInterval = setInterval(() => {
        // 토큰 만료 검사 함수 호출
        checkTokenExpiration(dispatch);
      }, 60000); // 1분마다 검사 (60000 밀리초 = 1분)

      // 컴포넌트 언마운트 시 clearInterval로 간격 함수 정리
      return () => {
        clearInterval(tokenCheckInterval);
      };
    }
  }, [isAuthenticated, dispatch]); // isAuthenticated와 dispatch를 의존성 배열에 추가

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/document" element={<DocumentsList />} />
          <Route path="/document/:documentId" element={<DocumentDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
