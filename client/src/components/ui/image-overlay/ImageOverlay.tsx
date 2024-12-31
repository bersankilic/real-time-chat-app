import classes from "./ImageOverlay.module.css";
import {Avatar} from "@mantine/core";
import {useDisplayContext} from "../../../context/DisplayContext";
import {useDisplay} from "../../../hooks/useDisplay";
import {DisplayType} from "../../../models/DisplayType";

const ImageOverlay = () => {
  const { displayState } = useDisplayContext();
  const { displayManager } = useDisplay();

  return (
    <div
      className={classes.overlayContainer}
      onClick={() => displayManager(DisplayType.CLOSE_OVERLAY)}
    >
      <div className={classes.overLaycontent}>
        <Avatar
          src={displayState.overlay.source}
          alt="enlarged-image"
          className={classes.overlayAvatar}
        />
      </div>
    </div>
  );
};

export default ImageOverlay;
