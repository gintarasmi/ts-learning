import '../Utils/EnvValidating';

const MONGO_USERNAME = process.env.MONGO_USERNAME || '';
const MONGO_PASSWORD = process.env.MONGO_PASSWORD || '';
const WEATHER_API = process.env.WEATHER_API || '';
const MONGO_URL = `mongodb+srv://${MONGO_USERNAME}:${MONGO_PASSWORD}@cluster0.39iozua.mongodb.net`;
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || 'test';
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || 'test';
const REDIS_HOST = process.env.REDIS_HOST || '';
const portNum = parseInt(`${process.env.PORT}`, 10) || 3000;

export const config = {
  mongo: {
    url: MONGO_URL
  },
  server: {
    port: portNum
  },
  weather: {
    api: WEATHER_API
  },
  secret: {
    access: ACCESS_TOKEN_SECRET,
    refresh: REFRESH_TOKEN_SECRET
  },
  redis: {
    url: REDIS_HOST
  }
};
