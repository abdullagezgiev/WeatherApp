import { useTheme } from '../context/ThemeContext';

export const useAppTheme = () => {
  const { colors, ...rest } = useTheme();
  
  return {
    colors: colors || {
      primary: '#5D8AA8',
      background: '#E0F7FA',
      text: '#37474F'
    },
    ...rest
  };
};