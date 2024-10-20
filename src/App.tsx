import { useState } from 'react';
import { ThemeProvider } from '@/components/theme-provider';
import { ModeToggle } from '@/components/mode-toggle';
import WeatherSection from '@/components/WeatherSection';
import CryptoSection from '@/components/CryptoSection';
import CovidSection from '@/components/CovidSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function App() {
  const [activeTab, setActiveTab] = useState('weather');

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <header className="p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">React Assessment App</h1>
          <ModeToggle />
        </header>
        <main className="container mx-auto p-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="weather">Weather</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="covid">COVID-19</TabsTrigger>
            </TabsList>
            <TabsContent value="weather">
              <WeatherSection />
            </TabsContent>
            <TabsContent value="crypto">
              <CryptoSection />
            </TabsContent>
            <TabsContent value="covid">
              <CovidSection />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;