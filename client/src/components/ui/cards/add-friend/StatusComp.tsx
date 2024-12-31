import React from "react";
import {Button, Text} from "@mantine/core";
import {FriendRequestStatus} from "../../../../models/FriendRequestStatus";
import {useFriends} from "../../../../hooks/useFriends";
import classes from "./AddCard.module.css";

interface IStatusCompProps {
  requestId: number | null;
  status: string;
  userId: number;
  setIsLoading: (value: boolean) => void;
  setRequestStatus: (value: string) => void;
}

const StatusComp: React.FC<IStatusCompProps> = ({
  requestId,
  status,
  userId,
  setIsLoading,
  setRequestStatus,
}) => {
  const { cancelFriendRequestBySender, sendFriendRequest } = useFriends();
  const onSendFrinedRequest = async () => {
    setIsLoading(true);
    try {
      await sendFriendRequest(userId);

      setRequestStatus("İstek gönderildi...");
    } catch (error) {
      setRequestStatus("İstek gönderilemedi !");
    }
  };
  const onCancelRequestBySender = async () => {
    setIsLoading(true);
    try {
      if (requestId) {
        await cancelFriendRequestBySender(requestId);
        setRequestStatus("İstek geri alındı...");
      }
    } catch (error) {
      console.log(error);
      setRequestStatus("İstek geri alınamadı !");
    }
  };
  return (
    <>
      {status === FriendRequestStatus.WAITING && (
        <>
          <Text c="black" className={classes.statusText}>
            Beklemede
          </Text>
          <Button
            className={classes.addButton}
            bg="red"
            onClick={onCancelRequestBySender}
          >
            İptal Et
          </Button>
        </>
      )}
      {status === FriendRequestStatus.PENDING && <Text c="black">Bekleniyor</Text>}
      {status === FriendRequestStatus.FRIENDS && <Text c="black">Arkadaşlar</Text>}
      {status === FriendRequestStatus.NOT_FRIENDS && (
        <Button
          bg="green"
          className={classes.addButton}
          onClick={onSendFrinedRequest}
        >
          Ekle
        </Button>
      )}
    </>
  );
};

export default StatusComp;
