import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Cloud, Sun, Droplets } from 'lucide-react';

interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  humidity: number;
}

const API_KEY = '923caf2db822fe7c75a4808398e53614'; // Replace with your actual API key

const WeatherSection = () => {
  const [cities, setCities] = useState<string[]>([
    'New York',
    'London',
    'Tokyo',
  ]);
  const [newCity, setNewCity] = useState('');
  const [weatherData, setWeatherData] = useState<WeatherData[]>([]);

  useEffect(() => {
    const fetchWeatherData = async () => {
      const data = await Promise.all(
        cities.map(async (city) => {
          try {
            const response = await fetch(
              `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
            );
            const result = await response.json();
            return {
              city: result.name,
              temperature: Math.round(result.main.temp),
              condition: result.weather[0].main,
              humidity: result.main.humidity,
            };
          } catch (error) {
            console.error(`Error fetching weather for ${city}:`, error);
            return null;
          }
        })
      );
      setWeatherData(data.filter((item): item is WeatherData => item !== null));
    };

    fetchWeatherData();
  }, [cities]);

  const handleAddCity = () => {
    if (newCity && !cities.includes(newCity)) {
      setCities([...cities, newCity]);
      setNewCity('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="Add a city"
          value={newCity}
          onChange={(e) => setNewCity(e.target.value)}
        />
        <Button onClick={handleAddCity}>Add</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {weatherData.map((data) => (
          <Card key={data.city}>
            <CardHeader>
              <CardTitle>{data.city}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{data.temperature}°C</div>
                <div>
                  {data.condition === 'Clear' && <Sun className="h-6 w-6" />}
                  {data.condition === 'Clouds' && <Cloud className="h-6 w-6" />}
                  {data.condition === 'Rain' && (
                    <Droplets className="h-6 w-6" />
                  )}
                </div>
              </div>
              <div className="mt-2">Humidity: {data.humidity}%</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WeatherSection;
