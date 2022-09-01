import { useMemo } from 'react';

const getInitTokens = () => {
  let accessToken = '';
  let refreshToken = '';
  accessToken = localStorage.getItem('appAccessToken');
  refreshToken = localStorage.getItem('appRefreshToken');
  return { accessToken, refreshToken };
};

export default getInitTokens;
