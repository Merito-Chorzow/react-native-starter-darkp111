import * as Location from 'expo-location';

const API_KEY = '4d5110ac896461f9741256fc05a9295b'; // i left api key for test

export async function getWeather() {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Permission to access location was denied');
      return { city: 'Unknown', temp: null, icon: 'cloud-outline' };
    }

    const { coords } = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = coords;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
    );
    const data = await response.json();

    const city = data.name || 'Unknown';
    const temp = data.main ? Math.round(data.main.temp) : null;

    const weatherMain = data.weather?.[0]?.main || '';
    const icon = mapWeatherToIcon(weatherMain);

    return { city, temp, icon };
  } catch (error) {
    console.error('WeatherService error:', error);
    return { city: 'Unavailable', temp: null, icon: 'alert-circle-outline' };
  }
}

function mapWeatherToIcon(main) {
  switch (main.toLowerCase()) {
    case 'clear':
      return 'sunny-outline';
    case 'clouds':
      return 'cloud-outline';
    case 'rain':
      return 'rainy-outline';
    case 'snow':
      return 'snow-outline';
    case 'thunderstorm':
      return 'thunderstorm-outline';
    case 'drizzle':
      return 'partly-sunny-outline';
    default:
      return 'partly-sunny-outline';
  }
}
