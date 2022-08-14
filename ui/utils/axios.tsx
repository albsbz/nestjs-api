import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json',
    timeout: 1000,
  },
});

// if (typeof window !== 'undefined') {
//   const accessToken = localStorage.getItem('appAccessToken');
//   if (accessToken) {
//     axiosInstance.interceptors.request.use(function (config) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//       return config;
//     });
//   }
// }
export const setAuthHeader = (accessToken: string) => {
  axiosInstance.interceptors.request.use(function (config) {
    config.headers.Authorization =
      config.headers?.['Authorization'] !== undefined
        ? config.headers['Authorization']
        : `Bearer ${accessToken}`;
    return config;
  });
};

export const unsetAuthHeader = () => {
  axiosInstance.interceptors.request.use(function (config) {
    config.headers.common['Authorization'];
    return config;
  });
};
