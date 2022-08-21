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
      localStorage.setItem('appRefreshToken', refreshToken);
      localStorage.setItem('appAccessToken', accessToken);
    } else {
      setIsAuth(false);
    }
  }, [tokens, updateUserData, setIsLoading]);

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

  const logout = async () => {
    setIsLoading(true);
    await axiosInstance.post('/auth/logout');
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
  };
};
export default useAuth;
