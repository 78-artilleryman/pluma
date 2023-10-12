import { RootState } from "../../configureStore";

export const selectVersion = (state: RootState) => state.version;
export const selectVersionsList = (state: RootState) => state.version.versionsList;
export const selectSingleVersion = (state: RootState) => state.version.singleVersion;
export const selectVersionLoading = (state: RootState) => state.version.loading;
export const selectVersionError = (state: RootState) => state.version.error;
export const selectImageUrl = (state: RootState) => state.version.imageUrl;
