export interface IAuthContext {
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  user: { avatarURL?: string };
  isAuth: boolean;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
}
