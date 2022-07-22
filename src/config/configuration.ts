export default (): any => ({
  jwtConstants: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: '30s',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpiresIn: '720s',
    emailTokenSecret: process.env.EMAIL_TOKEN_SECRET,
    emailTokenExpiresIn: '2160s',
    emailConfirmationUrl: process.env.EMAIL_CONFIRMATION_URL,
  },
});
