import { createAction } from "@reduxjs/toolkit";
import { sendVersion, VersionDetailInfo, VersionInfo, SendPicture } from "./versionTypes";

// 문서 버전 로딩
export const loadDocumentVersionsRequest = createAction<string>(
  "version/loadDocumentVersionsRequest"
);
export const loadDocumentVersionsSuccess = createAction<VersionInfo[] | null>(
  "version/loadDocumentVersionsSuccess"
);
export const loadDocumentVersionsFailure = createAction<string>(
  "version/loadDocumentVersionsFailure"
);

// 문서 버전 추가
export const addDocumentVersionRequest = createAction<sendVersion>(
  "version/addDocumentVersionRequest"
);
export const addDocumentVersionSuccess = createAction<sendVersion>(
  "version/addDocumentVersionSuccess"
);
export const addDocumentVersionFailure = createAction<string>("version/addDocumentVersionFailure");
// 문서 버전 삭제
export const deleteDocumentVersionRequest = createAction<{
  versionId: string;
  documentId: string | undefined;
}>("version/deleteDocumentVersionRequest");
export const deleteDocumentVersionSuccess = createAction<{ id: string }>(
  "version/deleteDocumentVersionSuccess"
);

export const deleteDocumentVersionFailure = createAction<string>(
  "version/deleteDocumentVersionFailure"
);

// 문서 버전 로딩
export const loadDocumentVersionRequest = createAction<number>(
  "version/loadDocumentVersionRequest"
);
export const loadDocumentVersionSuccess = createAction<VersionDetailInfo | null>(
  "version/loadDocumentVersionSuccess"
);
export const loadDocumentVersionFailure = createAction<string>(
  "version/loadDocumentVersionFailure"
);

// 비교 문서 버전 로딩
export const loadCompareDocumentVersionRequest = createAction<number>(
  "version/loadCompareDocumentVersionRequest"
);
export const loadCompareDocumentVersionSuccess = createAction<VersionDetailInfo | null>(
  "version/loadCompareDocumentVersionSuccess"
);
export const loadCompareDocumentVersionFailure = createAction<string>(
  "version/loadCompareDocumentVersionFailure"
);

// 사진 업로드
export const uploadPictureRequest = createAction<SendPicture>("version/uploadPictureRequest");
export const uploadPictureSuccess = createAction<any>("version/uploadPictureSuccess");
export const uploadPictureFailure = createAction<any>("version/uploadPictureFailure");
