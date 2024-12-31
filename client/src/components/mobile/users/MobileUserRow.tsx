import {Avatar, Flex, Text} from "@mantine/core";
import {IconCircleFilled} from "@tabler/icons-react";
import React from "react";
import classes from "./MobileUsers.module.css";
import {useDisplay} from "../../../hooks/useDisplay";

interface IMobileUserRowProps {
  nickname: string;
  profileImg: string;
  isConnected: boolean;
  userNick: string;
}
const MobileUserRow: React.FC<IMobileUserRowProps> = ({
  nickname,
  profileImg,
  isConnected,
}) => {
  const { chooseOverlayImage, chooseChat } = useDisplay();
  const onClickRow = () => {
    chooseChat(nickname, profileImg);
  };
  return (
    <Flex justify="space-between" py="sm" px="sm">
      <Avatar src={profileImg} onClick={() => chooseOverlayImage(profileImg)} />
      <Text ff="sans-serif" fs="italic" onClick={onClickRow}>
        {nickname + "..."}
      </Text>
      <Flex>
        <IconCircleFilled
          className={classes.circleIcon}
          style={{ color: isConnected ? "#1beb00" : "#f90101" }}
        />
      </Flex>
    </Flex>
  );
};

export default MobileUserRow;
