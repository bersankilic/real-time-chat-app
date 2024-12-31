import {useEffect, useRef, useState} from "react";
import {ActionIcon, Affix, Button, Center, Loader, ScrollArea, TextInput,} from "@mantine/core";
import ChatHeader from "./features/ChatHeader";
import {useSocketContext} from "../../../context/SocketContext";
import {useAuthContext} from "../../../context/AuthContext";
import {useDisplayContext} from "../../../context/DisplayContext";
import {IChatMessage, IConversation} from "../../../models/ChatMessages";

import {IconArrowDown} from "@tabler/icons-react";
import classes from "./ChatRoom.module.css";
import {useChat} from "../../../hooks/useChat";
import ChatConversation from "./features/ChatConversation";
import useChatSubscriptions from "./hooks/useChatSubscription";

interface IConverSationResponse {
  totalPages: number;
  currentPage: number;
  messagesByDate: IConversation;
  hasNext: boolean;
}

const ChatRoom = () => {
  const { state } = useAuthContext();
  const viewport = useRef<HTMLDivElement>(null);
  const effectRan = useRef(false);
  const userImage: string = state.profileImg ? state.profileImg : "";
  const userNick: string = state.nickname ? state.nickname : "";
  const { displayState } = useDisplayContext();
  const { currentChat } = displayState;
  const { socketState } = useSocketContext();
  const { stompClient } = socketState;
  const [chatConversation, setChatConversation] = useState<IConversation>({});
  const [newMessage, setNewMessage] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [isScrollingDown, setIsScrollingDown] = useState(false);
  const hasMoreMessages = useRef(true);
  const [isLoading, setIsLoading] = useState(false);
  const { getChatHistoryByPage } = useChat();
  const lastScrollTop = useRef(0);

  useChatSubscriptions({
    setChatConversation,
    currentRoom: currentChat.currentRoom,
  });

  const deleteMessage = (messageId: number) => {
    stompClient?.send(
      `/app/delete.private.${currentChat.currentRoom}`,
      {},
      JSON.stringify(messageId)
    );
  };
  const scrollToBottom = () => {
    viewport.current!.scrollTo({
      top: viewport.current!.scrollHeight,
      behavior: "smooth",
    });
  };

  const handleScrollToTop = () => {
    const container = viewport.current!;
    if (container.scrollTop === 0 && hasMoreMessages.current) {
      getChatHistory(pageNumber + 1);
      setPageNumber((prevPage) => prevPage + 1);
    }
  };
  const handleScrollDown = () => {
    const container = viewport.current!;
    const currentScrollTop = container.scrollTop;
    setIsScrollingDown(currentScrollTop > lastScrollTop.current);
    lastScrollTop.current = currentScrollTop;
  };

  const handleMessageSend = () => {
    if (newMessage.trim() === "") return;

    const newChatMessage: IChatMessage = {
      id: 0,
      sender: userNick,
      content: newMessage.trim(),
      time: getCurrentTime(),
      date: getFormatDate(),
      room: currentChat.currentRoom,
      recipient: currentChat.currentFriendNickname,
    };

    stompClient?.send(
      "/app/private." + currentChat.currentRoom,
      {},
      JSON.stringify(newChatMessage)
    );

    setNewMessage("");
    scrollToBottom();
  };

  const getFormatDate = (): string => {
    const date = new Date();
    const year = date.getFullYear();
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const day = ("0" + date.getDate()).slice(-2);
    const formattedDate = `${month}-${day}-${year}`;
    return formattedDate;
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleEnterPress = (event: { key: string }) => {
    if (event.key === "Enter") {
      handleMessageSend();
    }
  };

  const getChatHistory = async (pageNum: number) => {
    setIsLoading(true);
    if (!hasMoreMessages.current) {
      return;
    }
    try {
      const results = await getChatHistoryByPage(
        pageNum,
        currentChat.currentRoom
      );

      const data: IConverSationResponse = results;
      hasMoreMessages.current = data.hasNext;

      setChatConversation((prevChatHistory) => {
        const updatedChatHistory = { ...prevChatHistory };

        Object.entries(data.messagesByDate).forEach(([date, messages]) => {
          if (updatedChatHistory[date]) {
            updatedChatHistory[date] = [
              ...updatedChatHistory[date],
              ...messages,
            ];
          } else {
            updatedChatHistory[date] = messages;
          }
        });

        return updatedChatHistory;
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(
    () => {
      if (effectRan.current === false) {
        getChatHistory(pageNumber);
        scrollToBottom();
      }

      return () => {
        console.log("unmounted");
        effectRan.current = true;
      };
    },
    []
  );
  useEffect(
    () => {
      const container = viewport.current!;
      container.addEventListener("scroll", handleScrollToTop);
      container.addEventListener("scroll", handleScrollDown);
      return () => {
        container.removeEventListener("scroll", handleScrollToTop);
        container.removeEventListener("scroll", handleScrollDown);
      };
    },
    []
  );

  return (
    <div className={classes.chatWindow}>
      <ChatHeader
        friendNickname={currentChat.currentFriendNickname}
        profileImg={currentChat.currentFriendProfileImg}
      />

      <ScrollArea p="sm" viewportRef={viewport} className={classes.scroller}>
        {isLoading && (
          <Center p={5}>
            <Loader size={30} />
          </Center>
        )}
        <ChatConversation
          chatConversation={chatConversation}
          userNick={userNick}
          userImage={userImage}
          friendProfileImg={currentChat.currentFriendProfileImg}
          onDeleteMessage={deleteMessage}
        />
        {isScrollingDown && (
          <Affix className={classes.scrollButton} onClick={scrollToBottom}>
            <ActionIcon radius="xl" size={60}>
              <IconArrowDown stroke={1.5} size={30} />
            </ActionIcon>
          </Affix>
        )}
      </ScrollArea>

      <div className={classes.chatBottom}>
        <TextInput
          size="lg"
          className={classes.textArea}
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
          onKeyDown={handleEnterPress}
          placeholder="Mesajınızı yazın..."
        />
        <Button onClick={handleMessageSend}>Gönder</Button>
      </div>
    </div>
  );
};

export default ChatRoom;
