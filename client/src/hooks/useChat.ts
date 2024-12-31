import {springApi} from "../api/apiConfig";
import {axiosErrorExtractor} from "../utils/axiosErrorUtils";

export const useChat = () => {
  const getChatHistoryByPage = async (pageNum: number, chatRoom: string) => {
    try {
      const res = await springApi.get(`messages/${chatRoom}`, {
        params: { pageNumber: pageNum },
      });
      return res.data;
    } catch (error) {
      const err = axiosErrorExtractor(error);

      throw new Error(err);
    }
  };
  return { getChatHistoryByPage };
};
