import SockJS from "sockjs-client";
import Cookies from "js-cookie";
import {useSocketContext} from "../context/SocketContext";
import Stomp, {Client} from "stompjs";
import {notifications} from "@mantine/notifications";
import {useAuthContext} from "../context/AuthContext";
import {IFriendStatusUpdate} from "../models/FriendWithStatus";
import {useFriendsContext} from "../context/FriendsContext";
import {MessageType} from "../models/MessageType";
import {INotification} from "../models/Notification";
import {useDisplayContext} from "../context/DisplayContext";

export const useSocket = () => {
  const { friendsDispatch } = useFriendsContext();

  const { socketState, socketDispatch } = useSocketContext();
  const { state } = useAuthContext();
  const userNick: string = state.nickname ? state.nickname : "";
  const token = Cookies.get("jwt_token") || "";
  const { displayState } = useDisplayContext();

  const updateConnectedFriends = (newUserUpdate: IFriendStatusUpdate) => {
    const { messageType, nickname } = newUserUpdate;
    friendsDispatch({
      type:
        messageType === MessageType.JOIN
          ? "FRIEND_CONNECTED"
          : "FRIEND_DISCONNECTED",
      payload: nickname,
    });
  };

  const updateOnNotification = (newNotification: INotification) => {
    switch (newNotification.messageType) {
      case MessageType.REQUEST_APPROVED:
        friendsDispatch({
          type: "FRIEND_IS_ONLINE",
          payload: newNotification.friend,
        });
        notifications.show({
          title: "İstek onaylandı",
          message: newNotification.message,
          autoClose: 2000,
        });
        break;
      case MessageType.NEW_FRIEND_REQUEST:
        friendsDispatch({
          type: "NEW_FRIEND_REQUEST",
          payload: newNotification.frequest,
        });
        notifications.show({
          title: "Yeni Arkadaşlık İsteği",
          message: newNotification.message,
          autoClose: 2000,
        });
        break;
      case MessageType.REQUEST_CANCELLED:
        friendsDispatch({
          type: "CLICKED_FRIEND_REQUEST",
          payload: newNotification.requestId,
        });
        break;
      case MessageType.FRIENDSHIP_DELETED:
        friendsDispatch({
          type: "FRIENDSHIP_DELETED_NOTIFICATION",
          payload: newNotification.friend.nickname,
        });
        break;
      case MessageType.FRIEND_UPDATED_IMG:
        friendsDispatch({
          type: "FRIEND_UPDATED_IMG",
          payload: newNotification.friend,
        });
        notifications.show({
          title: "Yeni profil resmi",
          message: newNotification.message,
          autoClose: 2000,
        });
        break;
      case MessageType.NEW_MESSAGE:
        if (
          newNotification.info.room !== displayState.currentChat.currentRoom
        ) {
        }
        break;
      default:
        console.warn("Beklenmeyen mesaj türü:", newNotification.messageType);
    }
  };

  const connectingSocket = () => {
    try {
      const socket = new SockJS("http://localhost:8080/ws", {
        headers: { Cookie: `jwt_token=${token}` },
      });
      const stomp = Stomp.over(socket) as Client;
      const connectCallback = () => {
        stomp.subscribe(`/user/${userNick}/queue/onlineFriends`, (message) => {
          try {
            const newUpdate: IFriendStatusUpdate = JSON.parse(message.body);

            updateConnectedFriends(newUpdate);
          } catch (error) {
            console.error("message body parse edilemedi:", error);
          }
        });
        stomp.subscribe(
          `/user/${userNick}/queue/notifications`,
          (notification) => {
            try {
              const newNotification: INotification = JSON.parse(
                notification.body
              );
              updateOnNotification(newNotification);
            } catch (error) {
              console.error("message body parse edilemedi:", error);
            }
          }
        );
      };
      const errorCallback = (error: unknown) => {
        console.error("WebSocket bağlantısında hata:", error);
      };

      stomp.connect({}, connectCallback, errorCallback);
      socketDispatch({ type: "CONNECTION_SUCCESS", payload: stomp });
    } catch (error: unknown) {
      socketDispatch({ type: "CONNECTION_FAILED" });
      throw new Error("hata !");
    }
  };

  const disconnectingSocket = () => {
    try {
      if (socketState.stompClient) {
        socketState.stompClient.disconnect(() => {});
        console.log("Bağlantı kesildi");
      }
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return { connectingSocket, disconnectingSocket, updateOnNotification };
};
