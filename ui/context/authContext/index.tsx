import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useState } from 'react';
import { Props } from '../../common/interface/Props';
import useAuth from './hooks/useAuth';
import useGetInitTokens from './hooks/useGetInitTokens';
import { useRefreshToken } from './hooks/useRefreshToken';

export const AuthContext = createContext({
  login: (accessToken: string, refreshToken: string) => {},
  logout: () => {},
  user: {},
  isAuth: false,
  isLoading: false,
  setIsLoading: (v: boolean) => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider: React.FC<Props> = (props) => {
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const initTokens = useGetInitTokens();
  const { login, logout, user, isAuth, tokens, clearUser } = useAuth(
    initTokens,
    setIsLoading,
  );

  useRefreshToken(tokens, login, logout, clearUser);

  useEffect(() => {
    if (!isAuth && props.needAuth) {
      router.push('/auth/login');
    }
  }, [isAuth, props.needAuth, router]);

  return (
    <AuthContext.Provider
      value={{ login, logout, user, isAuth, isLoading, setIsLoading }}
      {...props}
    />
  );
};
