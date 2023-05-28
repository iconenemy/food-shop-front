import axios from "axios";

export const API_URL = "http://localhost:5000/api";

const $api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
  // proxy: {
  //   protocol: 'http',
  //   host: 'localhost',
  //   port: 3000,
  // }
});

$api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem(
    "access_token"
  )}`;
  return config;
});

$api.interceptors.response.use(
  (config) => config,
  async (error) => {
    const originRequest = error.config;
    if (
      error.response.status === 401 &&
      error.config &&
      !error.config._isRetry
    ) {
      originRequest._isRetry = true;

      const response = await axios.get(`${API_URL}/auth/refresh`, {
        withCredentials: true,
      });
      localStorage.setItem("access_token", response.data.accessToken);
      return $api.request(originRequest);
    }
    throw error;
  }
);

export default $api;
