//services/weatherApi.ts
import axios from 'axios';
import Constants from 'expo-constants';
import { CurrentWeather, CurrentWeatherResponse, ForecastItem, ForecastResponse } from '../types/weather';

// const apiKey = "ваш_новый_ключ";
const apiKey = 'dc539a0f994b46334f1e678d02516f18';

if (!apiKey) {
  console.error('API key is missing! Check .env and app.config.js');
}

export const fetchCurrentWeather = async (city: string): Promise<CurrentWeather> => {
  try {
    const response = await axios.get<CurrentWeatherResponse>(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
    );
    // if (response.data.cod !== 200) { // OpenWeatherMap может возвращать 200 даже при ошибках
    //   throw new Error(response.data.message || 'Unknown API error');
    // }
    // const response = await axios.get<CurrentWeather>(`...`);
    return response.data;
  } catch (error) {
    console.error('Full error:', error);
    throw new Error(
      // error.response?.data?.message || 
      // error.message || 
      'Network error. Check your connection.'
    );
  }
};

// Поиск по городам
export const searchCities = async (query: string) => {
  const response = await axios.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
  );
  return response.data; // Возвращает массив город { name, country, lat, lot }
}

// Прогноз на 5 дней
export const fetch5DayForecast = async (lat: number, lon: number): Promise<ForecastItem[]> => {
  const response = await axios.get<ForecastResponse>(
    `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
  );
  // const response = await axios.get<{ list: ForecastItem[] }>(`...`);
  return response.data.list; // Массив прогнозов на каждые 3 часа
}

// a) Автодополнение городов
// Используйте API геокодинга:
const fetchCitySuggesthions = async (query: string) => {
  const response = await axios.get(
    `https://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5&appid=${apiKey}`
  );
  return response.data.map((city: any) => city.name);
}