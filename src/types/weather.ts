// Тип для текущей погоды
export interface CurrentWeather {
    name: string;
    main: {
        temp: number;
        humidity: number;
    };
    weather: Array <{
        description: string;
        icon: string;
    }>;
    wind: {
        speed: number;
    };
    coord: {
        lat: number;
        lon: number;
    };
}

export interface WinData {
    speed: number;
    deg: number;
    gust?: number;
}
// Тип для прогноза 
export interface ForecastItem {
    // dt: number;
    // main: {
    //     temp: number;
    // };
    // weather: Array<{
    //     icon: string;
    // }>;
    dt: number;
    main: MainWeatherData;
    weather: WeatherCondition[];
    clouds: { all: number };
    visibility: number;
    pop: number;
    dt_txt: string;
}

export interface Coordinates {
    lat: number;
    lon: number;
}

export interface WeatherCondition {
    id: number;
    main: string;
    description: string;
    icon: string;
}

export interface MainWeatherData {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
}

export interface CurrentWeatherResponse {
    coord: Coordinates;
    weather: WeatherCondition[];
    main: MainWeatherData;
    name: string;
    dt: number;
    wind: {
        speed: number;
    };
}

export interface ForecastResponse {
    list: ForecastItem[];
    city: {
        id: number;
        name: string;
        coord: Coordinates;
        country: string;
        timezone: number;
    };
}