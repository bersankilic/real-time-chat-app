import axios from "axios";

export const axiosErrorExtractor = (err: unknown) => {
  if (axios.isAxiosError(err)) {
    return err.response?.data;
  } else return "AxiosError hatası yok";
};
