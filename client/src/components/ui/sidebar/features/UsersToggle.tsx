import {useState} from "react";

import {IUsersToggleProps} from "../../../../models/props/UserToggleProps";
import {Avatar, Flex, List, ScrollArea, Text} from "@mantine/core";
import {IconBrandHipchat} from "@tabler/icons-react";
import {useDisplay} from "../../../../hooks/useDisplay";
import classes from "../SideBar.module.css";

const UsersToggle = (props: IUsersToggleProps) => {
  const [isClicked, setIsClicked] = useState(false);
  const listLength = Object.keys(props.friendsList).length;
  const { chooseChat, chooseOverlayImage } = useDisplay();

  return (
    <>
      <div
        data-active={isClicked || undefined}
        className={classes.link}
        onClick={() => {
          setIsClicked(!isClicked);
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.cursor = "pointer";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.cursor = "auto";
        }}
      >
        <props.Icon className={classes.linkIcon} stroke={1.5} />
        <span>
          {props.title} ({listLength})
        </span>
      </div>
      {isClicked && listLength > 0 && (
        <ScrollArea p="sm" className={classes.userScroller}>
          <List py="sm">
            {Object.entries(props.friendsList).map(([nickname, profileImg]) => (
              <Flex
                onClick={() => {
                  chooseChat(nickname, profileImg);
                }}
                key={nickname}
                justify="space-between"
                py="sm"
                px="sm"
              >
                <Avatar
                  src={profileImg}
                  onClick={() => chooseOverlayImage(profileImg)}
                />
                <Text ff="sans-serif" fs="italic">
                  {nickname.slice(0, 10) + "..."}
                </Text>
                <Flex>
                  <IconBrandHipchat />
                </Flex>
              </Flex>
            ))}
          </List>
        </ScrollArea>
      )}
    </>
  );
};

export default UsersToggle;
