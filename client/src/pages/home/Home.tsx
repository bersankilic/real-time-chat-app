import {Burger} from "@mantine/core";

import {useEffect, useRef} from "react";
import {useSocket} from "../../hooks/useSocket";
import {useFriends} from "../../hooks/useFriends";
import SideBar from "../../components/ui/sidebar/SideBar";
import ChatRoom from "../../components/ui/chat/ChatRoom";
import {useDisplayContext} from "../../context/DisplayContext";
import FriendsHeader from "../../components/ui/headers/friends/FriendsHeader";
import classes from "./Home.module.css";
import {useDisclosure} from "@mantine/hooks";
import SideDrawer from "../../components/ui/side-drawer/SideDrawer";
import ImageOverlay from "../../components/ui/image-overlay/ImageOverlay";
import SettingsWindow from "../../components/ui/user_settings/SettingsWindow";

const Home = () => {
  const [drawerOpened, { toggle: toggleDrawer, close: closeDrawer }] =
    useDisclosure(false);

  const { connectingSocket } = useSocket();
  const { getFriendsWithStatus, getFriendRequests } = useFriends();
  const { displayState } = useDisplayContext();
  const effectRan = useRef(false);

  const onGetFriendRequests = async () => {
    try {
      await getFriendRequests();
    } catch (error) {
      console.log(error);
    }
  };
  const onConnect = async () => {
    try {
      await connectingSocket();
    } catch (error) {
      console.log(error);
    }
  };

  const onGetFriends = async () => {
    try {
      await getFriendsWithStatus();
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(
    () => {
      if (effectRan.current === false) {
        onGetFriends()
          .then(() => onConnect())
          .then(() => onGetFriendRequests())
          .catch((err) => console.log(err));
      }

      return () => {
        effectRan.current = true;
      };
    },
    []
  );

  return (
    <div className={classes.homeContainer}>
      {displayState.overlay.isVisible && <ImageOverlay />}
      <Burger
        color="cyan"
        opened={drawerOpened}
        onClick={toggleDrawer}
        hiddenFrom="xs"
        className={classes.burger}
      />

      <div className={classes.mainContainer}>
        <SideBar />
        <div className={classes.friendsHeaderContainer}>
          {displayState.showHeaders && <FriendsHeader />}
        </div>
        <SideDrawer drawerOpened={drawerOpened} closeDrawer={closeDrawer} />

        {displayState.showChat && (
          <ChatRoom key={displayState.currentChat.currentRoom} />
        )}
        {displayState.showSettings && <SettingsWindow />}
      </div>
    </div>
  );
};

export default Home;
