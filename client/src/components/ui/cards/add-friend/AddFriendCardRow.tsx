import {Avatar, Flex, Text} from "@mantine/core";
import React, {useState} from "react";
import {ISearchResponse} from "../../../../models/FriendRequestResponses";
import classes from "./AddCard.module.css";
import {useDisplay} from "../../../../hooks/useDisplay";
import StatusComp from "./StatusComp";

const AddFriendCardRow: React.FC<{ searchedUser: ISearchResponse }> = ({
  searchedUser,
}) => {
  const { chooseOverlayImage } = useDisplay();
  const [isLoading, setIsLoading] = useState(false);
  const [requestStatus, setRequestStatus] = useState("Loading...");

  return (
    <Flex align="center" className={classes.cardRow}>
      <Avatar
        className={classes.rowImg}
        src={searchedUser.profileImg}
        onClick={() => chooseOverlayImage(searchedUser.profileImg)}
      />
      <Text ff="sans-serif" fs="italic" className={classes.friendName}>
        {searchedUser.nickname}
      </Text>
      {!isLoading ? (
        <StatusComp
          status={searchedUser.status}
          requestId={searchedUser.requestId}
          userId={searchedUser.userId}
          setIsLoading={setIsLoading}
          setRequestStatus={setRequestStatus}
        />
      ) : (
        <Text c="black" ta="right" className={classes.reqStatus}>
          {requestStatus}{" "}
        </Text>
      )}
    </Flex>
  );
};

export default AddFriendCardRow;
