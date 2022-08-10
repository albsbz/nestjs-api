import jwtDecode from 'jwt-decode';
import { useCallback, useEffect, useState } from 'react';
import { JWTTokenPayload } from '../../../common/types/jwtTokenPayload';
import axiosInstance from '../../../services/axios';

const useAuth = () => {
  const [tokens, setTokens] = useState({
    accessToken: null,
    refreshToken: null,
  });
  const [user, setUser] = useState({});
  const [isAuth, setIsAuth] = useState(false);

  const login = useCallback(
    (
      userData: JWTTokenPayload,
      tokens: { accessToken: string; refreshToken: string },
    ) => {
      setUser(userData);
      setIsAuth(true);
      axiosInstance.interceptors.request.use(function (config) {
        config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        return config;
      });
      localStorage.setItem('appRefreshToken', tokens.refreshToken);
      localStorage.setItem('appAccessToken', tokens.accessToken);
    },
    [],
  );

  useEffect(() => {
    if (tokens.accessToken) {
      const userData = jwtDecode<JWTTokenPayload>(tokens.accessToken);
      if (userData) {
        login(userData, tokens);
      }
    }
  }, [tokens, login]);

  useEffect(() => {
    console.log('user', user);
  }, [user]);

  return {
    tokens,
    setTokens,
    user,
    setUser,
    isAuth,
    setIsAuth,
  };
};
export default useAuth;
