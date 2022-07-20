export default (): any => ({
  jwtConstants: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: '30s',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpiresIn: '720s',
  },
});
