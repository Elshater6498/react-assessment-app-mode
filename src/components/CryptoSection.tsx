import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface CryptoData {
  id: string;
  name: string;
  symbol: string;
  current_price: number;
}

const CryptoSection = () => {
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([]);
  const [currency, setCurrency] = useState('usd');

  useEffect(() => {
    const fetchCryptoData = async () => {
      try {
        const response = await fetch(
          `https://api.coingecko.com/api/v3/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=4&page=1&sparkline=false`
        );
        const data = await response.json();
        setCryptoData(data);
      } catch (error) {
        console.error('Error fetching crypto data:', error);
      }
    };

    fetchCryptoData();
    const interval = setInterval(fetchCryptoData, 60000); // Update every minute
    return () => clearInterval(interval);
  }, [currency]);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select value={currency} onValueChange={setCurrency}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="usd">USD</SelectItem>
            <SelectItem value="eur">EUR</SelectItem>
            <SelectItem value="gbp">GBP</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cryptoData.map((crypto) => (
          <Card key={crypto.id}>
            <CardHeader>
              <CardTitle>{crypto.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: currency.toUpperCase(),
                }).format(crypto.current_price)}
              </div>
              <div className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default CryptoSection;