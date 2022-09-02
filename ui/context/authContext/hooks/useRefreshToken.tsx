import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { axiosInstance } from '../../../utils/axios';

export const useRefreshToken = (
  tokens: { accessToken: string; refreshToken: string },
  logout: (noRequest: boolean) => void,
  updateLocalStorage: (accessToken, refreshToken) => void,
) => {
  const router = useRouter();

  if (tokens?.refreshToken) {
    return axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (
          error.response?.data?.statusCode === 401 &&
          error.response?.data?.message === 'jwt expired'
        ) {
          let resp;
          try {
            resp = await axiosInstance.post(
              '/auth/refresh',
              {},
              {
                headers: {
                  Authorization: `Bearer ${tokens.refreshToken}`,
                },
              },
            );
          } catch (e) {
            logout(true);
            router.push('/');
            return Promise.resolve();
          }

          const originalRequestConfig = error.config;
          originalRequestConfig.headers[
            'Authorization'
          ] = `Bearer ${resp.data.accessToken}`;
          let newAttempt;

          try {
            newAttempt = await axiosInstance.request(originalRequestConfig);
          } catch (e) {
            if (e.data.message === 'jwt expired') {
              logout(true);
              router.push('/');
              return Promise.resolve();
            }
            return Promise.resolve();
          }
          updateLocalStorage(resp.data.accessToken, resp.data.refreshToken);
          // login(resp.data.accessToken, resp.data.refreshToken);
          return Promise.resolve(newAttempt);
        }
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error
        return Promise.reject(error);
      },
    );
  }
};
