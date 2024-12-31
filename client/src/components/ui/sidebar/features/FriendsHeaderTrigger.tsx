import {useState} from "react";
import {useDisplay} from "../../../../hooks/useDisplay";
import classes from "../SideBar.module.css";
import {IconFriends} from "@tabler/icons-react";
import {DisplayType} from "../../../../models/DisplayType";
import {useDisplayContext} from "../../../../context/DisplayContext";

const FriendsHeaderTrigger = () => {
  const [isClicked, setIsClicked] = useState(true);
  const { displayManager } = useDisplay();
  const { displayState } = useDisplayContext();

  const onClickTrigger = () => {
    if (isClicked) {
      displayManager(DisplayType.CLOSE_HEADERS);
    } else {
      displayManager(DisplayType.HEADERS);
    }
    setIsClicked(!isClicked);
  };

  return (
    <div
      data-active={displayState.showHeaders || undefined}
      className={classes.link}
      onClick={() => onClickTrigger()}
      onMouseEnter={(event) => {
        event.currentTarget.style.cursor = "pointer";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.cursor = "auto";
      }}
    >
      <IconFriends className={classes.linkIcon} stroke={1.5} />
      <span>Arkadaşlar</span>
    </div>
  );
};

export default FriendsHeaderTrigger;
