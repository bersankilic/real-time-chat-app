import React, {useState} from "react";
import {Avatar, Button, Flex, Table, Text} from "@mantine/core";
import {IGetFriendRequest} from "../../../models/FriendRequestResponses";
import {useFriends} from "../../../hooks/useFriends";
import {useDisplay} from "../../../hooks/useDisplay";
import classes from "./FriendRequest.module.css";

const FriendRequestRow: React.FC<{ fRequest: IGetFriendRequest }> = ({
  fRequest,
}) => {
  const { confirmFriendRequest, cancelFriendRequest, isFriendOnline } =
    useFriends();
  const { chooseOverlayImage } = useDisplay();
  const [isLoading, setIsLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState("Yükleniyor...");
  const onConfirmRequest = async (friendRequestId: number) => {
    setIsLoading(true);
    try {
      await confirmFriendRequest(friendRequestId);
      setRequestStatus("Onaylandı");
    } catch (error) {
      setRequestStatus("Onaylama başarısız oldu!");
    }
  };
  const onCancelRequest = async (friendRequestId: number) => {
    setIsLoading(true);
    try {
      await cancelFriendRequest(friendRequestId);
      setRequestStatus("Reddedildi");
    } catch (error) {
      setRequestStatus("Reddetme başarısız oldu!");
    }
  };
  return (
    <Table.Tr>
      <Table.Td className={classes.userTd}>
        <Flex align="center">
          <Avatar
            className={classes.requestImg}
            src={fRequest.profileImg}
            radius={26}
            onClick={() => chooseOverlayImage(fRequest.profileImg)}
          />
          <Text
            className={classes.requesterName}
            ff="revert"
            fs="italic"
            fw={500}
          >
            {fRequest.nickname}
          </Text>
        </Flex>
      </Table.Td>
      <Table.Td ta="left" className={classes.dateTd}>
        {fRequest.date}
      </Table.Td>
      <Table.Td ta="left" className={classes.optionsTd}>
        <div className={classes.buttonsContainer}>
          {!isLoading ? (
            <>
              <Button
                onClick={() =>
                  onConfirmRequest(fRequest.id).then(() =>
                    isFriendOnline(fRequest.nickname)
                  )
                }
                bg="green"
                className={classes.requestsButton}
              >
                Onayla
              </Button>
              <Button
                onClick={() => onCancelRequest(fRequest.id)}
                bg="red"
                className={classes.requestsButton}
              >
                Reddet
              </Button>
            </>
          ) : (
            <Text c="black">{requestStatus}</Text>
          )}
        </div>
      </Table.Td>
    </Table.Tr>
  );
};

export default FriendRequestRow;
