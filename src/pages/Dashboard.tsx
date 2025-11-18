import { Activity, TrendingUp, Droplets, ThermometerSun } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import SatelliteMonitoring from '@/components/dashboard/SatelliteMonitoring';
import WeatherMonitoring from '@/components/dashboard/WeatherMonitoring';
import CropHealthAnalyzer from '@/components/dashboard/CropHealthAnalyzer';
import IrrigationRecommendations from '@/components/dashboard/IrrigationRecommendations';
import AIRecommendations from '@/components/dashboard/AIRecommendations';
import { SmartAgriAI } from '@/components/dashboard/SmartAgriAI';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-earth-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Welcome to <span className="gradient-text">AgriSmart</span>
          </h2>
          <p className="text-muted-foreground">
            Monitor crop health, predict irrigation needs, and detect diseases using satellite data, weather APIs, and AI analysis
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            title="Crop Health Index"
            value="0.78"
            icon={Activity}
            trend="up"
            trendValue="+5.2%"
            status="success"
          />
          <StatCard
            title="Soil Moisture"
            value="42"
            unit="%"
            icon={Droplets}
            trend="down"
            trendValue="-3.1%"
            status="warning"
          />
          <StatCard
            title="Avg Temperature"
            value="26"
            unit="°C"
            icon={ThermometerSun}
            trend="up"
            trendValue="+2.4°C"
            status="info"
          />
          <StatCard
            title="Growth Rate"
            value="94"
            unit="%"
            icon={TrendingUp}
            trend="up"
            trendValue="+8.5%"
            status="success"
          />
        </div>

        {/* Main Content Grid */}
        <div className="space-y-8">
          {/* Satellite Monitoring */}
          <SatelliteMonitoring />

          {/* Weather & Irrigation Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <WeatherMonitoring />
            <IrrigationRecommendations />
          </div>

          {/* Smart Agriculture AI System with Language Support */}
          <SmartAgriAI />

          {/* AI Recommendations */}
          <AIRecommendations />

          {/* Crop Health Analyzer */}
          <CropHealthAnalyzer />
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>Real-time data from Sentinel-2 satellite, OpenWeather API, and AI-powered recommendations</p>
        </div>
      </div>
    </div>
  );
}
