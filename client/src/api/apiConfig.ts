import axios from "axios";

// Spring Boot API için axios örneği oluştur
export const springApi = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_API}`,
  withCredentials: true,
});

// Cloudinary API için axios örneği oluştur
export const imagesApi = axios.create({
  baseURL: `${import.meta.env.VITE_CLOUDINARY_API}`,
});
