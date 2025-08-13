import React, { createContext, useContext, useState, useEffect } from 'react';
import { ColorSchemeName } from 'react-native';
import Animated, { 
  useSharedValue, 
  withTiming,
  interpolateColor,
  useAnimatedStyle
} from 'react-native-reanimated';
// import AsyncStorage from '@react-native-async-storage/async-storage';

type ThemeContextType = {
    theme: ColorSchemeName;
    colors: ThemeColors;
    toggleTheme: () => void;
    bgStyle: Animated.AnimatedSrtyleProp<any>;
    textStyle: Animated.AnimatedStyleProp<any>;
};

type ThemeColors = {
    primary: string;
    background: string;
    text: string;
    card: string;
};

const lightColors: ThemeColors = {
    primary: '#5D8AA8',
    background: '#E0F7FA',
    text: '#37474F',
    card: 'rgba(255,255,255,0.9)',
};

const darkColors: ThemeColors = {
    primary: '#7FB3D5',
    background: '#1A1A2E',
    text: '#E2E8F0',
    card: 'rgba(30,30,30,0.9)',
}

const ThemeContext = createContext<ThemeContextType>({} as ThemeContextType);

export const ThemeProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [theme, setTheme] = useState<ColorSchemeName>('light');
    const progress = useSharedValue(0);

    // Загрузка темы из памяти
    useEffect(() => {
        const loadTheme = async () => {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme) {
                setTheme(savedTheme as ColorSchemeName);
                progress.value = savedTheme === 'dark' ? 1 : 0;
            }
        };
        loadTheme(); 
    }, []);

    // Анимированные стили 
    const bgStyle = useAnimatedStyle(() => ({
        backgroundColor: interpolateColor(
            progress.value,
            [0, 1],
            [lightColors.background, darkColors.background]
        ),
    }));

    const textStyle = useAnimatedStyle(() => ({
        color: interpolateColor(
            progress.value,
            [0, 1],
            [lightColors.text, darkColors.text]
        ),
    }));

    // Переключение темы
    const toggleTheme = async () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        progress.value = withTiming(newTheme === 'dark' ? 1 : 0, { duration: 500 });
        await AsyncStorage.setItem('theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            colors: theme === 'light' ? lightColors : darkColors,
            toggleTheme,
            bgStyle,
            textStyle
        }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext);