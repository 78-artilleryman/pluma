import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { loginRequest } from "../../store/auth/authActions";
import { RootState } from "../../store/configureStore";
import { getInitialTheme } from "../../utils/theme";
import logo from "../../assets/FlumaLogo.png";

import styles from "./Auth.module.scss";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const authState = useSelector((state: RootState) => state.auth);

  const [formData, setFormData] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState<{ username: string | null; password: string | null }>({
    username: null,
    password: "",
  }); // 여기서 password를 빈 문자열로 초기화

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // 입력값이 변경될 때마다 에러 메시지 초기화
    setErrors({ ...errors, [name]: "" });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { username, password } = formData;
    const newErrors = { username: "", password: "" }; // 빈 문자열로 초기화

    if (!username.trim()) {
      newErrors.username = "아이디를 입력하세요.";
    }

    if (!password.trim()) {
      newErrors.password = "비밀번호를 입력하세요.";
    }

    if (newErrors.username || newErrors.password) {
      // 에러가 있는 경우 에러 상태를 업데이트하고 요청을 보내지 않음
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
      // 로그인 실패 시 에러 메시지 설정
      setErrors({ username: authState.error, password: "" });
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
              errors.password ? `${styles.errorMessage}  ${styles.show}` : styles.errorMessage
            }
          >
            {errors.username}
          </p>
        </div>
        <div>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            placeholder="비밀번호"
            onChange={handleChange}
          />
          <p
            className={
              errors.password ? `${styles.errorMessage}  ${styles.show}` : styles.errorMessage
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
