import axios from 'axios';
const headers = {
  'Content-Type': 'application/json',
  timeout: 10000,
};
export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API,
  headers,
});

export const axiosInstanceServerSide = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers,
});

const axiosInstances = [axiosInstance, axiosInstanceServerSide];

export const setAuthHeader = (accessToken: string) => {
  axiosInstances.forEach((i) =>
    i.interceptors.request.use(function (config) {
      config.headers.Authorization =
        config.headers?.['Authorization'] !== undefined
          ? config.headers['Authorization']
          : `Bearer ${accessToken}`;
      return config;
    }),
  );
};

export const unsetAuthHeader = () => {
  axiosInstances.forEach((i) =>
    i.interceptors.request.use(function (config) {
      config.headers.common['Authorization'];
      return config;
    }),
  );
};
