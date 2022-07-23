export default (): unknown => ({
  jwtConstants: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: '30s',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpiresIn: '720s',
  },
  emailConstants: {
    emailTokenSecret: process.env.EMAIL_TOKEN_SECRET,
    emailTokenExpiresIn: '2160s',
    emailConfirmationUrl: process.env.EMAIL_CONFIRMATION_URL,

    emailService: process.env.EMAIL_SERVICE,
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    emailSecure: process.env.EMAIL_SECURE === 'true' || false,
    emailSender: process.env.EMAIL_SENDER,
  },
});
