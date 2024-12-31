import React, {createContext, Dispatch, useContext, useReducer} from "react";
import {IFriendIsOnline, IFriendsWithStatus,} from "../models/FriendWithStatus";
import {IGetFriendRequest} from "../models/FriendRequestResponses";

interface FriendsState {
  friends: IFriendsWithStatus;
  friendRequests: IGetFriendRequest[];
}

type FriendsAction =
  | { type: "GET_FRIENDS_STATUS"; payload: IFriendsWithStatus }
  | { type: "NO_FRIENDS" }
  | { type: "GET_FRIEND_REQUESTS"; payload: IGetFriendRequest[] }
  | { type: "NO_FRIEND_REQUESTS" }
  | { type: "NEW_FRIEND_REQUEST"; payload: IGetFriendRequest }
  | { type: "CLICKED_FRIEND_REQUEST"; payload: number }
  | { type: "CLICKED_FRIEND_REQUEST_FAILED" }
  | { type: "FRIEND_CONNECTED"; payload: string }
  | { type: "FRIEND_DISCONNECTED"; payload: string }
  | { type: "FRIEND_IS_ONLINE"; payload: IFriendIsOnline }
  | { type: "FRIEND_IS_NOT_ONLINE"; payload: IFriendIsOnline }
  | { type: "FRIENDSHIP_DELETED"; payload: string }
  | { type: "FRIENDSHIP_DELETED_NOTIFICATION"; payload: string }
  | { type: "FRIEND_UPDATED_IMG"; payload: IFriendIsOnline };

const initialState: FriendsState = {
  friends: { onlineFriends: {}, offlineFriends: {} },
  friendRequests: [],
};

const FriendsContext = createContext<
  | {
      friendsState: FriendsState;
      friendsDispatch: Dispatch<FriendsAction>;
    }
  | undefined
>(undefined);

const friendsReducer = (
  state: FriendsState,
  action: FriendsAction
): FriendsState => {
  switch (action.type) {
    case "FRIEND_CONNECTED": {
      const { [action.payload]: friendToRemove, ...remainingOfflineFriends } =
        state.friends.offlineFriends;
      const updatedOnlineFriends = {
        ...state.friends.onlineFriends,
        [action.payload]: friendToRemove,
      };
      return {
        ...state,
        friends: {
          onlineFriends: updatedOnlineFriends,
          offlineFriends: remainingOfflineFriends,
        },
      };
    }
    case "GET_FRIENDS_STATUS":
      return {
        ...state,
        friends: action.payload,
      };
    case "NO_FRIENDS":
      return state;

    case "GET_FRIEND_REQUESTS":
      return {
        ...state,
        friendRequests: action.payload,
      };
    case "NO_FRIEND_REQUESTS":
      return state;
    case "NEW_FRIEND_REQUEST":
      return {
        ...state,
        friendRequests: [...state.friendRequests, action.payload],
      };
    case "CLICKED_FRIEND_REQUEST":
      return {
        ...state,
        friendRequests: state.friendRequests.filter(
          (request) => request.id !== action.payload
        ),
      };
    case "CLICKED_FRIEND_REQUEST_FAILED":
      return state;
    case "FRIEND_IS_ONLINE":
      return {
        ...state,
        friends: {
          ...state.friends,
          onlineFriends: {
            ...state.friends.onlineFriends,
            [action.payload.nickname]: action.payload.profileImg,
          },
        },
      };
    case "FRIEND_UPDATED_IMG":
      return {
        ...state,
        friends: {
          ...state.friends,
          onlineFriends: {
            ...state.friends.onlineFriends,
            [action.payload.nickname]: action.payload.profileImg,
          },
        },
      };
    case "FRIENDSHIP_DELETED_NOTIFICATION": {
      const newState = {
        ...state,
        friends: {
          ...state.friends,
        },
      };

      delete newState.friends.onlineFriends[action.payload];

      return newState;
    }
    case "FRIENDSHIP_DELETED": {
      const newState = {
        ...state,
        friends: {
          ...state.friends,
        },
      };
      if (newState.friends.onlineFriends[action.payload]) {
        delete newState.friends.onlineFriends[action.payload];
      } else {
        delete newState.friends.offlineFriends[action.payload];
      }
      return newState;
    }
    case "FRIEND_IS_NOT_ONLINE":
      return {
        ...state,
        friends: {
          ...state.friends,
          offlineFriends: {
            ...state.friends.offlineFriends,
            [action.payload.nickname]: action.payload.profileImg,
          },
        },
      };
    case "FRIEND_DISCONNECTED": {
      const { [action.payload]: friendToRemove, ...remainingOnlineFriends } =
        state.friends.onlineFriends;
      const updatedOfflineFriends = {
        ...state.friends.offlineFriends,
        [action.payload]: friendToRemove,
      };
      return {
        ...state,
        friends: {
          onlineFriends: remainingOnlineFriends,
          offlineFriends: updatedOfflineFriends,
        },
      };
    }

    default:
      return state;
  }
};

export const FriendsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [friendsState, friendsDispatch] = useReducer(
    friendsReducer,
    initialState
  );

  return (
    <FriendsContext.Provider value={{ friendsState, friendsDispatch }}>
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriendsContext = () => {
  const context = useContext(FriendsContext);

  if (context === undefined) {
    throw new Error("useFriendsContext bir FriendsProvider içinde kullanılmalı");
  }

  return context;
};
