import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerRequest } from "../../store/auth/authActions";
import { getInitialTheme } from "../../utils/theme";

import logo from "../../assets/FlumaLogo.png";

import styles from "./Auth.module.scss";
import { selectIsAuthenticated } from "../../store/auth/authSelectors";

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: "", password: "", name: "" });
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
  const navigate = useNavigate();
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // 입력값이 변경될 때마다 에러 메시지 초기화
    if (name === "username") {
      setUsernameError("");
    } else if (name === "password") {
      setPasswordError("");
    } else if (name === "nickname") {
      setNameError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    if (formData.username.trim() === "") {
      setUsernameError("아이디를 입력하세요.");
      hasError = true;
    } else {
      setUsernameError(""); // 에러가 없을 때 에러 메시지 초기화
    }

    if (formData.password.trim() === "") {
      setPasswordError("비밀번호를 입력하세요.");
      hasError = true;
    } else {
      setPasswordError(""); // 에러가 없을 때 에러 메시지 초기화
    }

    if (formData.name.trim() === "") {
      setNameError("이름을 입력하세요.");
      hasError = true;
    } else {
      setNameError(""); // 에러가 없을 때 에러 메시지 초기화
    }

    if (hasError) {
      // 에러가 있는 경우 요청을 보내지 않음
      return;
    }

    dispatch(registerRequest(formData));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", getInitialTheme());
  }, []);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  useEffect(() => {
    if (isAuthenticated) {
      navigate(-1);
    }
  }, [isAuthenticated]);
  return (
    <div className={styles.authContainer}>
      <div className={styles.logoContainer}>
        <Link to="/">
          <img src={logo} alt="로고 이미지" className={styles.logo} />
        </Link>
      </div>
      <h2>회원가입</h2>
      <form className={styles.authForm} onSubmit={handleSubmit} onKeyPress={handleKeyPress}>
        <div>
          <input
            type="text"
            id="username"
            name="username"
            placeholder="아이디"
            value={formData.username}
            onChange={handleChange}
          />
          <p
            className={
              usernameError ? `${styles.errorMessage}  ${styles.show}` : styles.errorMessage
            }
          >
            {usernameError}
          </p>
        </div>
        <div>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
          />
          <p
            className={
              passwordError ? `${styles.errorMessage} ${styles.show}` : styles.errorMessage
            }
          >
            {passwordError}
          </p>
        </div>
        <div>
          <input
            type="name"
            id="name"
            name="name"
            placeholder="이름"
            value={formData.name}
            onChange={handleChange}
          />
          <p className={nameError ? `${styles.errorMessage} ${styles.show}` : styles.errorMessage}>
            {nameError}
          </p>
        </div>
        <button type="submit" className={styles.registerButton}>
          회원가입
        </button>
      </form>
    </div>
  );
};

export default Register;
