import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { IAuthContext } from '../../common/interface/IAuthContext';
import { IProps } from '../../common/interface/IProps';
import useAuth from './hooks/useAuth';
import { useRefreshToken } from './hooks/useRefreshToken';
import getInitTokens from './helpers/getInitTokens';
import { emptyObject } from '../../helpers';

const context: IAuthContext = {
  login: (accessToken: string, refreshToken: string) => {},
  logout: () => {},
  user: {},
  isAuth: false,
  isLoading: true,
  setIsLoading: (v: boolean) => {},
};

export const AuthContext = createContext(context);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider: React.FC<IProps> = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [initTokens, setInitTokens] = useState({});
  const router = useRouter();
  useEffect(() => {
    setInitTokens(getInitTokens());
  }, []);

  const { login, logout, user, isAuth, tokens, updateLocalStorage } = useAuth(
    initTokens,
    setIsLoading,
  );

  useRefreshToken(tokens, logout, updateLocalStorage);

  useEffect(() => {
    if (!props.needAuth) {
      setIsLoading(false);
      return;
    }
    if (isAuth) {
      setIsLoading(false);
      return;
    } else {
      if (!emptyObject(initTokens) && !tokens.accessToken) {
        router.push('/auth/login');
      }
    }
  }, [isAuth, props.needAuth, router, tokens, initTokens]);

  return (
    <AuthContext.Provider
      value={{ login, logout, user, isAuth, isLoading, setIsLoading }}
      {...props}
    />
  );
};
