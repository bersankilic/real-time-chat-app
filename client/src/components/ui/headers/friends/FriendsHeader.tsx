import {useState} from "react";
import {useFriendsContext} from "../../../../context/FriendsContext";
import {Button, Center, Container, Flex, Menu, Tabs, Text,} from "@mantine/core";
import {IconFriends} from "@tabler/icons-react";
import AddFriendCard from "../../cards/add-friend/AddFriendCard";
import FriendRequestsCard from "../../cards/FriendRequestsCard";
import FriendsCard from "../../cards/friends/FriendsCard";
import classes from "./FriendsHeader.module.css";

const FriendsHeader = () => {
  const { friendsState } = useFriendsContext();
  const friendLen = friendsState.friendRequests.length;
  const tabs = ["Tümü", `Bekleyen (${friendLen})`, "Bloklanan", "Arkadaş Ekle"];

  const [showCard, setShowCard] = useState("");

  const handleTabChange = (value: string) => {
    if (showCard === value) {
      setShowCard("");
    } else {
      setShowCard(value);
    }
  };

  const items = tabs.map((tab) => (
    <Tabs.Tab value={tab} key={tab} onClick={() => handleTabChange(tab)}>
      {tab}
    </Tabs.Tab>
  ));
  const menuItems = tabs.map((tab) => (
    <Menu.Item
      c="cyan"
      value={tab}
      key={tab}
      onClick={() => handleTabChange(tab)}
    >
      {tab}
    </Menu.Item>
  ));

  return (
    <Center className={classes.friendsCenter}>
      <Container>
        <Flex visibleFrom="sm" justify="center" align="center">
          <div className={classes.titleContainer}>
            <IconFriends className="iconFriends" stroke={2} />
            <Text className="text">Arkadaşlar</Text>
          </div>
          <Tabs
            variant="outline"
            classNames={{
              root: classes.tabs,
              list: classes.tabsList,
              tab: classes.tab,
            }}
          >
            <Tabs.List>{items}</Tabs.List>
          </Tabs>
        </Flex>
        <Container hiddenFrom="sm" className={classes.menuButtonContainer}>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button className={classes.menuButton}>Arkadaşlar Menüsü</Button>
            </Menu.Target>

            <Menu.Dropdown>
              {menuItems}
              <Menu.Item c="cyan" onClick={() => setShowCard("")}>
                Kapat
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Container>
        {showCard === "Arkadaş Ekle" && <AddFriendCard />}
        {showCard === `Bekleyen (${friendLen})` && <FriendRequestsCard />}
        {showCard === "Tümü" && <FriendsCard />}
      </Container>
    </Center>
  );
};

export default FriendsHeader;
