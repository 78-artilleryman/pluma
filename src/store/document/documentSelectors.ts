// store/document/documentSelectors.ts

import { RootState } from "../../configureStore";

// 문서 관련 상태를 선택하는 셀렉터 함수들을 작성합니다.
export const selectDocument = (state: RootState) => state.document;
export const selectDocumentsList = (state: RootState) => state.document.documentsList;
export const selectSingleDocument = (state: RootState) => state.document.singleDocument;
export const selectDocumentLoading = (state: RootState) => state.document.loading;
export const selectDocumentError = (state: RootState) => state.document.error;
export const selectNewDocument = (state: RootState) => state.document.newDocument;
