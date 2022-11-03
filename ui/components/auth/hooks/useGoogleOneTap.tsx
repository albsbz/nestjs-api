import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import Router from 'next/router';
import { useAuthContext } from '../../../context/authContext';
import { axiosInstance } from '../../../utils/axios';

declare global {
  interface Window {
    handleCredentialResponse?: any;
  }
}
interface Tokens {
  accessToken: string;
  refreshToken: string;
}
const useGoogleOneTap = () => {
  const router = useRouter();

  const [tokens, setTokens] = useState<Tokens>({
    accessToken: '',
    refreshToken: '',
  });

  const { login, isAuth } = useAuthContext();

  const { accessToken, refreshToken } = tokens;

  const handleCredentialResponse = useCallback(
    async ({ credential }) => {
      if (!credential) return;
      let resp;
      try {
        resp = await axiosInstance.post<Tokens>(`auth/google-one-tap/login`, {
          credential,
        });
      } catch (e) {
        router.push('/');
        return;
      }
      setTokens(resp.data);
    },
    [router],
  );

  useEffect(() => {
    if (window && !window.handleCredentialResponse) {
      window.handleCredentialResponse = handleCredentialResponse;
    }
  }, [handleCredentialResponse]);

  useEffect(() => {
    if (accessToken && !isAuth) {
      login(accessToken, refreshToken);
    }
  }, [accessToken, refreshToken, login, isAuth]);

  useEffect(() => {
    if (isAuth) {
      Router.push('/');
    }
  }, [isAuth]);

  return { handleCredentialResponse };
};
export default useGoogleOneTap;