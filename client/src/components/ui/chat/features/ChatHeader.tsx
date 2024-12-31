import {Avatar, Paper, Text} from "@mantine/core";
import {IconArrowRight} from "@tabler/icons-react";
import classes from "./ChatHeader.module.css";
import {useDisplay} from "../../../../hooks/useDisplay";
import {DisplayType} from "../../../../models/DisplayType";

interface IChatHeaderProps {
  profileImg: string;
  friendNickname: string;
}

const ChatHeader = (props: IChatHeaderProps) => {
  const { displayManager, chooseOverlayImage } = useDisplay();
  return (
    <Paper bg="cyan" p="md" style={{ marginBottom: "20px" }}>
      <div className={classes.headContainer}>
        <div className={classes.innerContainer}>
          <Avatar
            className={classes.chatIcon}
            radius="xl"
            src={props.profileImg}
            onClick={() => chooseOverlayImage(props.profileImg)}
            style={{ marginRight: "10px" }}
          />
          <Text fw={500}>{props.friendNickname}</Text>
        </div>
        <IconArrowRight
          className={classes.chatIcon}
          onClick={() => displayManager(DisplayType.CLOSE_CHAT)}
        />
      </div>
    </Paper>
  );
};

export default ChatHeader;
