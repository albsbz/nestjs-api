const Consts = (): unknown => ({
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  url: process.env.NEXT_PUBLIC_URL,
  db: {
    mongoUrl: process.env.MONGO_URL,
    mongoPasswordPrefix: process.env.MONGO_PASSWORD_PREFIX,
  },
  jwtConstants: {
    accessSecret: process.env.ACCESS_TOKEN_SECRET,
    accessTokenExpiresIn: '3600s',
    refreshSecret: process.env.REFRESH_TOKEN_SECRET,
    refreshTokenExpiresIn: '7200s',
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
    region: process.env.AWS_REGION,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    publicBucketName: process.env.AWS_PUBLIC_BUCKET_NAME,
    bucketUrl: `https://${process.env.AWS_PUBLIC_BUCKET_NAM}.s3.${process.env.AWS_REGION}.amazonaws.com`,
  },
});
export default Consts;
