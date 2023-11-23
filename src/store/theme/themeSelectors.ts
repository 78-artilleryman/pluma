// store/theme/themeSelectors.ts
import { RootState } from "../../configureStore"; // RootState는 전체 Redux 스토어의 상태 타입입니다.

// 현재 설정된 테마를 선택하는 선택자
export const getTheme = (state: RootState) => state.theme.theme;
