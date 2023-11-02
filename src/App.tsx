import React, { useEffect, useState } from "react";
import { getInitialTheme } from "./utils/theme";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./pages/Home/Home";
import DocumentsList from "./pages/List/DocumentList";
import { selectUserInfo } from "./store/auth/authSelectors";
import { checkTokenExpiration } from "./utils/tokenUtils";
import "./App.module.scss";
import DocumentDetailPage from "./pages/Detail/DocumentDetail";
function App() {
  const initialTheme = getInitialTheme();
  const userInfo = useSelector(selectUserInfo);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  useEffect(() => {
    if (userInfo) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [userInfo]);
  const dispatch = useDispatch();

  const setInitialTheme = () => {
    document.documentElement.setAttribute("data-theme", initialTheme);
  };

  const handleTokenExpirationCheck = () => {
    if (isAuthenticated) {
      const tokenCheckInterval = setInterval(() => {
        checkTokenExpiration(dispatch);
      }, 60000);

      return () => {
        clearInterval(tokenCheckInterval);
      };
    }
  };

  useEffect(setInitialTheme, [initialTheme]);
  useEffect(handleTokenExpirationCheck, [isAuthenticated, dispatch]);

  return (
    <Router>
      <InnerApp isAuthenticated={isAuthenticated} />
    </Router>
  );
}

function InnerApp({ isAuthenticated }: { isAuthenticated: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (
      !isAuthenticated &&
      location.pathname !== "/" &&
      location.pathname !== "/login" &&
      location.pathname !== "/register"
    ) {
      navigate("/login");
    } else if (
      isAuthenticated &&
      (location.pathname === "/login" || location.pathname === "/register")
    ) {
      navigate("/"); // 로그인 상태에서는 로그인 또는 회원가입 페이지에 접근하면 홈으로 리다이렉트
    }
  }, [isAuthenticated, navigate, location]);

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/document" element={<DocumentsList />} />
        <Route path="/document/:documentId" element={<DocumentDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
