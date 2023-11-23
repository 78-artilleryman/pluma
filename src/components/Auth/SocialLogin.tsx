import React from "react";
import styles from "./SocialLoginButtons.module.scss";

const SocialLoginButtons: React.FC = () => {
  const handleSocialLogin = (service: string) => {
    console.log(`${service} 로그인을 진행합니다.`);
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
