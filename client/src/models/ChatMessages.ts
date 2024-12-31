export interface ICurrentChatMessage {
  id: number;
  sender: string;
  content: string;
  time: string;
  date: string;
}

export interface IChatMessage extends ICurrentChatMessage {
  room: string;
  recipient: string;
}

export interface IConversation {
  [key: string]: ICurrentChatMessage[];
}
