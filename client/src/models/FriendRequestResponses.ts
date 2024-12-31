interface IFriendResponse {
  nickname: string;
  profileImg: string;
}

export interface ISearchResponse extends IFriendResponse {
  userId: number;
  requestId: number | null;
  status: string;
}

export interface IGetFriendRequest extends IFriendResponse {
  id: number;
  date: string;
}
