import {imagesApi, springApi} from "../api/apiConfig";
import {axiosErrorExtractor} from "../utils/axiosErrorUtils";
import {UpdateProfileImageResponse} from "../models/UserResponses";

import {useAuthContext} from "../context/AuthContext";

export const useImages = () => {
  const { state, dispatch } = useAuthContext();

  const uploadProfileImage = async (profileImage: FormData) => {
    try {
      const res = await imagesApi.post("upload", profileImage);

      if (res.status === 200) {
        const response = await springApi.patch("users/setting/image", {
          imagePath: res.data.url,
        });
        if (response.status === 200) {
          const data: UpdateProfileImageResponse = await response.data;

          const updatedDetails = {
            userNickname: state.nickname,
            firstLogin: data.firstLogin,
            imagePath: data.imagePath,
          };
          localStorage.setItem("currentUser", JSON.stringify(updatedDetails));
          dispatch({ type: "UPDATE_IMG_SUCCESS", payload: data.imagePath });
        }
      }
    } catch (error: unknown) {
      const err = axiosErrorExtractor(error);

      throw new Error(err);
    }
  };
  const continueWithoutImage = async () => {
    try {
      const res = await springApi.get("users/setting/update-first-login");

      if (res.status === 200) {
        const data = await res.data;

        const updatedDetails = {
          userNickname: state.nickname,
          firstLogin: data.firstLogin,
          imagePath: state.profileImg,
        };
        localStorage.setItem("currentUser", JSON.stringify(updatedDetails));
        dispatch({ type: "UPDATE_FIRST_LOGIN_SUCCESS" });
      }
    } catch (error: unknown) {
      const err = axiosErrorExtractor(error);
      throw new Error(err);
    }
  };

  return { uploadProfileImage, continueWithoutImage };
};
