// App.js

import React, { useEffect } from "react";
import { getInitialTheme } from "./utils/theme";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/configureStore";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./pages/Home/Home";
import "./App.module.scss"; // App.module.scss 파일을 불러옵니다.

function App() {
  const initialTheme = getInitialTheme();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", initialTheme);
  }, [initialTheme]);

  return (
    <Provider store={store}>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
