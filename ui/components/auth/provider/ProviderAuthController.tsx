import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useAuthContext } from '../../../context/authContext';
import { axiosInstance } from '../../../utils/axios';
import Router from 'next/router';
import { possibleProviders } from '../../../utils/constants';
import { message } from 'antd';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}

const ProviderAuthController = () => {
  const router = useRouter();

  const [tokens, setTokens] = useState<Tokens>({
    accessToken: '',
    refreshToken: '',
  });
  const { login, isAuth, setIsLoading } = useAuthContext();

  useEffect(() => {
    setIsLoading(true);
  }, [isAuth, setIsLoading]);

  const code = router?.query?.code;
  const provider = router?.query?.provider;
  const { accessToken, refreshToken } = tokens;

  const getTokens = useCallback(async (provider, code) => {
    if (!possibleProviders.includes(provider)) {
      // throw new Error('Wrong provider');
      router.push('/');
      return;
    }
    let resp;
    try {
      resp = await axiosInstance.get<Tokens>(provider, {
        params: { code },
      });
    } catch (e) {
      // throw new Error('Authentication failed');
      router.push('/');
      return;
    }

    setTokens(resp.data);
  }, []);

  useEffect(() => {
    if (code && !tokens.accessToken && !isAuth) {
      getTokens(provider, code);
    }
  }, [getTokens, provider, code, tokens, isAuth]);

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

  return <div></div>;
};

export default ProviderAuthController;
