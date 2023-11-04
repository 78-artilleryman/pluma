// 문서 버전 정보
export interface VersionInfo {
  id: number;
  content: string;
  createdAt: string;
  subtitle: string;
}
export interface sendVersion {
  subtitle: string;
  content: string;
  documentId: number;
}
// 문서 버전 상세 정보
export interface VersionDetailInfo {
  versionId: number;
  subtitle: string;
  content: string;
  createdAt: string;
  documentId: number;
  // 다른 필요한 속성 추가 가능
}


export interface SendPicture{
  documentId: string | undefined;
  imageFile: object;
}

