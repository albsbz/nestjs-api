import { createContext, useContext } from 'react';

export const AuthContext = createContext({
  tokens: {},
  user: {},
  setTokens: (tokens) => {},
});

export const useAuthContext = () => {
  return useContext(AuthContext);
};
