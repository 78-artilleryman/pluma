import { put, takeLatest, call, delay } from "redux-saga/effects";
import axios, { AxiosResponse } from "axios";
import { generateImageRequest, generateImageSuccess, generateImageFailure } from "./imageActions";

const api = axios.create({
  baseURL: "https://api.novita.ai",
  headers: {
    Authorization: `Bearer ${process.env.IMAGE_GENERATE_API_KEY}`,
    "Content-Type": "application/json",
  },
});

// 이미지 생성 요청
function* generateImage(action: ReturnType<typeof generateImageRequest>) {
  try {
    const response: AxiosResponse<any> = yield call(() => api.post("/v2/txt2img", action.payload));

    if (response.status === 200) {
      const taskId = response.data.data.task_id;
      yield call(checkImageStatus, taskId, action.payload.n_iter);
    } else if (response.data.error === "토큰 기한 만료") {
      yield put(generateImageFailure("토큰이 만료되었습니다."));
    } else {
      yield put(generateImageFailure("이미지 생성에 실패했습니다."));
    }
  } catch (error) {
    if ((error as any).response && (error as any).response.data.error === "토큰 기한 만료") {
      yield put(generateImageFailure("토큰이 만료되었습니다."));
    } else {
      console.error("이미지 생성에 실패했습니다.", error);
      yield put(generateImageFailure("이미지 생성에 실패했습니다."));
    }
  }
}

// 이미지 생성 상태 확인
function* checkImageStatus(taskId: string, n_iter: number) {
  try {
    let retryCount = 0;
    const maxRetryCount = 5; // 최대 재시도 횟수 설정

    while (retryCount < maxRetryCount) {
      const statusResponse: AxiosResponse<any> = yield call(() =>
        api.get(`/v2/progress?task_id=${taskId}`)
      );
      const { status, imgs } = statusResponse.data.data;

      if (status === 2 && imgs) {
        yield put(generateImageSuccess(imgs.slice(0, n_iter)));
        return;
      } else {
        retryCount++;
        yield delay(5000); // 5초 대기 후 재시도
      }
    }

    // 최대 재시도 횟수 초과 시 오류 처리
    yield put(generateImageFailure("이미지 생성에 실패했습니다."));
  } catch (error) {
    console.error("Status Check Error:", error);
    yield put(generateImageFailure("이미지 생성에 실패했습니다."));
  }
}

function* imageSagas() {
  yield takeLatest(generateImageRequest.type, generateImage);
}

export default imageSagas;
