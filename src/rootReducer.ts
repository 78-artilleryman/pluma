// rootReducer.ts
import { combineReducers } from "redux";
import authReducers from "./store/auth/authReducers";
import documentReducers from "./store/document/documentReducers";
// 다른 리듀서 추가

const rootReducer = combineReducers({
  auth: authReducers,
  document: documentReducers,
  // 다른 리듀서 추가
});

export default rootReducer;
