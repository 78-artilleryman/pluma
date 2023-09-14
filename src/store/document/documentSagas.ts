import axios, { AxiosResponse } from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { getTokenFromCookie } from "src/utils/tokenUtils";
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
        axios.get(`/documents?username=${action.payload}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        })
      );
      if (response.status === 200) {
        const documents: DocumentInfo[] = response.data.dtoList;
        console.log(response.data);
        yield put(loadDocumentsSuccess(documents));
      } else {
        yield put(loadDocumentsFailure("문서목록 로딩에 실패했습니다."));
      }
    } else {
      yield put(loadDocumentsFailure("문서목록 로딩에 실패했습니다."));
    }
  } catch (error) {
    yield put(loadDocumentsFailure("문서목록 로딩에 실패했습니다."));
  }
}

// 단일 글 로딩
function* loadDocument(action: any) {
  try {
    const accessToken = getTokenFromCookie("access_token");
    const response: AxiosResponse<any> = yield call(() =>
      axios.get(`/documents/${action.payload}`, {
        headers: {
          "Content-Type": "application/json", // Content-Type 추가
          Authorization: `Bearer ${accessToken}`,
        },
      })
    );
    yield put(loadDocumentSuccess(response.data));
  } catch (error) {
    yield put(loadDocumentFailure("문서 로딩에 실패했습니다."));
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
//     yield put(addDocumentSuccess(dummyData));
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
  // yield takeLatest(addDocumentRequest.type, addDocument);
  // yield takeLatest(saveDocumentRequest.type, saveDocument);
  // yield takeLatest(deleteDocumentRequest.type, deleteDocument);
  // yield takeLatest(updateDocumentRequest.type, updateDocument);
}

export default documentSaga;
