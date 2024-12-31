import React from "react";
import {Avatar, Button, Flex, Group, Modal, Text} from "@mantine/core";
import classes from "../Cards.module.css";
import {IFriendship} from "../../../../models/Friendship";
import {IconBan, IconBrandHipchat} from "@tabler/icons-react";
import {useDisclosure} from "@mantine/hooks";

interface IFriendsCardRowProps {
  friendship: IFriendship;
  onDeleteFriendship: (friendshipId: number, nicknameToDelete: string) => void;
  chooseOverlayImage: (chosenImage: string) => void;
  chooseChat: (friendNickname: string, friendProfileImg: string) => void;
}

const FriendsCardRow: React.FC<IFriendsCardRowProps> = ({
  friendship,
  onDeleteFriendship,
  chooseOverlayImage,
  chooseChat,
}) => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <div className={classes.friendsDiv}>
      <Avatar
        src={friendship.profileImg}
        onClick={() => chooseOverlayImage(friendship.profileImg)}
      />
      <Text ff="sans-serif" fs="italic">
        {friendship.nickname}
      </Text>
      <Flex>
        <IconBrandHipchat
          className={classes.icon}
          onClick={() => {
            chooseChat(friendship.nickname, friendship.profileImg);
          }}
        />
        <IconBan className={classes.icon} onClick={open} />
      </Flex>
      <Modal
        opened={opened}
        onClose={close}
        title="Bu arkadaşını silmek istediğinden emin misin ?"
      >
        {" "}
        <Group mt="xl" justify="right">
          <Button onClick={close}>İptal</Button>
          <Button
            bg="red"
            onClick={() =>
              onDeleteFriendship(friendship.id, friendship.nickname)
            }
          >
            Sil
          </Button>
        </Group>
      </Modal>
    </div>
  );
};

export default FriendsCardRow;
