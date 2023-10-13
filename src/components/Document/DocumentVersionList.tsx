import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loadDocumentVersionsRequest,
  addDocumentVersionRequest,
  loadDocumentVersionRequest,
  deleteDocumentVersionRequest,
  loadCompareDocumentVersionRequest,
} from "../../store/version/versionActions";
import {
  selectVersionsList,
  selectSingleVersion,
  selectAddedVersion,
  selectCompareVersion,
} from "../../store/version/versionSelectors";
import styles from "./DocumentVersionList.module.scss";
import { timeSince } from "../../utils/TimeSince";
import CreateModal from "src/utils/CreateModal";

interface VersionListProps {
  content: string | null;
  setContent: (content: string) => void;
  setComparatorContent: (content: string) => void;
  setSelectedVersionSubtitle: (subtitle: string) => void;
  setSelectedVersionDate: (date: string) => void;
  setIsComparatorVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

const DocumentVersionList: React.FC<VersionListProps> = ({
  content,
  setContent,
  setComparatorContent,
  setSelectedVersionSubtitle,
  setSelectedVersionDate,
  setIsComparatorVisible,
}) => {
  const { documentId } = useParams();
  const dispatch = useDispatch();
  const versions = useSelector(selectVersionsList);
  const versionInfo = useSelector(selectSingleVersion);
  const compareVersionInfo = useSelector(selectCompareVersion);
  const addedVersion = useSelector(selectAddedVersion);
  const [selectedVersionId, setSelectedVersionId] = useState<number | null>(null);
  const [comparingVersionId, setComparingVersionId] = useState<number | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [contentChanged, setContentChanged] = useState(false);
  const [initialContent, setInitialContent] = useState<string | null>(null);

  useEffect(() => {
    // 초기 콘텐츠 값을 설정
    setInitialContent(content);
  }, []);

  const handleVersionClick = (version: any, event: React.MouseEvent) => {
    event.stopPropagation();
    dispatch(loadDocumentVersionRequest(version.id));
    setIsComparatorVisible(false);
  };
  useEffect(() => {
    // 초기 콘텐츠 값과 현재 콘텐츠 값을 비교하여 contentChanged를 업데이트
    if (content !== initialContent) {
      setContentChanged(true);
    }
  }, [content, initialContent]);
  useEffect(() => {
    if (addedVersion) {
      setSelectedVersionId(addedVersion.versionId);
      setSelectedVersionSubtitle(addedVersion.subtitle);
      setSelectedVersionDate(addedVersion.createdAt);
      setContent(addedVersion.content);
    }
  }, [addedVersion]);
  const handleCtrlS = (event: KeyboardEvent) => {
    if ((event.ctrlKey && event.key === "s") || (event.metaKey && event.key === "s")) {
      event.preventDefault();
      if (!contentChanged) {
        alert("수정된 내용이 없습니다.");
        return;
      }
      setIsModalOpen(true);
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleCtrlS);
    return () => {
      window.removeEventListener("keydown", handleCtrlS);
    };
  }, [contentChanged]);

