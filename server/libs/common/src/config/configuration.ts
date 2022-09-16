const Consts = (): unknown => ({
  env: process.env.NODE_ENV,
  apiUrl: process.env.SLS_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_URL,
  url: process.env.SLS_API_URL || process.env.NEXT_PUBLIC_URL,
  db: {
    mongoUrl: process.env.MONGO_URL,
    mongoPasswordPrefix: process.env.MONGO_PASSWORD_PREFIX,
  },
  jwtConstants: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: '18000s',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpiresIn: '36000s',
    dropPasswordSecret: process.env.DROP_PASSWORD_TOKEN_SECRET,
    dropPasswordTokenExpiresIn: '10800s',
  },
  emailConstants: {
    emailTokenSecret: process.env.EMAIL_TOKEN_SECRET,
    emailTokenExpiresIn: '2160s',
    emailConfirmationUrl: `${process.env.NEXT_PUBLIC_API_URL}/auth/confirm-email`,
    emailDropPasswordUrl: `${process.env.NEXT_PUBLIC_URL}/auth/update-password`,
    emailService: process.env.EMAIL_SERVICE,
    emailUser: process.env.EMAIL_USER,
    emailPassword: process.env.EMAIL_PASSWORD,
    emailHost: process.env.EMAIL_HOST,
    emailPort: process.env.EMAIL_PORT,
    emailSecure: process.env.EMAIL_SECURE === 'true' || false,
    emailSender: process.env.EMAIL_SENDER,
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  google: {
    auth: {
      clientId: process.env.GOOGLE_AUTH_CLIENT_ID,
      clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
    },
  },
  aws: {
    region: process.env.REGION,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    publicBucketName: process.env.PUBLIC_BUCKET_NAME,
    bucketUrl: `https://${process.env.PUBLIC_BUCKET_NAME}.s3.amazonaws.com`,
    bucketUrlRegion: `https://${process.env.PUBLIC_BUCKET_NAME}.s3.${process.env.REGION}.amazonaws.com`,
    formActionUrl: `https://s3.${process.env.REGION}.amazonaws.com/${process.env.PUBLIC_BUCKET_NAME}`,
  },
});
export default Consts;
