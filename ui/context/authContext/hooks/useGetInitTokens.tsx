const useLoginOnStart = () => {
  let accessToken = '';
  let refreshToken = '';
  if (typeof window !== 'undefined') {
    accessToken = localStorage.getItem('appAccessToken');
    refreshToken = localStorage.getItem('appRefreshToken');
    // if (accessToken && !tokens.accessToken) {
    //   setTokens({ accessToken, refreshToken });
    // }
  }
  return { accessToken, refreshToken };
};

export default useLoginOnStart;
