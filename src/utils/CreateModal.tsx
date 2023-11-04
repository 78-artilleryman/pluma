import React, { FC, ReactNode } from "react";
import style from "./Modal.module.scss";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const CreateModal: FC<CreateModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className={style.modalOverlay}>
      <div className={style.modalContainer}>{children}</div>
    </div>
  );
};

export default CreateModal;
