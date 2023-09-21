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
} from "./versionActions";
import axios, { AxiosResponse } from "axios";
import { getTokenFromCookie } from "../../utils/tokenUtils";

// 문서 버전 로딩
function* loadDocumentVersions(action: any) {
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
    // 토큰 만료 여부 확인
    if (response.status === 200) {
      console.log();
      yield put(loadDocumentVersionsSuccess(response.data.dtoList));
    } else {
      yield put(loadDocumentVersionsFailure("문서 버전 로딩에 실패했습니다."));
    }
  } catch (error) {
    console.error("문서 버전 로딩에 실패했습니다.", error);
    yield put(loadDocumentVersionsFailure("문서 버전 로딩에 실패했습니다."));
  }
}

// 문서 버전 추가
function* addDocumentVersion(action: any) {
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
      const newVersionId = response.data.documentId;
      yield put(loadDocumentVersionsRequest(newVersionId));
    } else {
      yield put(addDocumentVersionFailure("문서 버전 추가에 실패했습니다."));
    }
  } catch (error) {
    console.error("문서 버전 추가에 실패했습니다.", error);
    yield put(addDocumentVersionFailure("문서 버전 추가에 실패했습니다."));
  }
}

// 문서 버전 로딩
function* loadDocumentVersion(action: any) {
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
    // 토큰 만료 여부 확인
    if (response.status === 200) {
      yield put(loadDocumentVersionSuccess(response.data));
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
  yield takeLatest(loadDocumentVersionRequest.type, loadDocumentVersion);
}
