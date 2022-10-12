import { cleanEnv, bool, port, num, str } from 'envalid';

const envValidation = () =>
  cleanEnv(process.env, {
    CHOKIDAR_USEPOLLING: bool(),
    PORT: num(),
    MONGO_USERNAME: str(),
    MONGO_PASSWORD: str(),
    WEATHER_API: str(),
    ACCESS_TOKEN_SECRET: str(),
    REFRESH_TOKEN_SECRET: str(),
    REDIS_HOST: str()
  });
envValidation;
