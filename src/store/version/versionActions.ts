import { createAction } from "@reduxjs/toolkit";
import { sendVersion, VersionDetailInfo, VersionInfo } from "./versionTypes";

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

// 문서 버전 로딩
export const loadDocumentVersionRequest = createAction<string>(
  "version/loadDocumentVersionRequest"
);
export const loadDocumentVersionSuccess = createAction<VersionDetailInfo | null>(
  "version/loadDocumentVersionSuccess"
);
export const loadDocumentVersionFailure = createAction<string>(
  "version/loadDocumentVersionFailure"
);
