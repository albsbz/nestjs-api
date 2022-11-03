export interface IAuthContext {
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  user: { avatarURL?: string; sub?: string };
  isAuth: boolean;
  needAuth: boolean;
  onlyNoAuth: boolean;
  initiated: boolean;
}
