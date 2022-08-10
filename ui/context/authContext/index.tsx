import jwtDecode from 'jwt-decode';
import { createContext, useContext, useEffect, useState } from 'react';
import { Props } from '../../common/interface/Props';
import { JWTTokenPayload } from '../../common/types/jwtTokenPayload';
import axiosInstance from '../../services/axios';
import useAuth from './hooks/useAuth';

export const AuthContext = createContext({
  tokens: {},
  user: {},
  isAuth: false,
  setTokens: (tokens) => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthContextProvider: React.FC<Props> = (props) => {
  const { tokens, setTokens, user, isAuth } = useAuth();
  return (
    <AuthContext.Provider
      value={{ tokens, setTokens, user, isAuth }}
      {...props}
    />
  );
};
