import axios, { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { checkTokenExpiration, getTokenFromCookie } from "../../utils/tokenUtils";
import { checkTokenExpirationRequest, logoutRequest } from "../auth/authActions";
import { checkTokenExpirationSaga } from "../auth/authSagas";
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
  saveDocumentRequest,
  saveDocumentSuccess,
  saveDocumentFailure,
  deleteDocumentRequest,
  deleteDocumentSuccess,
  deleteDocumentFailure,
  updateDocumentRequest,
  updateDocumentSuccess,
  updateDocumentFailure,
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

// // 새 문서 추가
// function* addDocument(action: any) {
//   try {
//     console.log(action);

//     console.log("addDocument action payload:", action.payload); // 값을 찍어보기 위해 추가

//     // Use dummy data instead of an actual API call
//     const dummyData = {
//       id: action.payload.id, // payload에서 id를 가져옴
//       content: action.payload.content, // payload에서 content를 가져옴
//     };
//     yield put(addDocumentSuccess(dummyDta));
//   } catch (error) {
//     yield put(addDocumentFailure("새 문서 추가에 실패했습니다."));
//   }
// }

// // 글 저장
// function* saveDocument(action: any) {
//   try {
//     console.log(action);

//     const dummyData = action.payload; // 더미 데이터로 대체
//     yield put(saveDocumentSuccess(dummyData));
//   } catch (error) {
//     yield put(saveDocumentFailure("문서 저장에 실패했습니다."));
//   }
// }

// // 글 삭제
// function* deleteDocument(action: any) {
//   try {
//     console.log(action);

//     const dummyData = action.payload; // 더미 데이터로 대체
//     yield put(deleteDocumentSuccess(dummyData));
//   } catch (error) {
//     yield put(deleteDocumentFailure("문서 삭제에 실패했습니다."));
//   }
// }

// // 글 수정
// function* updateDocument(action: any) {
//   try {
//     console.log(action);

//     const dummyData = action.payload; // 더미 데이터로 대체
//     yield put(updateDocumentSuccess(dummyData));
//   } catch (error) {
//     yield put(updateDocumentFailure("문서 수정에 실패했습니다."));
//   }
// }

function* documentSaga() {
  yield takeLatest(loadDocumentsRequest.type, loadDocuments);
  yield takeLatest(loadDocumentRequest.type, loadDocument);
  yield takeLatest(addDocumentRequest.type, addDocument);
  // yield takeLatest(saveDocumentRequest.type, saveDocument);
  // yield takeLatest(deleteDocumentRequest.type, deleteDocument);
  // yield takeLatest(updateDocumentRequest.type, updateDocument);
}

export default documentSaga;
