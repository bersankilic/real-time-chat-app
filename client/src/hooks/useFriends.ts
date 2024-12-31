import {springApi} from "../api/apiConfig";
import {useFriendsContext} from "../context/FriendsContext";
import {axiosErrorExtractor} from "../utils/axiosErrorUtils";

export const useFriends = () => {
  const { friendsDispatch } = useFriendsContext();
  const searchUser = async (searchedUser: string) => {
    try {
      const res = await springApi.get(`users/search?prefix=${searchedUser}`);

      if (res.status === 200) {
        return res.data;
      } else {
        throw new Error("Bilinmeyen hata");
      }
    } catch (error: unknown) {
      const err = axiosErrorExtractor(error);

      throw new Error(err);
    }
  };
  const isFriendOnline = async (checkedFriend: string) => {
    try {
      const res = await springApi.get(
        `users/online-check?nickname=${checkedFriend}`
      );

      if (res.status === 200) {
        friendsDispatch({
          type: res.data.isOnline ? "FRIEND_IS_ONLINE" : "FRIEND_IS_NOT_ONLINE",
          payload: res.data,
        });
      } else {
        throw new Error("Bilinmeyen hata");
      }
    } catch (error: unknown) {
      const err = axiosErrorExtractor(error);

      throw new Error(err);
    }
  };
  const getFriends = async () => {
    try {
      const res = await springApi.get("users/friends");

      if (res.status === 200) {
        return res.data;
      } else {
        throw new Error("Bilinmeyen hata");
      }
    } catch (error: unknown) {
      const err = axiosErrorExtractor(error);

      throw new Error(err);
    }
  };

  const getFriendsWithStatus = async () => {
    try {
      const res = await springApi.get("users/friends-status");
      console.log(res.data);
      if (res.status === 200) {
        friendsDispatch({ type: "GET_FRIENDS_STATUS", payload: res.data });
      } else {
        friendsDispatch({ type: "NO_FRIENDS" });
        throw new Error("Bilinmeyen hata");
      }
    } catch (error: unknown) {
      const err = axiosErrorExtractor(error);

      throw new Error(err);
    }
  };
  const sendFriendRequest = async (recieverId: number) => {
    try {
      const res = await springApi.post("friendship/add", {
        recieverId: recieverId,
      });

      if (res.status === 200) {
        return res.data;
      } else {
        throw new Error("Bilinmeyen hata");
      }
    } catch (error: unknown) {
      const err = axiosErrorExtractor(error);

      throw new Error(err);
    }
  };
  const getFriendRequests = async () => {
    try {
      const res = await springApi.get("friendship/get-requests");

      if (res.status === 200) {
        friendsDispatch({ type: "GET_FRIEND_REQUESTS", payload: res.data });
      } else {
        friendsDispatch({ type: "NO_FRIEND_REQUESTS" });
        throw new Error("Bilinmeyen hata");
      }
    } catch (error: unknown) {
      const err = axiosErrorExtractor(error);

      throw new Error(err);
    }
  };
  const confirmFriendRequest = async (friendRequestId: number) => {
    try {
      const res = await springApi.patch("friendship/confirm", {
        friendRequestId: friendRequestId,
      });

      if (res.status === 200) {
        setTimeout(() => {
          {
            friendsDispatch({
              type: "CLICKED_FRIEND_REQUEST",
              payload: friendRequestId,
            });
          }
        }, 3000);
      } else {
        friendsDispatch({ type: "CLICKED_FRIEND_REQUEST_FAILED" });
        throw new Error("Bilinmeyen hata");
      }
    } catch (error: unknown) {
      const err = axiosErrorExtractor(error);

      throw new Error(err);
    }
  };
  const cancelFriendRequestBySender = async (friendRequestId: number) => {
    try {
      const res = await springApi.delete("friendship/cancel", {
        data: {
          friendRequestId: friendRequestId,
        },
      });

      if (res.status === 200) {
        return "İptal Edildi...";
      }
    } catch (error: unknown) {
      const err = axiosErrorExtractor(error);

      throw new Error(err);
    }
  };
  const cancelFriendRequest = async (friendRequestId: number) => {
    try {
      const res = await springApi.delete("friendship/cancel", {
        data: {
          friendRequestId: friendRequestId,
        },
      });

      if (res.status === 200) {
        setTimeout(() => {
          {
            friendsDispatch({
              type: "CLICKED_FRIEND_REQUEST",
              payload: friendRequestId,
            });
          }
        }, 3000);
      } else {
        friendsDispatch({ type: "CLICKED_FRIEND_REQUEST_FAILED" });
        throw new Error("Bilinmeyen hata");
      }
    } catch (error: unknown) {
      const err = axiosErrorExtractor(error);

      throw new Error(err);
    }
  };
  const deleteFriendship = async (
    friendshipId: number,
    nicknameToDelete: string
  ) => {
    try {
      await springApi.delete("friendship/delete", {
        data: {
          friendRequestId: friendshipId,
        },
      });
      friendsDispatch({
        type: "FRIENDSHIP_DELETED",
        payload: nicknameToDelete,
      });
    } catch (error: unknown) {
      const err = axiosErrorExtractor(error);

      throw new Error(err);
    }
  };
  return {
    searchUser,
    isFriendOnline,
    getFriends,
    getFriendsWithStatus,
    sendFriendRequest,
    getFriendRequests,
    confirmFriendRequest,
    cancelFriendRequest,
    cancelFriendRequestBySender,
    deleteFriendship,
  };
};
