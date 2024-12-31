import {IGetFriendRequest} from "./FriendRequestResponses";
import {IFriendIsOnline} from "./FriendWithStatus";
import {MessageType} from "./MessageType";

interface NewMessageNotificationDto {
  room: string;
  content: string;
}

export interface INotification {
  message: string;
  messageType: MessageType;
  friend: IFriendIsOnline;
  frequest: IGetFriendRequest;
  requestId: number;
  info: NewMessageNotificationDto;
}
