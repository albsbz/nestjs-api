const useLoginOnStart = () => {
  let accessToken = null;
  let refreshToken = null;
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
