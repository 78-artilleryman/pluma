import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, redirect, useNavigate } from "react-router-dom";
import { loginRequest } from "../../store/auth/authActions";
import { getInitialTheme } from "../../utils/theme";
import logo from "../../assets/FlumaLogo.png";

import styles from "./Auth.module.scss";
import { selectAuth, selectIsAuthenticated } from "../../store/auth/authSelectors";

import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const authState = useSelector(selectAuth);
  const navigate = useNavigate();

  useEffect(() => {
    console.log(authState);
  }, [authState]);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<{ username: string | null; password: string | null }>({
    username: null,
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const isAuthenticated = useSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/document");
    }
  }, [isAuthenticated]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { username, password } = formData;
    const newErrors = { username: "", password: "" };

    if (!username.trim()) {
      newErrors.username = "아이디를 입력하세요.";
    }

    if (!password.trim()) {
      newErrors.password = "비밀번호를 입력하세요.";
    }

    if (newErrors.username || newErrors.password) {
      setErrors(newErrors);
      return;
    }

    dispatch(loginRequest(formData));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", getInitialTheme());
  }, []);

  useEffect(() => {
    if (authState.error) {
      alert(authState.error);
    }
  }, [authState.error]);

  return (
    <div className={styles.authContainer}>
      <Link to="/">
        <img src={logo} alt="로고 이미지" className={styles.logo} />
      </Link>
      <form className={styles.authForm} onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
        <div>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            placeholder="아이디"
            onChange={handleChange}
          />
          <p
            className={
              errors.username ? `${styles.errorMessage} ${styles.show}` : styles.errorMessage
            }
          >
            {errors.username}
          </p>
        </div>
        <div className={styles.passwordInputContainer}>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            value={formData.password}
            placeholder="비밀번호"
            onChange={handleChange}
          />
          {formData.password !== "" && (
            <div
              className={styles.passwordToggleIcon}
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
            </div>
          )}
          <p
            className={
              errors.password ? `${styles.errorMessage} ${styles.show}` : styles.errorMessage
            }
          >
            {errors.password}
          </p>
        </div>

        <button type="submit" className={styles.loginButton}>
          로그인
        </button>
        <p>
          Fluma 회원이 아닌가요? <Link to="/register">지금 가입하세요</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
