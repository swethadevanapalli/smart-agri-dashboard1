import { useEffect, useState } from "react";
import { Loader2, MapPin } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useWeatherData } from "@/hooks/useWeatherData";

export default function WeatherMonitoring() {
  const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [geoError, setGeoError] = useState<string | null>(null);

  // 🟢 Get user’s GPS location
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Your browser does not support GPS location.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        });
      },
      () => {
        setGeoError("Location access denied. Weather cannot be fetched.");
      }
    );
  }, []);

  const { data, isLoading, error } = useWeatherData(coords?.lat, coords?.lon, {
    enabled: !!coords,
  });

  if (geoError) {
    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle>Weather Monitoring</CardTitle>
          <CardDescription>Location access required</CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{geoError}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!coords || isLoading) {
    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle>Weather Monitoring</CardTitle>
          <CardDescription>Fetching your location…</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center p-6">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    const isConfigError = error.message.includes('fetch') || error.message.includes('Supabase');
    return (
      <Card className="data-card">
        <CardHeader>
          <CardTitle>Weather Monitoring</CardTitle>
          <CardDescription>
            {isConfigError ? 'Configuration required' : 'Error loading weather'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert variant={isConfigError ? "default" : "destructive"}>
            <AlertDescription>
              {isConfigError 
                ? '⚙️ Please configure Supabase credentials in .env file to enable weather monitoring. See QUICKSTART.md for setup instructions.'
                : `Error loading weather: ${error.message}`}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="data-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          <div>
            <CardTitle>Weather Monitoring</CardTitle>
            <CardDescription>Your Location - Auto Sync</CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-lg font-bold">{data.weather}</p>
        <p className="text-muted-foreground">Temperature: {data.temp}°C</p>
        <p className="text-muted-foreground">Humidity: {data.humidity}%</p>
        <p className="text-muted-foreground">Wind: {data.wind} m/s</p>
      </CardContent>
    </Card>
  );
}
