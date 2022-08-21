import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { IAuthContext } from '../../common/interface/IAuthContext';
import { IProps } from '../../common/interface/IProps';
import useAuth from './hooks/useAuth';
import useGetInitTokens from './hooks/useGetInitTokens';
import { useRefreshToken } from './hooks/useRefreshToken';

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

  const router = useRouter();
  const initTokens = useGetInitTokens();
  const { login, logout, user, isAuth, tokens, clearUser } = useAuth(
    initTokens,
    setIsLoading,
  );

  useRefreshToken(tokens, login, logout, clearUser);

  useEffect(() => {
    if (!props.needAuth) {
      setIsLoading(false);
      return;
    }
    if (isAuth) {
      setIsLoading(false);
      return;
    } else {
      if (!tokens.accessToken) {
        router.push('/auth/login');
      }
    }
  }, [isAuth, props.needAuth, router, tokens.accessToken]);

  return (
    <AuthContext.Provider
      value={{ login, logout, user, isAuth, isLoading, setIsLoading }}
      {...props}
    />
  );
};
