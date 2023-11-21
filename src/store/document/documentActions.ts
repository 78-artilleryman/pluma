// store/document/documentActions.ts
import { createAction } from "@reduxjs/toolkit";
import { DocumentInfo, DocumentDetailInfo, AddDocument } from "./types";

// 문서 리스트 로딩
export const loadDocumentsRequest = createAction<string | null>("document/loadDocumentsRequest");
export const loadDocumentsSuccess = createAction<DocumentInfo[] | null>(
  "document/loadDocumentsSuccess"
);
export const loadDocumentsFailure = createAction<string>("document/loadDocumentsFailure");

// 단일 문서 로딩
export const loadDocumentRequest = createAction<string>("document/loadDocumentRequest");
export const loadDocumentSuccess = createAction<DocumentDetailInfo | null>(
  "document/loadDocumentSuccess"
);
export const loadDocumentFailure = createAction<string>("document/loadDocumentFailure");

// 문서 추가
export const addDocumentRequest = createAction<AddDocument>("document/addDocumentRequest");
export const addDocumentSuccess = createAction<DocumentInfo>("document/addDocumentSuccess");
export const addDocumentFailure = createAction<string>("document/addDocumentFailure");

// 문서 삭제
export const deleteDocumentRequest = createAction<{
  userId: string | undefined;
  documentId: string;
}>("document/deleteDocumentRequest");
export const deleteDocumentSuccess = createAction<string>("document/deleteDocumentSuccess");
export const deleteDocumentFailure = createAction<string>("document/deleteDocumentFailure");
