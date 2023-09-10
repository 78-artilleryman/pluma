// rootReducer.ts
import { combineReducers } from "redux";
import authReducer from "./auth/authReducer";
// 다른 리듀서 추가

const rootReducer = combineReducers({
  auth: authReducer,
  // 다른 리듀서 추가
});

export default rootReducer;
