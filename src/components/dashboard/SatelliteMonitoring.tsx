import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Satellite, TrendingUp, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useSatelliteData } from '@/hooks/useSatelliteData';

export default function SatelliteMonitoring() {

  // 🟢 Expanded Mogdumpur BBOX (more reliable satellite data)
  const bbox = [79.18, 18.45, 79.25, 18.50];

  // 🟢 Use last 10 days (better chance of cloud-free NDVI)
  const now = new Date();
  const toDate = now.toISOString().replace(/\.\d+Z$/, "Z");

  const past = new Date();
  past.setDate(now.getDate() - 10);
  const fromDate = past.toISOString().replace(/\.\d+Z$/, "Z");

  const { data, isLoading, error } = useSatelliteData(bbox, fromDate, toDate);

  if (isLoading) {
    return (
      <Card className="data-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Satellite className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Satellite Data Monitoring</CardTitle>
              <CardDescription>Loading NDVI data...</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
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
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Satellite className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Satellite Data Monitoring</CardTitle>
              <CardDescription>
                {isConfigError ? 'Configuration required' : 'Error loading NDVI data'}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert variant={isConfigError ? "default" : "destructive"}>
            <AlertDescription>
              {isConfigError 
                ? '⚙️ Please configure Supabase credentials in .env file to enable satellite monitoring. See QUICKSTART.md for setup instructions.'
                : error.message}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="data-card">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Satellite className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Satellite Data Monitoring</CardTitle>
              <CardDescription>No NDVI data found for Mogdumpur</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>No NDVI data available for this period and region.</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const latestData = data[data.length - 1];

  return (
    <Card className="data-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Satellite className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Satellite Data Monitoring</CardTitle>
              <CardDescription>Mogdumpur NDVI Trend</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-primary font-medium">Live</span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <MetricCard
            label="NDVI Index"
            value={latestData.ndvi.toFixed(3)}
            status={latestData.ndvi > 0.7 ? 'success' : latestData.ndvi > 0.5 ? 'warning' : 'danger'}
            description="Vegetation health indicator"
          />
          <MetricCard
            label="Land Temperature"
            value={`${latestData.temperature.toFixed(1)}°C`}
            status="info"
            description="Estimated temperature"
          />
        </div>

        <div className="h-80 mt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis 
                dataKey="date" 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <YAxis 
                className="text-xs"
                stroke="hsl(var(--muted-foreground))"
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="ndvi" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                name="NDVI"
                dot={{ fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

function MetricCard({ 
  label, 
  value, 
  status, 
  description 
}: { 
  label: string; 
  value: string; 
  status: 'success' | 'warning' | 'danger' | 'info';
  description: string;
}) {
  const statusColors = {
    success: 'border-primary bg-primary/5',
    warning: 'border-accent bg-accent/5',
    danger: 'border-destructive bg-destructive/5',
    info: 'border-border bg-muted/30',
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${statusColors[status]} transition-all hover:shadow-md`}>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground mb-1">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
