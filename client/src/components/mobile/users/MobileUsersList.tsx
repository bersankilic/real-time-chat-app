import {List, ScrollArea, Text} from "@mantine/core";
import MobileUserRow from "./MobileUserRow";
import {useFriendsContext} from "../../../context/FriendsContext";
import classes from "./MobileUsers.module.css";

import {useAuthContext} from "../../../context/AuthContext";

const MobileUsersList = () => {
  const { friendsState } = useFriendsContext();
  const { state } = useAuthContext();
  const userNick: string = state.nickname ? state.nickname : "";

  return (
    <ScrollArea p="sm" className={classes.usersScroller}>
      <Text pt="md" size="xl" ff="cursive" ta="center">
        Sohbetler
      </Text>
      <List py="sm">
        {Object.entries(friendsState.friends.onlineFriends).map(
          ([nickname, profileImg]) => (
            <div>
              <MobileUserRow
                key={nickname}
                nickname={nickname}
                profileImg={profileImg}
                isConnected={true}
                userNick={userNick}
              />
            </div>
          )
        )}
        {Object.entries(friendsState.friends.offlineFriends).map(
          ([nickname, profileImg]) => (
            <div>
              <MobileUserRow
                key={nickname}
                nickname={nickname}
                profileImg={profileImg}
                isConnected={false}
                userNick={userNick}
              />
            </div>
          )
        )}
      </List>
    </ScrollArea>
  );
};

export default MobileUsersList;
