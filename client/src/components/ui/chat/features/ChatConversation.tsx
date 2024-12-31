import React from "react";
import {IConversation} from "../../../../models/ChatMessages";
import classes from "../ChatRoom.module.css";
import {Avatar, Menu, rem} from "@mantine/core";
import {IconTrash} from "@tabler/icons-react";

interface IChatConversationProps {
  chatConversation: IConversation;
  userNick: string;
  userImage: string;
  friendProfileImg: string;
  onDeleteMessage: (messageId: number) => void;
}

const ChatConversation: React.FC<IChatConversationProps> = ({
  chatConversation,
  userNick,
  userImage,
  friendProfileImg,
  onDeleteMessage,
}) => {
  return (
    <>
      {Object.entries(chatConversation)
        .slice()
        .reverse()
        .map(([date, messages]) => (
          <div key={date}>
            <div className={classes.date}>{date}</div>
            {messages
              .slice()
              .reverse()
              .map((message) => (
                <div key={message.id}>
                  <div
                    style={{
                      marginBottom: "10px",
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent:
                        message.sender === userNick ? "flex-start" : "flex-end", // göndericiye göre mesajları hizalar
                    }}
                  >
                    {message.sender === userNick ? (
                      <Menu>
                        <Menu.Target>
                          <div
                            style={{ display: "flex", alignItems: "center" }}
                          >
                            <Avatar
                              style={{ marginRight: "10px" }}
                              radius="xl"
                              src={userImage}
                              alt="You"
                            />
                            <div
                              style={{
                                backgroundColor: "#f0f0f0",
                                padding: "8px 12px",
                                borderRadius: "10px",
                                textAlign: "left",
                              }}
                            >
                              {message.content}
                              <Menu.Dropdown>
                                <Menu.Item
                                  onClick={() => onDeleteMessage(message.id)}
                                  color="red"
                                  leftSection={
                                    <IconTrash
                                      style={{
                                        width: rem(14),
                                        height: rem(14),
                                      }}
                                    />
                                  }
                                >
                                  Mesajı Sil
                                </Menu.Item>
                              </Menu.Dropdown>
                              <div style={{ fontSize: "12px", color: "#777" }}>
                                {message.time}
                              </div>
                            </div>
                          </div>
                        </Menu.Target>
                      </Menu>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <div
                          style={{
                            backgroundColor: "#dcf8c6",
                            padding: "8px 12px",
                            borderRadius: "10px",
                            textAlign: "left",
                            flex: "1",
                          }}
                        >
                          <div>{message.content}</div>
                          <div style={{ fontSize: "12px", color: "#777" }}>
                            {message.time}
                          </div>
                        </div>
                        <Avatar
                          style={{ marginLeft: "10px" }}
                          radius="xl"
                          src={friendProfileImg}
                          alt={message.sender}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        ))}
    </>
  );
};

export default ChatConversation;