  const handleAddVersion = () => {
    if (contentChanged) {
      setIsModalOpen(true);
    } else {
      alert("변경된 내용이 없습니다");
      return;
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSubtitle("");
  };

  const handleModalSubmit = () => {
    if (!subtitle) {
      alert("버전 이름을 입력해주세요.");
      return;
    }
    const currentDate = new Date();
    const createdAt = currentDate.toISOString();
    if (documentId) {
      const newVersionInfo = {
        subtitle: subtitle,
        documentId: Number(documentId),
        content: content || "",
        createdAt: createdAt,
      };
      dispatch(addDocumentVersionRequest(newVersionInfo));

      setIsModalOpen(false);
      setSubtitle("");
    }
  };

  const handleVersionItemClick = (version: any) => {
    setIsComparatorVisible(true);
    dispatch(loadCompareDocumentVersionRequest(version.id));
  };

  useEffect(() => {
    if (documentId) {
      dispatch(loadDocumentVersionsRequest(documentId));
    }
  }, [documentId, dispatch]);

  useEffect(() => {
    if (versionInfo) {
      setSelectedVersionId(versionInfo.versionId);
      setContent(versionInfo.content);
      setSelectedVersionSubtitle(versionInfo.subtitle);
      setSelectedVersionDate(versionInfo.createdAt);
      setComparingVersionId(null);
      setComparatorContent(versionInfo.content);
      setSelectedVersionSubtitle(versionInfo.subtitle);
      setSelectedVersionDate(versionInfo.createdAt);
    }
  }, [versionInfo, setSelectedVersionSubtitle, setSelectedVersionDate]);

  useEffect(() => {
    if (compareVersionInfo) {
      setComparingVersionId(compareVersionInfo.versionId);
      setComparatorContent(compareVersionInfo.content);
      setSelectedVersionSubtitle(compareVersionInfo.subtitle);
      setSelectedVersionDate(compareVersionInfo.createdAt);
    }
  }, [
    compareVersionInfo,
    setComparatorContent,
    setSelectedVersionSubtitle,
    setSelectedVersionDate,
  ]);

  useEffect(() => {
    if (selectedVersionId !== null) {
      dispatch(loadDocumentVersionRequest(selectedVersionId));
    }
  }, [selectedVersionId, dispatch]);

  const handleModalOuterClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      handleModalClose();
    }
  };

  const handleDeleteVersionClick = (versionId: number) => {
    setVersionIdToDelete(versionId);
    setIsDeleteConfirmationModalOpen(true);
  };

  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [versionIdToDelete, setVersionIdToDelete] = useState<number | null>(null);

  const handleConfirmDeleteVersion = () => {
    if (versionIdToDelete !== null && documentId) {
      dispatch(deleteDocumentVersionRequest({ documentId, versionId: String(versionIdToDelete) }));
    }
    setIsDeleteConfirmationModalOpen(false);
    setVersionIdToDelete(null);
    setContent("");
  };
  const gandleCloseModal = () => {
    setIsDeleteConfirmationModalOpen(false);
    setVersionIdToDelete(null);
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
        }}
      >
        <h3>문서 버전</h3>
        <button onClick={handleAddVersion} className={styles.addButton}>
          +
        </button>
      </div>
      <div className={styles.versionList}>
        {versions?.map((version) => (
          <div
            key={version.id}
            className={`${styles.versionItem} ${
              selectedVersionId === version.id ? styles.selectedVersion : ""
            } ${comparingVersionId === version.id ? styles.comparingVersion : ""}
            `}
            onClick={() => handleVersionItemClick(version)}
          >
            <span style={{ width: "40%" }}> {version.subtitle}</span>
            <span> {timeSince(version.createdAt)}</span>
            <div>
              <button onClick={(event) => handleVersionClick(version, event)}>이동</button>
              <button onClick={() => handleDeleteVersionClick(version.id)}>삭제</button>
            </div>
          </div>
        ))}

        {isDeleteConfirmationModalOpen && (
          <CreateModal isOpen={isDeleteConfirmationModalOpen} onClose={gandleCloseModal}>
            <h2>버전</h2>
            <p>정말로 이 버전을 삭제하시겠습니까?</p>
            <button
              className={styles.dangerBtn}
              style={{ marginRight: "10px" }}
              onClick={handleConfirmDeleteVersion}
            >
              네, 삭제합니다
            </button>
            <button className={styles.button} onClick={gandleCloseModal}>
              아니오, 취소합니다
            </button>
          </CreateModal>
        )}
      </div>
      {isModalOpen && (
        <div className={styles.modalContainer} onClick={handleModalOuterClick}>
          <div className={styles.modalContent}>
            <div>버전 이름</div>
            <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
            <button onClick={handleModalSubmit}>확인</button>
            <button onClick={handleModalClose}>취소</button>
          </div>
        </div>
      )}
    </>
  );
};

export default DocumentVersionList;
