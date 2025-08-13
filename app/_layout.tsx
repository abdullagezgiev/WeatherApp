import { ThemeProvider } from "@/src/context/ThemeContext";
import { Slot, Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{// screenOptions применяется ко всем экранам в стеке, если не переопределено в options для конкретного экрана
        headerStyle: { // headerStyle определяет стиль заголовка, включая цвет фона
          backgroundColor: '#E0F7FA', // Пример цвета фона заголовка
        },
        headerTintColor: '#5D8AA8', // Пример цвета текста заголовка
        headerTitleStyle: { // headerTitleStyle позволяет задать стиль текста заголовка, например, жирный шрифт
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ title: 'Weather' }}
      />
      <ThemeProvider><Slot/></ThemeProvider>
    </Stack>
  );
}
