export type TJWTTokenPayload = {
  email: string;
  exp: string;
  iat: string;
  sub: string;
  tokenType: 'access' | 'refresh';
};
