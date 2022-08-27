import jwtDecode from 'jwt-decode';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TJWTTokenPayload } from '../../../common/types/TJwtTokenPayload';
import {
  setAuthHeader,
  unsetAuthHeader,
  axiosInstance,
} from '../../../utils/axios';

const useAuth = (initTokens, setIsLoading) => {
  // setIsLoading(true);
  const [tokens, setTokens] = useState(initTokens);
  const [user, setUser] = useState({});
  const [isAuth, setIsAuth] = useState(false);

  const updateUserData = useCallback((accessToken: string) => {
    const userData = jwtDecode<TJWTTokenPayload>(accessToken);
    if (userData) {
      setUser(userData);
      setIsAuth(true);
      setAuthHeader(accessToken);
    }
  }, []);

  useEffect(() => {
    if (tokens.accessToken && tokens.refreshToken) {
      const { accessToken, refreshToken } = tokens;
      updateUserData(accessToken);
      updateLocalStorage(accessToken, refreshToken);
    } else {
      setIsAuth(false);
    }
  }, [tokens]);

  const updateLocalStorage = (accessToken, refreshToken) => {
    localStorage.setItem('appRefreshToken', refreshToken);
    localStorage.setItem('appAccessToken', accessToken);
  };

  const login = (accessToken: string, refreshToken: string) => {
    setTokens({ accessToken, refreshToken });
  };

  const clearUser = () => {
    localStorage.removeItem('appRefreshToken');
    localStorage.removeItem('appAccessToken');

    unsetAuthHeader();
    setTokens({ accesToken: null, refreshToken: null });
    setUser({});
  };

  const logout = async (noRequest?: boolean) => {
    setIsLoading(true);
    if (!noRequest) {
      await axiosInstance.post('/auth/logout');
    }
    clearUser();
  };

  return {
    setTokens,
    login,
    logout,
    user,
    isAuth,
    tokens,
    clearUser,
    updateLocalStorage,
  };
};
export default useAuth;
