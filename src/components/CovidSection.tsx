import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CovidData {
  country: string;
  cases: number;
  active: number;
  deaths: number;
}

const CovidSection = () => {
  const [covidData, setCovidData] = useState<CovidData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState('Worldwide');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCovidData = async () => {
      setIsLoading(true);
      try {
        const [worldwideResponse, countriesResponse] = await Promise.all([
          fetch('https://disease.sh/v3/covid-19/all'),
          fetch('https://disease.sh/v3/covid-19/countries?sort=cases')
        ]);
        
        const worldwideData = await worldwideResponse.json();
        const countriesData = await countriesResponse.json();

        const formattedData: CovidData[] = [
          { country: 'Worldwide', cases: worldwideData.cases, active: worldwideData.active, deaths: worldwideData.deaths },
          ...countriesData.slice(0, 10).map((country: any) => ({
            country: country.country,
            cases: country.cases,
            active: country.active,
            deaths: country.deaths
          }))
        ];

        setCovidData(formattedData);
      } catch (error) {
        console.error('Error fetching COVID data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCovidData();
  }, []);

  const selectedData = covidData.find((data) => data.country === selectedCountry) || covidData[0];

  if (isLoading) {
    return <div>Loading COVID-19 data...</div>;
  }

  if (!selectedData) {
    return <div>No data available</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={selectedCountry} onValueChange={setSelectedCountry}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select country" />
          </SelectTrigger>
          <SelectContent>
            {covidData.map((data) => (
              <SelectItem key={data.country} value={data.country}>
                {data.country}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedData.cases.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Cases</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedData.active.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Deaths</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{selectedData.deaths.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CovidSection;