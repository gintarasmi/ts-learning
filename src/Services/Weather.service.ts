import { Request, Response } from 'express';
import { config } from '../Utils/Config';
import { IService } from '../Types/Service.type';

export class WeatherService implements IService {
  getById = async (req: Request, res: Response) => {
    const city = req.params.city;
    try {
      const cityData = await this.fetchCityInfo(city);
      return res.status(200).json(cityData);
    } catch (error) {
      return res.status(500).json(error);
    }
  };

  private fetchCityInfo = async (city: string) => {
    const apiKey = config.weather;
    const url = `http://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return {
          message: `Things exploded (${error.message})`
        };
      }
    }
  };
}
