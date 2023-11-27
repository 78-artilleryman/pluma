import React, { useEffect, useState } from "react";
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
import { getTheme } from "./store/theme/themeSelectors";
import { setTheme } from "./store/theme/themeReducers";
import KakaoRedirectHandler from "./components/Auth/KakaoRedirectHandler";

interface InnerAppProps {
  isAuthenticated: boolean;
}

function App() {
  const userInfo = useSelector(selectUserInfo);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const dispatch = useDispatch();
  const currentTheme = useSelector(getTheme);
  useEffect(() => {
    setIsAuthenticated(!!userInfo);
  }, [userInfo]);

  useEffect(() => {
    // localStorage에서 테마를 가져옵니다.
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) {
      dispatch(setTheme(storedTheme));
    } else {
      dispatch(setTheme(currentTheme));
    }
  }, [dispatch]);

  useEffect(() => {
    // 현재 테마 상태를 `data-theme` 속성에 반영합니다.
    document.documentElement.setAttribute("data-theme", currentTheme);
    // localStorage에도 저장합니다.
    localStorage.setItem("theme", currentTheme);
  }, [currentTheme]);

  useEffect(() => {
    if (isAuthenticated) {
      const tokenCheckInterval = setInterval(() => {
        checkTokenExpiration(dispatch);
      }, 60000);

      return () => clearInterval(tokenCheckInterval);
    }
  }, [isAuthenticated, dispatch]);

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
    const isAuthPage =
      currentPath === "/login" || currentPath === "/register" || currentPath === "/oauth/kakao";
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
        <Route path="/oauth/kakao" element={<KakaoRedirectHandler />} />
        <Route path="/register" element={<Register />} />
        <Route path="/document" element={<DocumentsList />} />
        <Route path="/document/:documentId" element={<DocumentDetailPage />} />
      </Routes>
    </div>
  );
}

export default App;
