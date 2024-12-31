import {useAuthContext} from "../context/AuthContext";
import {ICurrentRoom, useDisplayContext} from "../context/DisplayContext";
import {DisplayType} from "../models/DisplayType";
import {createPrivateRoomName} from "../utils/socketUtils";

export const useDisplay = () => {
  const { state } = useAuthContext();
  const userNick: string = state.nickname ? state.nickname : "";

  const { displayDispatch } = useDisplayContext();
  const displayManager = (display: DisplayType) => {
    displayDispatch({ type: display });
  };

  const chooseChat = (friendNickname: string, friendProfileImg: string) => {
    const newRoom: ICurrentRoom = {
      currentFriendNickname: friendNickname,
      currentFriendProfileImg: friendProfileImg,
      currentRoom: createPrivateRoomName(userNick, friendNickname),
    };
    displayDispatch({ type: "CHOOSE_CHAT", payload: newRoom });
  };

  const chooseMobileTabToShow = (chosenTab: string) => {
    displayDispatch({ type: "SHOW_MOBILE_TAB", payload: chosenTab });
  };

  const chooseOverlayImage = (imageSrc: string) => {
    displayDispatch({ type: "SHOW_OVERLAY", payload: imageSrc });
  };

  return {
    displayManager,
    chooseChat,
    chooseMobileTabToShow,
    chooseOverlayImage,
  };
};
