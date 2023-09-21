import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus, faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { addDocumentRequest } from "../../store/document/documentActions";
import { selectUserInfo } from "../../store/auth/authSelectors";
import { selectNewDocument } from "../../store/document/documentSelectors";
import { getInitialTheme } from "../../utils/theme";
import CreateModal from "../../utils/CreateModal";
import styles from "./AddDocumentItem.module.scss";

const AddDocument: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userInfo = useSelector(selectUserInfo);
  const addDocument = useSelector(selectNewDocument);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newDocuments, setNewDocuments] = useState("");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", getInitialTheme());
  }, []);

  useEffect(() => {
    console.log(addDocument);
    if (addDocument) {
      navigate(`/document/${addDocument?.documentId}`);
    }
  }, [addDocument]);

  const openModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeModal = () => {
    setIsCreateModalOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewDocuments(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (userInfo) {
      dispatch(addDocumentRequest({ title: newDocuments, userId: userInfo?.userId }));
    }
    if (addDocument) {
      navigate(`/document/${addDocument.documentId}`);
    }
  };

  return (
    <div>
      <div className={styles.documentCard} onClick={openModal}>
        <FontAwesomeIcon className={styles.faSquarePlus} icon={faSquarePlus} />
      </div>

      {isCreateModalOpen && (
        <CreateModal isOpen={isCreateModalOpen} onClose={closeModal}>
          <form onSubmit={handleSubmit}>
            <FontAwesomeIcon
              className={styles.faCircleXmark}
              icon={faCircleXmark}
              onClick={closeModal}
            />
            <h2>새 문서 생성하기</h2>
            <input className={styles.title} type="text" onChange={handleInputChange} />
            <button type="submit" className={styles.linkDocument}>
              생성하기
            </button>
          </form>
        </CreateModal>
      )}
    </div>
  );
};

export default AddDocument;
