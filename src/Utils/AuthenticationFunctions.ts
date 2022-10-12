import jsonwebtoken, { VerifyErrors } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { redisOpen } from './RedisClient';
import { config } from './Config';
import { IAuthenticationFunctions } from '../Types/AuthenticationFunctions';

export class AuthenticationFunctions implements IAuthenticationFunctions {
  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }
  async comparePasswords(inputPassword: string, dbPassword: string) {
    return await bcrypt.compare(inputPassword, dbPassword);
  }
  createAccessToken(email: string) {
    const accessToken = jsonwebtoken.sign(
      { email: email },
      config.secret.access,
      { expiresIn: '60s' }
    );
    return accessToken;
  }
  createRefreshToken(email: string) {
    const refreshToken = jsonwebtoken.sign(
      { email: email },
      config.secret.refresh
    );
    return refreshToken;
  }
  async addToCache(key: string, value: string) {
    const redis = await redisOpen();
    await redis.SADD(key, value);
    await redis.quit();
  }
  async deleteFromCache(key: string, value: string) {
    const redis = await redisOpen();
    const refreshTokens = await redis.SREM(key, value);
    await redis.quit();
  }
  async getMembersFromCache(key: string) {
    const redis = await redisOpen();
    const refreshTokens = await redis.SMEMBERS(key);
    await redis.quit();
    return refreshTokens;
  }
  async createTokens(email: string) {
    const accessToken = this.createAccessToken(email);
    const refreshToken = this.createRefreshToken(email);
    await this.addToCache('refreshTokens', refreshToken);
    return { accessToken: accessToken, refreshToken: refreshToken };
  }
}
