import { View, Text, ActivityIndicator, Button, GestureResponderEvent, Image, TextInput, StyleSheet, FlatList, TouchableOpacity, TouchableWithoutFeedback, LayoutAnimation } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { fetch5DayForecast, fetchCurrentWeather } from '../src/services/weatherApi';
import { ForecastItem } from '@/src/types/weather';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  withSpring, 
  useAnimatedStyle,
  interpolateColor,
  FadeIn
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { Keyboard } from 'react-native';
import { ThemeProvider, useTheme } from '@/src/context/ThemeContext';
import { useAppTheme } from '@/src//hooks/useAppTheme';

// Описываем структуру объекта внутри массива "weather"
interface WeatherDetails {
  description: string;
  icon: string;
}
// Обновляем интерфейс BasicWeatherData, чтобы он правильно описывал данные
interface BasicWeatherData {
  weather: WeatherDetails[];
  name?: string;
  main?: {
    temp?: number;
    humidity?: number;
  };
  wind?: {
    speed?: number;
  };
  coord?: {
    lat: number;
    lon: number;
  };
}

function ThemedApp() {
  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  )
}
export default function HomeScreen() {
  const [dailyForecast, setDailyForecast] = useState<ForecastItem[]>([]);
  const [weatherData, setWeatherData] = useState<BasicWeatherData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [currentCity, setCurrentCity] = useState('Moscow');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [isInputFocused, setIsInputFocused] = useState(false);

  // Анимационные значения 
  const bgAnimation = useSharedValue(0);
  const spinValue = useSharedValue(0);
  // const historyOpacity = useRef(new Animated.Value(0)).current;
  const { theme, toggleTheme, textStyle } = useTheme();
  const { colors } = useAppTheme(); // Гарантированно получите colors

  const dismissKeyboard = () => {
    Keyboard.dismiss();
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  };
  // Стиль для анимированного фона
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      bgAnimation.value,
      [0, 1],
      ['#E0F7FA', '#B2EBF2']
    )
  }));

  // Стиль для анимации обновления
  const spinStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spinValue.value * 360}deg`}]
  }));

  const loadWeather = async (city: string = currentCity) => {
    try {
      setIsRefreshing(true);
      setError('');

      // Загрузка текущей погоды
      const data = await fetchCurrentWeather(city);
      setWeatherData(data);

      if (data.coord) {const forecast = await fetch5DayForecast(
        data.coord.lat, // Используем данные из только что полученного ответа
        data.coord.lon
      );
      // Загрузка и фильтрация прогноза
      const filtered = forecast.filter((_: any, index: number) => index % 8 === 0); // Фильтрация
      setDailyForecast(filtered);
      } 

      // Запуск анимации успешной загрузки
      bgAnimation.value = withSpring(1, { damping: 10 });
      } catch (err: any) {
        console.log('Full error:', err.response?.data || err);
        setError(err.message || 'Неизвестная ошибка');
        setError(err.message || 'Город не найден');
        bgAnimation.value = 0;
      } finally {
        setLoading(false);
        setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    spinValue.value = withSpring(spinValue.value + 1, { damping: 15 });
    loadWeather(searchQuery || 'Moscow');
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setSearchHistory(prev => [...new Set([searchQuery, ...prev])]);
      Keyboard.dismiss();
    }
    if(!searchQuery.trim()) return;

    try {
      setLoading(true);
      setCurrentCity(searchQuery);
      setSearchHistory(prev => [...new Set([searchQuery, ...prev].slice(0, 5))]);
      await loadWeather(searchQuery); // Передаем город в функцию загрузки
    } catch (error) {
      console.error('Ошибка поиска:', error);
    } finally {
      setLoading(false);
    }
  };

  // const handleInputChange = (text: string) => {
  //   setSearchQuery(text);
  //   if (text.length > 2) {
  //     const filtered = searchHistory.filter(city => 
  //       city.toLowerCase().includes(text.toLowerCase())
  //     );
  //     setSuggetions(filtered);
  //   } else {
  //     setSuggetions([]);
  //   }
  // };

  useEffect(() => {
    loadWeather();
  }, []);

  // useEffect(() => {
  //   Animated.timing(historyOpacity, {
  //     toValue: isInputFocused ? 1 : 0,
  //     duration: 200,
  //     useNativeDriver: true,
  //   }).start();
  // }, [isInputFocused]);

  if (loading && !isRefreshing) {
    return <ActivityIndicator size="large" style={styles.loader}/>;
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Ошибка: {error}</Text>
        <Button 
          title="Повторить" 
          onPress={() => loadWeather(searchQuery || 'Moscow')} 
          color="#5D8AA8"
        />
      </View>
    );
  }

    return (
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <Animated.View style={[styles.container, bgStyle,]}>
          {/* Кнопка переключения темы */}
            <TouchableOpacity 
              onPress={toggleTheme}
              style={{ 
                position: 'absolute', 
                top: 40, 
                right: 20,
                padding: 10
              }}
            >
             <Ionicons 
                name={theme === 'light' ? 'moon' : 'sunny'} 
                size={24} 
                color={colors.primary} 
              />
            </TouchableOpacity>
          <LinearGradient 
            // colors={['rgba(255,255,255,0.3)', 'rgba(255,255,255,0)']}
            colors={['#E0F7FA', '#B2EBF2']}
            style={styles.header}
          >
            <View style={styles.searchContainer}>
              <TextInput
                placeholder="Введите город"
                value={searchQuery}
                onChangeText={setSearchQuery}
                // onSubmitEditing={
                //   if (searchQuery) setSearchHistory(prev => [...new Set([searchQuery, ...prev])])
                // }
                onSubmitEditing={handleSearch}
                style={styles.searchInput}
                blurOnSubmit={true} // Скрывает клавиатуру после отправки
                returnKeyType='done' // Меняет текст на кнопке  
                placeholderTextColor="#888"
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                textContentType="addressCity" // Активирует автозаполнение городов
                // autoCompleteType="city" // Для Android
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity
                  onPress={() => {
                    setSearchQuery('');
                    Keyboard.dismiss();
                  }}
                  style={styles.clearButton}
                >
                  <Ionicons name='close' size={20} color='#888'/>
                </TouchableOpacity>
              )}

            </View>
            
            <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
              <Animated.View style={spinStyle}>
                <Ionicons name="search" size={20} 
                  color="#5D8AA8"
                />
              </Animated.View>
            </TouchableOpacity>
          </LinearGradient>

          {/* История поиска */}
          {(isInputFocused || searchQuery) && searchHistory.length > 0 && (
            <Animated.View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Недавние запросы:</Text>
              {searchHistory.map((city, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    setSearchQuery(city);
                    // handleSearch();
                  }}
                >
                  <Text style={styles.historyItem}>{city}</Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          )}

          <View style={styles.weatherCard}>
            {weatherData?.weather?.[0]?.icon && (
              <Image
                source={{ uri: `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}}
                style={styles.weatherIcon}
              />
            )}
            
            <Text style={styles.cityText}>
              {weatherData?.name}
            </Text>
            
            <Text style={styles.temperatureText}>
              {Math.round(weatherData?.main?.temp || 0)}°C
            </Text>

            <Text style={styles.dateText}>
              {new Date().toLocaleDateString('ru-RU', {
                weekday: 'long',
                day: 'numeric',
                month: 'long'
              })}
            </Text>
            
            <Text style={styles.descriptionText}>
              {weatherData?.weather?.[0]?.description}
            </Text>
          </View>
          

          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Ionicons name="water" size={20} color="#5D8AA8" />
              <Text style={styles.detailText}>
                {weatherData?.main?.humidity}%
              </Text>
            </View>
            
            <View style={styles.detailItem}>
              <Ionicons name="speedometer" size={20} color="#5D8AA8" />
              <Text style={styles.detailText}>
                {weatherData?.wind?.speed} м/с
              </Text>
            </View>
          </View>

          <Text style={styles.forecastTitle}>Прогноз на 5 дней</Text>
          
          <FlatList 
            horizontal
            data={dailyForecast} 
            keyExtractor={(item) => item.dt.toString()}
            initialNumToRender={3} // Рендерит только первые 3 элемента
            windowSize={5} // Оптимизация памяти
            renderItem={({ item }) => (
              <View style={styles.forecastItem}>
                <Text style={styles.forecastDay}>
                  {new Date(item.dt * 1000).toLocaleDateString('ru', { weekday: 'short'})}
                </Text>
                <Image
                  source={{ uri: `https://openweathermap.org/img/wn/${item.weather[0].icon}.png` }}
                  style={[styles.forecastIcon, { tintColor: '#5D8AA8' }]}
                />
                <Text style={styles.forecastTemp}>
                  {Math.round(item.main.temp)}°C
                </Text>
              </View>
            )}
            contentContainerStyle={styles.forecastContainer}
            showsHorizontalScrollIndicator={false}
          />
        </Animated.View>
      </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#E1F5FE',
    // backgroundColor: 'transparent', // Важно для градиента
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#ff4444',
    marginBottom: 20,
    textAlign: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    borderRadius: 20,
    marginTop: 23,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  historyContainer: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 10,
    padding: 10,
    marginTop: 5,
  },
  historyItem: {
    padding: 8,
    color: '#37474F',
  },
  historyTitle: {},
  searchContainer: {
    flexDirection: 'row',
    height: 40, // Фиксированная высота
    width: 280,
    marginBottom: 13
  },
  searchInput: {
    flex: 1,
    height: 50,
    paddingHorizontal: 15,
    color: '#37474F',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 25,
    marginRight: 10,
    fontSize: 16,
  },
  clearButton: {
    position: 'absolute',
    right: 20,
    top: 15,
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 20,
  },
  weatherCard: {
    alignItems: 'center',
    padding: 25,
    marginBottom: 20,
    borderRadius: 25,
    // backgroundColor: 'rgba(156, 210, 255, 0.7)',
    backgroundColor: '#FFFFFF',
    // backgroundColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  weatherIcon: {
    width: 100,
    height: 100,
  },
  cityText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#37474F',
    marginTop: 10,
  },
  temperatureText: {
    fontSize: 48,
    fontWeight: '300',
    color: '#37474F',
    marginVertical: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#5D8AA8',
    marginTop: 5,
    textAlign: 'center'
  },
  descriptionText: {
    fontSize: 16,
    color: '#5D8AA8',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  detailText: {
    marginLeft: 8,
    color: '#37474F',
    fontSize: 16,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 15,
    paddingLeft: 5,
  },
  forecastContainer: {
    paddingBottom: 15,
  },
  forecastItem: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    marginHorizontal: 8,
    paddingVertical: 15,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  forecastDay: {
    fontWeight: '600',
    color: '#37474F',
    marginBottom: 5,
  },
  forecastIcon: {
    width: 40,
    height: 40,
    marginVertical: 5,
  },
  forecastTemp: {
    fontWeight: '500',
    color: '#5D8AA8',
  },
});


