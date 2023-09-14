import React, { FC, ReactNode } from "react";
import style from "./Modal.module.scss";
import { Link } from "react-router-dom"; // React Router의 Link 컴포넌트를 import

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContainer}>
        {children}
        <Link to="/login" className={style.linkToLogin}>
          로그인 페이지로 이동
        </Link>
      </div>
    </div>
  );
};

export default Modal;
