import React from "react";
import styles from "./SocialLoginButtons.module.scss";

const SocialLoginButtons: React.FC = () => {
  const kauthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_REST_KEY}&redirect_uri=${process.env.REACT_APP_KAKAO_REDIRECT_URL}&response_type=code`;

  const handleSocialLogin = (service: string) => {
    console.log(`${service} 로그인을 진행합니다.`);
    if (service === "Kakao") {
      window.location.href = kauthUrl;
    }
  };

  return (
    <>
      <div className={styles.socialLoginTitle}> Social Login </div>
      <div className={styles.socialLoginContainer}>
        <button
          className={`${styles.socialLoginButton} ${styles.kakao}`}
          onClick={() => handleSocialLogin("Kakao")}
        />
        <button
          className={`${styles.socialLoginButton} ${styles.naver}`}
          onClick={() => handleSocialLogin("Naver")}
        />
        <button
          className={`${styles.socialLoginButton} ${styles.google}`}
          onClick={() => handleSocialLogin("Google")}
        />
      </div>
    </>
  );
};

export default SocialLoginButtons;
