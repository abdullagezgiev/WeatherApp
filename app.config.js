require('dotenv').config();

export default {
  extra: {
    WEATHER_API_KEY: process.env.WEATHER_API_KEY || "dc539a0f994b46334f1e678d0",
  },
};
