import { PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { getTokenFromCookie } from "../../utils/tokenUtils";
import { logoutRequest } from "../auth/authActions";
import {
  loadDocumentsRequest,
  loadDocumentsSuccess,
  loadDocumentsFailure,
  loadDocumentRequest,
  loadDocumentSuccess,
  loadDocumentFailure,
  addDocumentRequest,
  addDocumentSuccess,
  addDocumentFailure,
  deleteDocumentRequest,
  deleteDocumentSuccess,
  deleteDocumentFailure,
} from "./documentActions";
import { DocumentInfo } from "./types";

// 글 리스트 로딩
function* loadDocuments(action: any) {
  try {
    // 쿠키에서 accessToken 가져오기
    const access_token = getTokenFromCookie("access_token");
    if (access_token) {
      // API 호출
      const response: AxiosResponse<any> = yield call(() =>
        axios.get(`/documents?userId=${action.payload}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        })
      );
      if (response.status === 200) {
        const documents: DocumentInfo[] = response.data.dtoList;
        // console.log(response.data);
        yield put(loadDocumentsSuccess(documents));
      } else if (response.data.error === "토큰 기한 만료") {
        // 토큰이 만료되었다면 로그아웃을 실행
        yield put(loadDocumentFailure("토큰이 만료되었습니다."));
        yield put(logoutRequest());
      } else {
        yield put(loadDocumentsFailure("문서목록 로딩에 실패했습니다."));
        yield put(logoutRequest());
      }
    } else {
      yield put(loadDocumentsFailure("문서목록 로딩에 실패했습니다."));
      yield put(logoutRequest());
    }
  } catch (error) {
    if ((error as any).response && (error as any).response.data.error === "토큰 기한 만료") {
      yield put(loadDocumentFailure("토큰이 만료되었습니다."));
      console.log("토큰이 만료되었습니다.");
      yield put(logoutRequest());
    } else {
      console.error("문서목록 로딩에 실패했습니다.", error);
      yield put(loadDocumentsFailure("문서목록 로딩에 실패했습니다."));
      yield put(logoutRequest());
    }
  }
}
// 단일 글 로딩
function* loadDocument(action: any) {
  try {
    const accessToken = getTokenFromCookie("access_token");
    const response: AxiosResponse<any> = yield call(() =>
      axios.get(`/documents/${action.payload}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );
    // 토큰 만료 여부 확인
    if (response.status === 200) {
      yield put(loadDocumentSuccess(response.data));
    } else if (response.data.error === "토큰 기한 만료") {
      // 토큰이 만료되었다면 로그아웃을 실행
      yield put(loadDocumentFailure("토큰이 만료되었습니다."));
      yield put(logoutRequest());
    } else {
      yield put(loadDocumentFailure("문서 로딩에 실패했습니다."));
      yield put(logoutRequest());
    }
  } catch (error) {
    if ((error as any).response && (error as any).response.data.error === "토큰 기한 만료") {
      yield put(loadDocumentFailure("토큰이 만료되었습니다."));
      yield put(logoutRequest());
    } else {
      console.error("문서 로딩에 실패했습니다.", error);
      yield put(loadDocumentFailure("문서 로딩에 실패했습니다."));
      yield put(logoutRequest());
    }
  }
}

//새 문서 추가
function* addDocument(action: any) {
  const { title, userId } = action.payload;
  try {
    // 쿠키에서 accessToken 가져오기
    const access_token = getTokenFromCookie("access_token");
    if (access_token) {
      const response: AxiosResponse<any> = yield call(() =>
        axios.post(
          `/documents`,
          { title: title, userId: userId },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access_token}`,
            },
          }
        )
      );

      if (response.status === 200) {
        yield put(addDocumentSuccess(response.data));
      } else {
        yield put(addDocumentFailure("새 문서 추가에 실패했습니다."));
      }
    }
  } catch (error) {
    yield put(addDocumentFailure("새 문서 추가에 실패했습니다."));
  }
}

function* deleteDocument(action: PayloadAction<{ documentId: string; userId: string }>) {
  try {
    const access_token = getTokenFromCookie("access_token");
    if (access_token) {
      // API 호출을 실행하고 응답을 가져옵니다.
      const response: AxiosResponse<any> = yield call(() =>
        axios.delete(`/documents/${action.payload.userId}+${action.payload.documentId}`, {
          data: {},
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        })
      );
      if (response.status === 200) {
        yield put(deleteDocumentSuccess(action.payload.documentId));
        yield put(loadDocumentsRequest(action.payload.userId)); //삭제 후 문서를 다시 로딩하지만 state 관리 방법을 다시 생각해봐야함
      } else if (response.data.error === "토큰 기한 만료") {
        // 토큰이 만료되었다면 로그아웃을 실행합니다.
        yield put(deleteDocumentFailure("토큰이 만료되었습니다."));
        yield put(logoutRequest());
      } else {
        yield put(deleteDocumentFailure("문서 삭제에 실패했습니다."));
      }
    } else {
      yield put(deleteDocumentFailure("문서 삭제에 실패했습니다."));
      yield put(logoutRequest());
    }
  } catch (error) {
    if ((error as any).response && (error as any).response.data.error === "토큰 기한 만료") {
      yield put(deleteDocumentFailure("토큰이 만료되었습니다."));
      yield put(logoutRequest());
    } else {
      console.error("문서 삭제에 실패했습니다.", error);
      yield put(deleteDocumentFailure("문서 삭제에 실패했습니다."));
    }
  }
}

function* documentSaga() {
  yield takeLatest(loadDocumentsRequest.type, loadDocuments);
  yield takeLatest(loadDocumentRequest.type, loadDocument);
  yield takeLatest(addDocumentRequest.type, addDocument);
  yield takeLatest(deleteDocumentRequest.type, deleteDocument);
}

export default documentSaga;
