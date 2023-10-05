import React, { useEffect } from "react";
import { getInitialTheme } from "./utils/theme";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./pages/Home/Home";
import DocumentsList from "./pages/List/DocumentList";
import { selectIsAuthenticated } from "./store/auth/authSelectors";
import { checkTokenExpiration } from "./utils/tokenUtils";
import "./App.module.scss";
import DocumentDetailPage from "./pages/Detail/DocumentDetail";
function App() {
  const initialTheme = getInitialTheme();
  const isAuthenticated = useSelector(selectIsAuthenticated);
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

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

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
