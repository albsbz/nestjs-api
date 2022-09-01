import jwtDecode from 'jwt-decode';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { TJWTTokenPayload } from '../../../common/types/TJwtTokenPayload';
import { emptyObject } from '../../../helpers';
import {
  setAuthHeader,
  unsetAuthHeader,
  axiosInstance,
} from '../../../utils/axios';

const useAuth = (initTokens, setIsLoading) => {
  const [prevInitTokens, setPrevInitTokens] = useState(initTokens);
  const [tokens, setTokens] = useState({ accessToken: '', refreshToken: '' });

  if (JSON.stringify(prevInitTokens) !== JSON.stringify(initTokens)) {
    setPrevInitTokens(initTokens);
    setTokens(initTokens);
    setAuthHeader(initTokens.accessToken);
  }

  // setIsLoading(true);
  // const [user, setUser] = useState({});
  // const [isAuth, setIsAuth] = useState(false);

  let user = useMemo(() => ({}), []);
  if (tokens?.accessToken) {
    user = jwtDecode<TJWTTokenPayload>(tokens.accessToken);
  }
  let isAuth = !emptyObject(user);

  const updateLocalStorage = (accessToken, refreshToken) => {
    localStorage.setItem('appRefreshToken', refreshToken);
    localStorage.setItem('appAccessToken', accessToken);
    setTokens({ accessToken, refreshToken });
  };

  const login = (accessToken: string, refreshToken: string) => {
    updateLocalStorage(accessToken, refreshToken);
    setAuthHeader(accessToken);
  };

  const clearUser = () => {
    setTokens({ accessToken: '', refreshToken: '' });
    localStorage.removeItem('appRefreshToken');
    localStorage.removeItem('appAccessToken');

    unsetAuthHeader();
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
    updateLocalStorage,
  };
};
export default useAuth;
