import React, {createContext, Dispatch, useContext, useReducer} from "react";
import Cookies from "js-cookie";
import {LoginResponse} from "../models/UserResponses";

const currentUserJson = localStorage.getItem("currentUser");
const currentUser: LoginResponse | null = currentUserJson
  ? JSON.parse(currentUserJson)
  : null;

type AuthAction =
  | { type: "LOGIN_SUCCESS"; payload: LoginResponse }
  | { type: "LOGIN_FAILED"; payload: string }
  | { type: "REGISTER_SUCCESS"; payload: string }
  | { type: "REGISTER_FAILED"; payload: string }
  | { type: "LOGOUT" }
  | { type: "DELETE_USER" }
  | { type: "UPDATE_FIRST_LOGIN_SUCCESS" }
  | { type: "UPDATE_IMG_SUCCESS"; payload: string };

interface AuthState {
  nickname: string | null;
  profileImg: string | null;
  isFirstLogin: boolean;
}

const initialState: AuthState = {
  nickname: currentUser ? currentUser.userNickname : null,
  profileImg: currentUser ? currentUser.imagePath : null,
  isFirstLogin: currentUser ? currentUser.firstLogin : true,
};

const AuthContext = createContext<
  | {
      state: AuthState;
      dispatch: Dispatch<AuthAction>;
    }
  | undefined
>(undefined);

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN_SUCCESS":
      localStorage.setItem("currentUser", JSON.stringify(action.payload));
      return {
        profileImg: action.payload.imagePath,
        nickname: action.payload.userNickname,
        isFirstLogin: action.payload.firstLogin,
      };

    case "UPDATE_FIRST_LOGIN_SUCCESS":
      return {
        ...state,
        isFirstLogin: false,
      };
    case "UPDATE_IMG_SUCCESS":
      return {
        ...state,
        isFirstLogin: false,
        profileImg: action.payload,
      };

    case "LOGOUT":
      localStorage.removeItem("currentUser");
      Cookies.remove("jwt_token");
      return {
        isFirstLogin: true,
        nickname: null,
        profileImg: null,
      };

    case "DELETE_USER":
      localStorage.removeItem("currentUser");
      Cookies.remove("jwt_token");
      return {
        isFirstLogin: false,
        nickname: null,
        profileImg: null,
      };

    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext bir AuthProvider içinde kullanılmalı");
  }

  return context;
};
