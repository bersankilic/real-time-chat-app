import {Flex, Text} from "@mantine/core";
import {IconBrandHipchat, IconCirclePlus, IconFriends, IconUserQuestion,} from "@tabler/icons-react";
import classes from "./MobileFooter.module.css";
import {useState} from "react";
import {useDisplay} from "../../../hooks/useDisplay";
import {useFriendsContext} from "../../../context/FriendsContext";

const MobileFooter = () => {
  const [active, setActive] = useState("Chats");
  const { chooseMobileTabToShow } = useDisplay();
  const { friendsState } = useFriendsContext();

  const onChooseTab = (tab: string) => {
    setActive(tab);
    chooseMobileTabToShow(tab);
  };

  return (
    <footer className={classes.footer}>
      <Flex w="25%" direction="column" align="center">
        <IconBrandHipchat
          className={`${classes.iconButton} ${
            active === "Chats" ? classes.clicked : ""
          }`}
          onClick={() => onChooseTab("Chats")}
        />
        <Text
          className={`${classes.text} ${
            active === "Chats" ? classes.clicked : ""
          }`}
        >
          Sohbetler
        </Text>
      </Flex>
      <Flex w="25%" direction="column" align="center">
        <IconFriends
          className={`${classes.iconButton} ${
            active === "Friends" ? classes.clicked : ""
          }`}
          onClick={() => onChooseTab("Friends")}
        />
        <Text
          className={`${classes.text} ${
            active === "Friends" ? classes.clicked : ""
          }`}
        >
          Arkadaşlar
        </Text>
      </Flex>
      <Flex w="25%" direction="column" align="center">
        <IconUserQuestion
          className={`${classes.iconButton} ${
            active === "Pending" ? classes.clicked : ""
          }`}
          onClick={() => onChooseTab("Pending")}
        />
        <Text
          className={`${classes.text} ${
            active === "Pending" ? classes.clicked : ""
          }`}
        >
          Bekleniyor ({friendsState.friendRequests.length})
        </Text>
      </Flex>
      <Flex w="25%" direction="column" align="center">
        <IconCirclePlus
          className={`${classes.iconButton} ${
            active === "Add" ? classes.clicked : ""
          }`}
          onClick={() => onChooseTab("Add")}
        />
        <Text
          className={`${classes.text} ${
            active === "Add" ? classes.clicked : ""
          }`}
        >
          Arkadaş Ekle
        </Text>
      </Flex>
    </footer>
  );
};

export default MobileFooter;
