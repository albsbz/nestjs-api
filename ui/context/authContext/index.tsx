import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { IAuthContext } from '../../common/interface/IAuthContext';
import { IProps } from '../../common/interface/IProps';
import useAuth from './hooks/useAuth';
import { useRefreshToken } from './hooks/useRefreshToken';
import getInitTokens from './helpers/getInitTokens';
import { emptyObject } from '../../helpers';
import { useLoadingContext } from '../loadingContext';

const context: IAuthContext = {
  login: (accessToken: string, refreshToken: string) => {},
  logout: () => {},
  user: {},
  isAuth: false,
  needAuth: false,
  onlyNoAuth: false,
  initiated: false,
};

export const AuthContext = createContext(context);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider: React.FC<IProps> = (props) => {
  // const { isLoading, setIsLoading } = useLoadingContext();
  const { needAuth, onlyNoAuth } = props;
  const [initTokens, setInitTokens] = useState({});
  const [initiated, setInitiated] = useState(false);
  const router = useRouter();
  useEffect(() => {
    setInitTokens(getInitTokens());
    setInitiated(true);
  }, []);

  const { login, logout, user, isAuth, tokens, updateLocalStorage } = useAuth(
    initTokens,
    // setIsLoading,
  );

  useRefreshToken(tokens, logout, updateLocalStorage);

  useEffect(() => {
    if (!needAuth) {
      // setIsLoading(false);
      return;
    }
    if (isAuth) {
      // setIsLoading(false);
      return;
    } else {
      if (!emptyObject(initTokens) && !tokens.accessToken) {
        router.push('/auth/login');
      }
    }
  }, [isAuth, needAuth, router, tokens, initTokens]);

  const store = useMemo(
    () => ({ login, logout, user, isAuth, needAuth, onlyNoAuth, initiated }),
    [login, logout, user, isAuth, needAuth, onlyNoAuth, initiated],
  );

  return <AuthContext.Provider value={store} {...props} />;
};
