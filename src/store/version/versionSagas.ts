import { PayloadAction } from "@reduxjs/toolkit";
import { call, put, takeLatest } from "redux-saga/effects";
import {
  loadDocumentVersionsRequest,
  loadDocumentVersionsSuccess,
  loadDocumentVersionsFailure,
  loadDocumentVersionFailure,
  loadDocumentVersionSuccess,
  addDocumentVersionFailure,
  addDocumentVersionSuccess,
  addDocumentVersionRequest,
  loadDocumentVersionRequest,
  deleteDocumentVersionSuccess,
  deleteDocumentVersionFailure,
  deleteDocumentVersionRequest,
} from "./versionActions";
import axios, { AxiosResponse } from "axios";
import { getTokenFromCookie } from "../../utils/tokenUtils";

interface LoadDocumentVersionsAction extends PayloadAction<string> {}
interface AddDocumentVersionAction extends PayloadAction<any> {}
interface LoadDocumentVersionAction extends PayloadAction<string> {}

// 문서 버전 로딩
function* loadDocumentVersions(action: LoadDocumentVersionsAction) {
  try {
    const accessToken = getTokenFromCookie("access_token");
    const response: AxiosResponse<any> = yield call(() =>
      axios.get(`/versions?documentId=${action.payload}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );

    if (response.status === 200) {
      yield put(loadDocumentVersionsSuccess(response.data.dtoList));
      if (response.data.dtoList && response.data.dtoList.length > 0) {
        const firstVersionId = response.data.dtoList[0].id;
        yield put(loadDocumentVersionRequest(firstVersionId));
      }
    } else if (response.status === 401) {
      yield put(loadDocumentVersionsFailure("토큰이 만료되었습니다. 다시 로그인해주세요."));
    } else {
      yield put(loadDocumentVersionsFailure("문서 버전 로딩에 실패했습니다."));
    }
  } catch (error) {
    console.error("문서 버전 로딩에 실패했습니다.", error);
    yield put(loadDocumentVersionsFailure("문서 버전 로딩에 실패했습니다."));
  }
}

// 문서 버전 추가
function* addDocumentVersion(action: AddDocumentVersionAction) {
  try {
    const accessToken = getTokenFromCookie("access_token");
    const response: AxiosResponse<any> = yield call(() =>
      axios.post("/versions", action.payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );

    if (response.status === 200) {
      yield put(addDocumentVersionSuccess(response.data));
    } else if (response.status === 401) {
      yield put(addDocumentVersionFailure("토큰이 만료되었습니다. 다시 로그인해주세요."));
    } else {
      yield put(addDocumentVersionFailure("문서 버전 추가에 실패했습니다."));
    }
  } catch (error) {
    console.error("문서 버전 추가에 실패했습니다.", error);
    yield put(addDocumentVersionFailure("문서 버전 추가에 실패했습니다."));
  }
}
//문서 버전 삭제
function* deleteDocumentVersion(action: PayloadAction<{ documentId: string; versionId: string }>) {
  try {
    const accessToken = getTokenFromCookie("access_token");
    const response: AxiosResponse<any> = yield call(() =>
      axios.delete(`/versions/${action.payload.documentId}+${action.payload.versionId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );

    if (response.status === 200) {
      yield put(deleteDocumentVersionSuccess({ id: action.payload.versionId }));
    } else if (response.status === 401) {
      yield put(deleteDocumentVersionFailure("토큰이 만료되었습니다. 다시 로그인해주세요."));
    } else {
      yield put(deleteDocumentVersionFailure("문서 버전 삭제에 실패했습니다."));
    }
  } catch (error) {
    console.error("문서 버전 삭제에 실패했습니다.", error);
    yield put(deleteDocumentVersionFailure("문서 버전 삭제에 실패했습니다."));
  }
}

// 문서 버전 로딩
function* loadDocumentVersion(action: LoadDocumentVersionAction) {
  try {
    const accessToken = getTokenFromCookie("access_token");
    const response: AxiosResponse<any> = yield call(() =>
      axios.get(`/versions/${action.payload}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );

    if (response.status === 200) {
      yield put(loadDocumentVersionSuccess(response.data));
    } else if (response.status === 401) {
      yield put(loadDocumentVersionFailure("토큰이 만료되었습니다. 다시 로그인해주세요."));
    } else {
      yield put(loadDocumentVersionFailure("문서 버전 로딩에 실패했습니다."));
    }
  } catch (error) {
    console.error("문서 버전 로딩에 실패했습니다.", error);
    yield put(loadDocumentVersionFailure("문서 버전 로딩에 실패했습니다."));
  }
}

export function* versionSaga() {
  yield takeLatest(loadDocumentVersionsRequest.type, loadDocumentVersions);
  yield takeLatest(addDocumentVersionRequest.type, addDocumentVersion);
  yield takeLatest(deleteDocumentVersionRequest.type, deleteDocumentVersion);
  yield takeLatest(loadDocumentVersionRequest.type, loadDocumentVersion);
}
