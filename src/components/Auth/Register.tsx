import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  checkEmailAuthenticationRequest,
  emailAuthenticationRequest,
  registerRequest,
} from "../../store/auth/authActions";
import { getInitialTheme } from "../../utils/theme";

import logo from "../../assets/FlumaLogo.png";

import styles from "./Auth.module.scss";
import {
  selectAuthError,
  selectEmailVerified,
  selectIsAuthenticated,
  selectLoading,
  selectUserInfo,
} from "../../store/auth/authSelectors";

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ username: "", password: "", name: "" });
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const codeVerifying = useSelector(selectEmailVerified);
  const [isEmailVerified, setIsEmailVerified] = useState(false);

  //이메일 인증 관련
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [showVerify, setShowVerify] = useState(false);
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setVerificationCode(e.target.value);

  useEffect(() => {
    if (codeVerifying) {
      // `codeVerifying`이 `true`인 경우 이메일 인증이 성공한 것으로 간주
      setIsEmailVerified(codeVerifying);
    }
  }, [codeVerifying]);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const loading = useSelector(selectLoading); //각 요청 별 loading
  const authError = useSelector(selectAuthError);

  const sendVerificationEmail = () => {
    // 이메일 형식 확인을 위한 정규식
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
      setEmailError("이메일을 입력해주세요");
    } else if (!emailRegex.test(email)) {
      setEmailError("유효한 이메일 주소를 입력해주세요");
    } else {
      setEmailError("");
      dispatch(emailAuthenticationRequest({ email: email }));
      setShowVerify(true);
    }
  };

  const verifyEmail = () => {
    dispatch(checkEmailAuthenticationRequest({ email: email, code: verificationCode }));
  };

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

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
      setUsernameError("");
    }

    if (formData.password.trim() === "") {
      setPasswordError("비밀번호를 입력하세요.");
      hasError = true;
    } else {
      setPasswordError("");
    }

    if (formData.name.trim() === "") {
      setNameError("이름을 입력하세요.");
      hasError = true;
    } else {
      setNameError("");
    }
    if (!codeVerifying) {
      setEmailError("이메일 인증을 완료해주세요.");
      hasError = true;
    } else {
      setEmailError("");
    }

    if (hasError) {
      return;
    }

    dispatch(registerRequest(formData));
  };
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated]);
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", getInitialTheme());
  }, []);
  const userInfo = useSelector(selectUserInfo);

  useEffect(() => {
    if (userInfo !== null) {
      navigate("/document");
    }
  }, [userInfo]);
  return (
    <div className={styles.authContainer}>
      <div className={styles.logoContainer}>
        <Link to="/">
          <img src={logo} alt="로고 이미지" className={styles.logo} />
        </Link>
      </div>
      <h2>회원가입</h2>
      <form className={styles.authForm} onSubmit={handleSubmit}>
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
        <div className={styles.emailInputContainer}>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="이메일"
            value={email}
            onChange={handleEmailChange}
            required
            disabled={isEmailVerified}
          />
          <button
            type="button"
            className={styles.verifyEmailButton}
            onClick={(e) => {
              e.preventDefault();
              sendVerificationEmail();
            }}
            disabled={isEmailVerified || !email || loading.emailAuthentication}
          >
            {loading.emailAuthentication ? "전송 중..." : "인증메일전송"}
          </button>
        </div>
        <p className={nameError ? `${styles.errorMessage} ${styles.show}` : styles.errorMessage}>
          {emailError}
        </p>
        {authError.emailAuthentication && (
          <p className={`${styles.errorMessage} ${styles.show}`}>{authError.emailAuthentication}</p>
        )}
        {isEmailVerified && <p style={{ color: "green", fontSize: "15px" }}>이메일 인증 성공</p>}
        {showVerify && !isEmailVerified && (
          <div
            className={`${styles.animated} ${styles.fadeInDown} ${styles.verificationCodeInputContainer}`}
          >
            <input
              type="number"
              placeholder="인증 코드"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
              disabled={isEmailVerified}
            />
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                verifyEmail();
              }}
              className={styles.verifyCodeButton}
              disabled={isEmailVerified || !verificationCode || loading.checkEmailAuthentication}
            >
              {loading.checkEmailAuthentication ? "확인 중..." : "인증하기"}
            </button>
            <p
              className={nameError ? `${styles.errorMessage} ${styles.show}` : styles.errorMessage}
            >
              {emailError}
            </p>
          </div>
        )}
        <button
          type="submit"
          className={styles.registerButton}
          disabled={
            !formData.username.trim() ||
            !formData.password.trim() ||
            !formData.name.trim() ||
            !codeVerifying
          }
        >
          {loading.checkEmailAuthentication ? "확인 중..." : "회원가입"}
        </button>
      </form>
    </div>
  );
};

export default Register;
