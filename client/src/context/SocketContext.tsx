import React, {createContext, Dispatch, useContext, useReducer} from "react";
import {Client} from "stompjs";

interface SocketState {
  stompClient: Client | null;
  connectionError: boolean;
}

type SocketAction =
  | { type: "CONNECTION_SUCCESS"; payload: Client }
  | { type: "CONNECTION_FAILED" };

const initialState: SocketState = {
  stompClient: null,
  connectionError: false,
};

const SocketContext = createContext<
  | {
      socketState: SocketState;
      socketDispatch: Dispatch<SocketAction>;
    }
  | undefined
>(undefined);

const socketReducer = (
  state: SocketState,
  action: SocketAction
): SocketState => {
  switch (action.type) {
    case "CONNECTION_SUCCESS":
      return {
        ...state,
        stompClient: action.payload,
      };
    case "CONNECTION_FAILED":
      return {
        ...state,
        connectionError: true,
      };

    default:
      return state;
  }
};

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socketState, socketDispatch] = useReducer(socketReducer, initialState);

  return (
    <SocketContext.Provider value={{ socketState, socketDispatch }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocketContext = () => {
  const context = useContext(SocketContext);

  if (context === undefined) {
    throw new Error("useSocketContext bir SocketProvider içinde kullanılmalı");
  }

  return context;
};
