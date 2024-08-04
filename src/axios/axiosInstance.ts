import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
} from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_APP_API_URL}`,
  withCredentials: true,
});
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig<any>) => {
    // Modify the request config here if needed
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
