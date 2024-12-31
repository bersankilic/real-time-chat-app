import {MessageType} from "./MessageType";

export interface IFriendStatusUpdate {
  nickname: string;
  messageType: MessageType;
}

export interface IFriendMap {
  [nickname: string]: string;
}

export interface IFriendsWithStatus {
  onlineFriends: IFriendMap;
  offlineFriends: IFriendMap;
}
export interface IFriendIsOnline {
  profileImg: string;
  nickname: string;
  isOnline: boolean;
}
