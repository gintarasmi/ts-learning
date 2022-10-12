export interface IAuthenticationFunctions {
  hashPassword(password: string): Promise<string>;
  comparePasswords(inputPassword: string, dbPassword: string): Promise<boolean>;
  createAccessToken(email: string): string;
  createRefreshToken(email: string): string;
  addToCache(key: string, value: string): Promise<void>;
  deleteFromCache(key: string, value: string): Promise<void>;
  getMembersFromCache(key: string): Promise<string[]>;
  createTokens(email: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }>;
}
