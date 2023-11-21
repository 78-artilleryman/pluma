// rootReducer.ts
import { combineReducers } from "redux";
import authReducers from "./store/auth/authReducers";
import documentReducers from "./store/document/documentReducers";
import imageReducers from "./store/image/imageReducers";
import versionReducers from "./store/version/versionReducers";
// 다른 리듀서 추가

const rootReducer = combineReducers({
  auth: authReducers,
  document: documentReducers,
  version: versionReducers,
  image: imageReducers,
  // 다른 리듀서 추가
});

export default rootReducer;
