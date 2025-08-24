🌤️ Weather App - React Native Weather Application
<div align="center">
https://img.shields.io/badge/React_Native-0.72.0-61DAFB?style=for-the-badge&logo=react
https://img.shields.io/badge/TypeScript-5.0.0-3178C6?style=for-the-badge&logo=typescript
https://img.shields.io/badge/Expo-49.0.0-000020?style=for-the-badge&logo=expo
https://img.shields.io/badge/License-MIT-green?style=for-the-badge

</div>
Мобильное приложение для просмотра текущей погоды и прогноза на 5 дней. С красивым интерфейсом, поддержкой темной темы и поиском по городам.

<p align="center"> <img src="assets/screenshot-light.png" width="30%" alt="Light Theme" /> <img src="assets/screenshot-dark.png" width="30%" alt="Dark Theme" /> </p>
✨ Особенности
Текущая погода - температура, влажность, скорость ветра, описание

5-дневный прогноз - почасовые данные с иконками погоды

Поиск по городам - поддержка любого города мира

Темная тема - автоматическое переключение с анимациями

Адаптивный дизайн - работает на iOS и Android

Офлайн-кэширование - последние данные доступны без интернета

🛠 Технологии
Frontend: React Native 0.72, TypeScript, Expo

Навигация: React Navigation 6.x

Анимации: React Native Reanimated

HTTP-клиент: Axios

Иконки: Expo Vector Icons

Градиенты: Expo Linear Gradient

Хранение данных: AsyncStorage

📦 Установка и запуск
Предварительные требования
Node.js 18+

npm или yarn

Expo CLI

1. Клонирование репозитория
bash
git clone https://github.com/ваш-username/weather-app.git
cd weather-app
2. Установка зависимостей
bash
npm install
# или
yarn install
3. Настройка API ключа
Получите бесплатный API ключ на OpenWeatherMap и создайте файл .env:

env
OPENWEATHER_API_KEY=ваш_api_ключ_тут
4. Запуск приложения
bash
# Запуск разработческого сервера
npx expo start

# Запуск на iOS
npx expo start --ios

# Запуск на Android
npx expo start --android
🚀 Как использовать
Главный экран - автоматически показывает погоду в вашем городе

Поиск - нажмите на поисковую строку и введите название города

Переключение темы - используйте иконку солнца/луны в правом верхнем углу

Обновление - потяните вниз для обновления данных

📁 Структура проекта
text
src/
├── components/          # Переиспользуемые компоненты
│   ├── WeatherCard/
│   └── ForecastItem/
├── context/            # React Context (Theme, Weather)
├── services/           # API и внешние сервисы
│   └── weatherApi.ts
├── types/              # TypeScript определения
├── utils/              # Вспомогательные функции
└── assets/             # Изображения и иконки
🌐 API
Приложение использует OpenWeatherMap API:

Текущая погода: /weather

5-дневный прогноз: /forecast

Поиск городов: /geo/1.0/direct

📸 Скриншоты
<div align="center">
Главный экран	Поиск городов	Темная тема
<img src="assets/main-screen.jpg" width="200">	<img src="assets/search.jpg" width="200">	<img src="assets/dark-theme.jpg" width="200">
</div>
🔧 Настройка для разработки
Добавление нового функционала
Создайте ветку для новой фичи:

bash
git checkout -b feature/new-weather-charts
Установите необходимые зависимости:

bash
npx expo install react-native-svg
После завершения работы создайте pull request

Сборка для production
bash
# Создание билда для iOS
eas build --platform ios

# Создание билда для Android  
eas build --platform android
🤝 Как можно помочь
Приветствуются пул-реквесты и предложения! Особенно по:

Добавлению новых виджетов погоды

Улучшению анимаций

Оптимизации производительности

Переводом на новые языки

📄 Лицензия
Этот проект распространяется под лицензией MIT. Подробнее см. в файле LICENSE.

👨‍💻 Автор
Абдулла Гезгиев 

GitHub

LinkedIn

Портфолио

💬 Контакты
Если у вас есть вопросы или предложения:

Создайте issue

Напишите на email: gezgievabdulla@gmail.com

Добавьте в Telegram: @AbdullahtopG

⭐ Не забудьте поставить звезду репозиторию, если проект вам понравился!