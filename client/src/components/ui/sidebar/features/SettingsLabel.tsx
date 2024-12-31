import {IconSettings} from "@tabler/icons-react";

import classes from "../SideBar.module.css";
import {useDisplay} from "../../../../hooks/useDisplay";
import {useState} from "react";
import {useDisplayContext} from "../../../../context/DisplayContext";
import {DisplayType} from "../../../../models/DisplayType";

const SettingsLabel = () => {
  const { displayManager } = useDisplay();
  const { displayState } = useDisplayContext();

  const [isClicked, setIsClicked] = useState(false);
  const onClickSettings = () => {
    if (!isClicked) {
      setIsClicked(true);
      displayManager(DisplayType.SHOW_SETTINGS);
      return;
    }
    if (isClicked) {
      setIsClicked(false);
      displayManager(DisplayType.CLOSE_SETTINGS);
      return;
    }
  };
  return (
    <div
      data-active={displayState.showSettings || undefined}
      onClick={onClickSettings}
      className={classes.link}
      onMouseEnter={(event) => {
        event.currentTarget.style.cursor = "pointer";
      }}
      onMouseLeave={(event) => {
        event.currentTarget.style.cursor = "auto";
      }}
    >
      <IconSettings className={classes.linkIcon} stroke={1.5} />
      <span>Ayarlar</span>
    </div>
  );
};

export default SettingsLabel;
