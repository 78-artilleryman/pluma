import React, { useEffect } from "react";
import { getInitialTheme } from "./utils/theme";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./pages/Home/Home";
import DocumentsList from "./pages/List/DocumentList";
import { selectIsAuthenticated } from "./store/auth/authSelectors";

import "./App.module.scss";
import DocumentDetailPage from "./pages/Detail/DocumentDetail";

function App() {
  const initialTheme = getInitialTheme();
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // 초기 테마 설정 코드를 useEffect 밖으로 이동
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      console.log(isAuthenticated);
      // 로그인 후 리디렉션을 여기서 수행하지 않음
    }
  }, [isAuthenticated]);

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
