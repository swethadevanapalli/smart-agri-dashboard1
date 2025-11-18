import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Sprout, Droplets, ThermometerSun, Wind, AlertTriangle } from 'lucide-react';
import { useSmartAgriData } from '@/hooks/useSmartAgriData';
import { useAgriAI, type Language } from '@/hooks/useAgriAI';
import { LanguageSelector } from '@/components/LanguageSelector';

export function SmartAgriAI() {
  const [language, setLanguage] = useState<Language>('en');
  const { data: agriData, isLoading: isDataLoading } = useSmartAgriData();
  const { data: aiRecommendations, isLoading: isAILoading } = useAgriAI(agriData, language);

  const getStatusColor = (value: number | null, min: number, max: number, optimal?: { min: number; max: number }) => {
    if (value === null) return 'bg-gray-500';
    if (optimal && value >= optimal.min && value <= optimal.max) return 'bg-green-500';
    if (value < min || value > max) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getNPKStatus = (value: number | null, type: 'N' | 'P' | 'K') => {
    if (value === null) return 'unknown';
    
    const ranges = {
      N: { low: 40, high: 60 },
      P: { low: 20, high: 40 },
      K: { low: 150, high: 250 },
    };

    const range = ranges[type];
    if (value < range.low) return 'low';
    if (value > range.high) return 'high';
    return 'good';
  };

  const getPHStatus = (ph: number | null) => {
    if (ph === null) return 'unknown';
    if (ph < 6.0) return 'acidic';
    if (ph > 7.5) return 'alkaline';
    return 'good';
  };

  const getMoistureStatus = (moisture: number | null) => {
    if (moisture === null) return 'unknown';
    if (moisture < 35) return 'dry';
    if (moisture > 65) return 'wet';
    return 'normal';
  };

  const getHealthColor = (status: string) => {
    if (status === 'healthy') return 'text-green-600 bg-green-50 border-green-200';
    if (status === 'improving') return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getPestRiskColor = (risk: string) => {
    if (risk === 'low') return 'bg-green-100 text-green-800 border-green-300';
    if (risk === 'medium') return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };

  if (isDataLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sprout className="h-6 w-6 text-green-600" />
            <CardTitle className="text-2xl">
              {language === 'te' ? 'స్మార్ట్ వ్యవసాయ AI' : 'Smart Agriculture AI'}
            </CardTitle>
          </div>
          <LanguageSelector language={language} onLanguageChange={setLanguage} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* NPK Status */}
        <div>
          <h3 className="text-lg font-semibold mb-3">
            {language === 'te' ? 'నేల పోషకాలు (NPK)' : 'Soil Nutrients (NPK)'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['N', 'P', 'K'].map((nutrient) => {
              const value = agriData?.[nutrient.toLowerCase() as 'n' | 'p' | 'k'];
              const status = getNPKStatus(value, nutrient as 'N' | 'P' | 'K');
              const colorClass = status === 'good' ? 'border-green-500' : status === 'low' ? 'border-red-500' : 'border-yellow-500';
              
              return (
                <div key={nutrient} className={`p-4 border-2 rounded-lg ${colorClass}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">
                      {nutrient}
                      {language === 'te' && nutrient === 'N' && ' (నైట్రోజన్)'}
                      {language === 'te' && nutrient === 'P' && ' (భాస్వరం)'}
                      {language === 'te' && nutrient === 'K' && ' (పొటాషియం)'}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(value, 0, 300)}`} />
                  </div>
                  <div className="text-2xl font-bold mt-1">
                    {value?.toFixed(0) ?? '?'} <span className="text-sm font-normal">mg/kg</span>
                  </div>
                  <div className="text-xs mt-1 text-muted-foreground capitalize">{status}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Soil Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* pH */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="h-5 w-5 text-blue-600" />
              <span className="font-medium">
                {language === 'te' ? 'నేల pH' : 'Soil pH'}
              </span>
            </div>
            <div className="text-3xl font-bold">{agriData?.ph?.toFixed(1) ?? '?'}</div>
            <Badge variant="outline" className="mt-2">
              {getPHStatus(agriData?.ph ?? null)}
              {language === 'te' && getPHStatus(agriData?.ph ?? null) === 'acidic' && ' (ఆమ్ల)'}
              {language === 'te' && getPHStatus(agriData?.ph ?? null) === 'alkaline' && ' (క్షార)'}
              {language === 'te' && getPHStatus(agriData?.ph ?? null) === 'good' && ' (మంచిది)'}
            </Badge>
          </div>

          {/* Moisture */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="h-5 w-5 text-cyan-600" />
              <span className="font-medium">
                {language === 'te' ? 'నేల తేమ' : 'Soil Moisture'}
              </span>
            </div>
            <div className="text-3xl font-bold">{agriData?.moisture?.toFixed(0) ?? '?'}%</div>
            <Badge variant="outline" className="mt-2">
              {getMoistureStatus(agriData?.moisture ?? null)}
              {language === 'te' && getMoistureStatus(agriData?.moisture ?? null) === 'dry' && ' (పొడి)'}
              {language === 'te' && getMoistureStatus(agriData?.moisture ?? null) === 'wet' && ' (తడి)'}
              {language === 'te' && getMoistureStatus(agriData?.moisture ?? null) === 'normal' && ' (సాధారణం)'}
            </Badge>
          </div>
        </div>

        {/* Environmental Conditions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <ThermometerSun className="h-5 w-5 text-orange-600" />
              <span className="font-medium">
                {language === 'te' ? 'ఉష్ణోగ్రత' : 'Temperature'}
              </span>
            </div>
            <div className="text-3xl font-bold">{agriData?.temperature?.toFixed(0) ?? '?'}°C</div>
          </div>

          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Wind className="h-5 w-5 text-sky-600" />
              <span className="font-medium">
                {language === 'te' ? 'తేమశాతం' : 'Humidity'}
              </span>
            </div>
            <div className="text-3xl font-bold">{agriData?.humidity?.toFixed(0) ?? '?'}%</div>
          </div>
        </div>

        {/* Crop Health (NDVI) */}
        <div className={`p-4 border-2 rounded-lg ${getHealthColor(aiRecommendations?.crop_health_status ?? 'improving')}`}>
          <div className="flex items-center gap-2 mb-2">
            <Sprout className="h-5 w-5" />
            <span className="font-semibold text-lg">
              {language === 'te' ? 'పంట ఆరోగ్యం' : 'Crop Health'}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div>
              <div className="text-sm text-muted-foreground">NDVI Score</div>
              <div className="text-2xl font-bold">{agriData?.ndvi?.toFixed(2) ?? '?'}</div>
            </div>
            <div className="flex-1">
              <Badge variant="outline" className="text-lg px-3 py-1">
                {aiRecommendations?.crop_health_status ?? 'analyzing...'}
              </Badge>
            </div>
          </div>
        </div>

        {/* AI Recommendations */}
        {isAILoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
            <span>{language === 'te' ? 'AI సిఫార్సులు లోడ్ అవుతున్నాయి...' : 'Loading AI recommendations...'}</span>
          </div>
        ) : aiRecommendations && (
          <div className="space-y-4">
            {/* Soil Advice */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold mb-2 text-blue-900">
                {language === 'te' ? 'నేల సలహా' : 'Soil Advice'}
              </h4>
              <p className="text-blue-800 text-lg leading-relaxed">{aiRecommendations.soil_advice}</p>
            </div>

            {/* Fertilizer Plan */}
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-semibold mb-2 text-green-900">
                {language === 'te' ? 'ఎరువుల ప్రణాళిక' : 'Fertilizer Plan'}
              </h4>
              <p className="text-green-800 text-lg leading-relaxed">{aiRecommendations.fertilizer_plan}</p>
            </div>

            {/* Irrigation */}
            <div className="p-4 bg-cyan-50 border border-cyan-200 rounded-lg">
              <h4 className="font-semibold mb-2 text-cyan-900">
                {language === 'te' ? 'నీటిపారుదల' : 'Irrigation'}
              </h4>
              <p className="text-cyan-800 text-lg leading-relaxed">{aiRecommendations.irrigation}</p>
            </div>

            {/* Pest Warning */}
            <div className={`p-4 border rounded-lg ${getPestRiskColor(aiRecommendations.pest_warning)}`}>
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5" />
                <h4 className="font-semibold">
                  {language === 'te' ? 'చీడపురుగుల హెచ్చరిక' : 'Pest Warning'}
                </h4>
              </div>
              <Badge className="text-base px-3 py-1 capitalize">
                {aiRecommendations.pest_warning} {language === 'te' ? 'ప్రమాదం' : 'Risk'}
              </Badge>
            </div>

            {/* 2-Day Action Plan */}
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-semibold mb-3 text-purple-900 text-lg">
                {language === 'te' ? '2 రోజుల కార్యాచరణ ప్రణాళిక' : '2-Day Action Plan'}
              </h4>
              <ul className="space-y-2">
                {aiRecommendations.two_day_action_plan.map((action, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-purple-900 text-lg leading-relaxed">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Data Timestamp */}
        {agriData?.timestamp && (
          <div className="text-xs text-muted-foreground text-center pt-2 border-t">
            {language === 'te' ? 'చివరి నవీకరణ: ' : 'Last updated: '}
            {new Date(agriData.timestamp).toLocaleString(language === 'te' ? 'te-IN' : 'en-US')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
