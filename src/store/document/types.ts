export interface DocumentInfo {
  documentId: number;
  title: string;
  username: string;
  regDate: string;
  modDate: string;
  titleImage: string | null
}
export interface DocumentDetailInfo {
  documentId: number;
  title: string;
  username: string;
  content: string;
  regDate: string;
  modDate: string;
}

export interface AddDocument {
  title: string;
  userId: string;
}
