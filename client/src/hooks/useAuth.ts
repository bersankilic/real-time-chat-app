import {springApi} from "../api/apiConfig";
import {useNavigate} from "react-router-dom";
import {useAuthContext} from "../context/AuthContext";
import {useDisplayContext} from "../context/DisplayContext";
import {LoginForm, RegisterForm} from "../models/AuthForms";
import {LoginResponse} from "../models/UserResponses";
import {axiosErrorExtractor} from "../utils/axiosErrorUtils";

export const useAuth = () => {
  const { dispatch } = useAuthContext();
  const { displayDispatch } = useDisplayContext();
  const navigate = useNavigate();

  const login = async (userCredentials: LoginForm) => {
    try {
      const res = await springApi.post("auth/login", userCredentials);

      if (res.status === 200) {
        const data: LoginResponse = res.data;
        dispatch({ type: "LOGIN_SUCCESS", payload: data });
        if (data.firstLogin) {
          navigate("/first-login");
        } else {
          navigate("/home");
        }
      } else {
        throw new Error("Bilinmeyen hata");
      }
    } catch (error: unknown) {
      const err = axiosErrorExtractor(error);

      throw new Error(err);
    }
  };

  const register = async (newUser: RegisterForm) => {
    try {
      const res = await springApi.post("auth/register", newUser);
      if (res.status === 200) {
        navigate("/");
      } else {
        throw new Error("Bilinmeyen hata");
      }
    } catch (error: unknown) {
      const err = axiosErrorExtractor(error);

      throw new Error(err);
    }
  };
  const logout = async () => {
    displayDispatch({ type: "DEFAULT_DISPLAY" });
    dispatch({
      type: "LOGOUT",
    });
    try {
      await springApi.post("auth/logout");
    } catch (error: unknown) {
      const err = axiosErrorExtractor(error);
      console.log(err);
    }
  };

  const deleteUser = async () => {
    try {
      const res = await springApi.delete("users/delete-user");
      if (res.status === 200) {
        displayDispatch({ type: "DEFAULT_DISPLAY" });
        dispatch({
          type: "DELETE_USER",
        });
        navigate("/");
      }
    } catch (error) {
      const err = axiosErrorExtractor(error);
      throw new Error(err);
    }
  };

  return { login, register, logout, deleteUser };
};
