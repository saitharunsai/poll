import {
  AxiosRequestConfig,
  AxiosResponse,
  RawAxiosResponseHeaders,
  AxiosResponseHeaders,
} from "axios";
import axiosInstance from "./axiosInstance";

export interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: AxiosRequestConfig;
}

export async function getRequest<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  const response = await axiosInstance.get<T, AxiosResponse<T>>(url, config);
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: response.config,
  };
}

export async function postRequest<T, D = any>(
  url: string,
  data: D,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  const response = await axiosInstance.post<T, AxiosResponse<T>, D>(
    url,
    data,
    config,
  );
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: response.config,
  };
}

export async function putRequest<T, D = any>(
  url: string,
  data: D,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  const response = await axiosInstance.put<T, AxiosResponse<T>, D>(
    url,
    data,
    config,
  );
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: response.config,
  };
}

export async function patchRequest<T, D = any>(
  url: string,
  data?: D,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  const response = await axiosInstance.patch<T, AxiosResponse<T>, D>(
    url,
    data,
    config,
  );
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: response.config,
  };
}

export async function deleteRequest<T>(
  url: string,
  config?: AxiosRequestConfig,
): Promise<ApiResponse<T>> {
  const response = await axiosInstance.delete<T, AxiosResponse<T>>(url, config);
  return {
    data: response.data,
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
    config: response.config,
  };
}
