export type JWTTokenPayload = {
  email: string;
  exp: string;
  iat: string;
  sub: string;
  tokenType: 'access' | 'refresh';
};
