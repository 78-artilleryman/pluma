import React, { useEffect, useState } from "react";
import { getInitialTheme } from "./utils/theme";
import { BrowserRouter as Router, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./pages/Home/Home";
import DocumentsList from "./pages/List/DocumentList";
import { selectUserInfo } from "./store/auth/authSelectors";
import { checkTokenExpiration, getTokenFromCookie } from "./utils/tokenUtils";
import "./App.module.scss";
import DocumentDetailPage from "./pages/Detail/DocumentDetail";

interface InnerAppProps {
  isAuthenticated: boolean;
}

function App() {
  const initialTheme = getInitialTheme();
  const userInfo = useSelector(selectUserInfo);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setIsAuthenticated(!!userInfo);
  }, [userInfo]);

  const dispatch = useDispatch();

  const setInitialTheme = () => {
    document.documentElement.setAttribute("data-theme", initialTheme);
  };

  useEffect(() => {
    // 새로고침 시 토큰 유효성 확인 및 인증 상태 복원
    const restoreAuthState = async () => {
      const access_token = getTokenFromCookie("access_token");
      if (access_token) {
        const isAccessTokenValid = checkTokenExpiration(dispatch);
        setIsAuthenticated(isAccessTokenValid);
      }
    };

    restoreAuthState();
    setInitialTheme();
  }, [initialTheme, dispatch]);

  const handleTokenExpirationCheck = () => {
    if (isAuthenticated) {
      const tokenCheckInterval = setInterval(() => {
        checkTokenExpiration(dispatch);
      }, 60000);

      return () => clearInterval(tokenCheckInterval);
    }
  };

  useEffect(handleTokenExpirationCheck, [isAuthenticated, dispatch]);

  return (
    <Router>
      <InnerApp isAuthenticated={isAuthenticated} />
    </Router>
  );
}

function InnerApp({ isAuthenticated }: InnerAppProps) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const isAuthPage = currentPath === "/login" || currentPath === "/register";
    const isPublicPage = currentPath === "/" || isAuthPage;
    const isDocumentDetailPage = currentPath.startsWith("/document/");

    if (!isAuthenticated && !isPublicPage && !isDocumentDetailPage) {
      navigate("/login");
    } else if (isAuthenticated && isAuthPage) {
      navigate("/");
    }
  }, [isAuthenticated, navigate, location.pathname]);

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
