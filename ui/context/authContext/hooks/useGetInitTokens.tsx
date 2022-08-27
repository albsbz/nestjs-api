import { useMemo } from 'react';

const useGetInitTokens = () => {
  const initTokens = useMemo(() => {
    let accessToken = '';
    let refreshToken = '';
    if (typeof window !== 'undefined') {
      accessToken = localStorage.getItem('appAccessToken');
      refreshToken = localStorage.getItem('appRefreshToken');
    }
    return { accessToken, refreshToken };
  }, []);

  return initTokens;
};

export default useGetInitTokens;
