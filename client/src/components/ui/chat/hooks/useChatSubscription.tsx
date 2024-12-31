import {useEffect, useMemo} from "react";
import {IConversation, ICurrentChatMessage,} from "../../../../models/ChatMessages";
import {useSocketContext} from "../../../../context/SocketContext";

interface UseChatSubscriptionsParams {
  setChatConversation: React.Dispatch<React.SetStateAction<IConversation>>;
  currentRoom: string;
}

const useChatSubscriptions = ({
  setChatConversation,
  currentRoom,
}: UseChatSubscriptionsParams) => {
  const { socketState } = useSocketContext();
  const { stompClient } = socketState;

  useMemo(() => {
    stompClient?.subscribe("/topic/private." + currentRoom, (message) => {
      const receivedMessage: ICurrentChatMessage = JSON.parse(message.body);
      setChatConversation((prevChatHistory) => {
        if (prevChatHistory[receivedMessage.date]) {
          return {
            ...prevChatHistory,
            [receivedMessage.date]: [
              receivedMessage,
              ...prevChatHistory[receivedMessage.date],
            ],
          };
        } else {
          return {
            [receivedMessage.date]: [receivedMessage],
            ...prevChatHistory,
          };
        }
      });
    });
  }, [currentRoom, setChatConversation, stompClient]);
  useEffect(() => {
    stompClient?.subscribe(
      "/topic/delete.private." + currentRoom,
      (message) => {
        const deletedId: number = JSON.parse(message.body); // deleteID'nin number olduğunu varsay
        setChatConversation((prevChatConversation) => {
          const updatedChatConversation: IConversation = {
            ...prevChatConversation,
          }; // önceki chat geçmişini getir
          Object.keys(prevChatConversation).forEach((date) => {
            // deletedId'ye sahip mesajı her tarihin mesajlarından filtrele
            updatedChatConversation[date] = prevChatConversation[date].filter(
              (msg) => msg.id !== deletedId
            );
          });
          return updatedChatConversation;
        });
      }
    );
  }, [currentRoom, stompClient, setChatConversation]);
};

export default useChatSubscriptions;
