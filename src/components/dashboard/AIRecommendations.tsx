import { useState } from 'react';
import { Brain, Leaf, Bug, Droplets, TrendingUp, Loader2, Sprout } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useAIRecommendations } from '@/hooks/useAIRecommendations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const cropTypes = [
  'Wheat', 'Rice', 'Corn', 'Tomato', 'Potato', 'Cotton', 'Sugarcane',
  'Soybean', 'Barley', 'Onion', 'Cabbage', 'Carrot', 'Lettuce',
];

const soilTypes = [
  'Clay', 'Sandy', 'Loamy', 'Silt', 'Peaty', 'Chalky', 'Saline',
];

const seasons = [
  'Spring', 'Summer', 'Autumn', 'Winter', 'Monsoon', 'Dry Season',
];

export default function AIRecommendations() {
  const [cropType, setCropType] = useState('');
  const [soilType, setSoilType] = useState('');
  const [area, setArea] = useState('');
  const [season, setSeason] = useState('');

  const { mutate: getRecommendations, data, isPending, error } = useAIRecommendations();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cropType || !soilType) return;

    getRecommendations({
      cropType,
      soilType,
      area: area ? parseFloat(area) : undefined,
      season: season || undefined,
    });
  };

  return (
    <Card className="data-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <CardTitle>AI-Powered Fertilizer & Pest Recommendations</CardTitle>
            <CardDescription>Get intelligent farming recommendations based on crop and soil analysis</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="crop">Crop Type *</Label>
              <Select value={cropType} onValueChange={setCropType}>
                <SelectTrigger id="crop">
                  <SelectValue placeholder="Select crop" />
                </SelectTrigger>
                <SelectContent>
                  {cropTypes.map((crop) => (
                    <SelectItem key={crop} value={crop}>
                      {crop}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="soil">Soil Type *</Label>
              <Select value={soilType} onValueChange={setSoilType}>
                <SelectTrigger id="soil">
                  <SelectValue placeholder="Select soil" />
                </SelectTrigger>
                <SelectContent>
                  {soilTypes.map((soil) => (
                    <SelectItem key={soil} value={soil}>
                      {soil}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area (hectares)</Label>
              <Input
                id="area"
                type="number"
                step="0.1"
                placeholder="10.5"
                value={area}
                onChange={(e) => setArea(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="season">Season</Label>
              <Select value={season} onValueChange={setSeason}>
                <SelectTrigger id="season">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={!cropType || !soilType || isPending}
            className="w-full md:w-auto"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Get AI Recommendations
              </>
            )}
          </Button>
        </form>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error.message}</AlertDescription>
          </Alert>
        )}

        {data && !data.error && (
          <Tabs defaultValue="fertilizer" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
              <TabsTrigger value="fertilizer">
                <Leaf className="h-4 w-4 mr-2" />
                Fertilizer
              </TabsTrigger>
              <TabsTrigger value="pest">
                <Bug className="h-4 w-4 mr-2" />
                Pest Control
              </TabsTrigger>
              <TabsTrigger value="irrigation">
                <Droplets className="h-4 w-4 mr-2" />
                Irrigation
              </TabsTrigger>
              <TabsTrigger value="seasonal">
                <Sprout className="h-4 w-4 mr-2" />
                Seasonal Tips
              </TabsTrigger>
              <TabsTrigger value="yield">
                <TrendingUp className="h-4 w-4 mr-2" />
                Yield
              </TabsTrigger>
            </TabsList>

            <TabsContent value="fertilizer" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FertilizerCard
                  name="Nitrogen (N)"
                  data={data.fertilizerRecommendations.nitrogen}
                  color="text-blue-500"
                />
                <FertilizerCard
                  name="Phosphorus (P)"
                  data={data.fertilizerRecommendations.phosphorus}
                  color="text-orange-500"
                />
                <FertilizerCard
                  name="Potassium (K)"
                  data={data.fertilizerRecommendations.potassium}
                  color="text-purple-500"
                />
              </div>
              {data.fertilizerRecommendations.micronutrients.length > 0 && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold mb-2">Micronutrients</h4>
                  <ul className="space-y-1">
                    {data.fertilizerRecommendations.micronutrients.map((nutrient, index) => (
                      <li key={index} className="text-sm text-muted-foreground">• {nutrient}</li>
                    ))}
                  </ul>
                </div>
              )}
            </TabsContent>

            <TabsContent value="pest" className="space-y-4 mt-4">
              <RecommendationSection
                title="Common Pests"
                items={data.pestManagement.commonPests}
                icon="🐛"
              />
              <RecommendationSection
                title="Preventive Measures"
                items={data.pestManagement.preventiveMeasures}
                icon="🛡️"
              />
              <RecommendationSection
                title="Organic Solutions"
                items={data.pestManagement.organicSolutions}
                icon="🌿"
              />
              <RecommendationSection
                title="Chemical Options"
                items={data.pestManagement.chemicalOptions}
                icon="⚗️"
              />
              <RecommendationSection
                title="Monitoring Tips"
                items={data.pestManagement.monitoringTips}
                icon="👁️"
              />
            </TabsContent>

            <TabsContent value="irrigation" className="space-y-4 mt-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard title="Frequency" value={data.irrigationAdvice.frequency} />
                <InfoCard title="Amount" value={data.irrigationAdvice.amount} />
                <InfoCard title="Method" value={data.irrigationAdvice.method} />
              </div>
              <RecommendationSection
                title="Critical Growth Stages"
                items={data.irrigationAdvice.criticalStages}
                icon="💧"
              />
            </TabsContent>

            <TabsContent value="seasonal" className="space-y-4 mt-4">
              <RecommendationSection
                title="Seasonal Farming Tips"
                items={data.seasonalTips}
                icon="🌱"
              />
            </TabsContent>

            <TabsContent value="yield" className="space-y-4 mt-4">
              <div className="bg-primary/5 border-2 border-primary rounded-lg p-6 text-center">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Expected Yield</h3>
                <p className="text-3xl font-bold text-primary mb-4">{data.yieldPrediction.expectedYield}</p>
              </div>
              <RecommendationSection
                title="Key Factors Affecting Yield"
                items={data.yieldPrediction.factors}
                icon="📊"
              />
            </TabsContent>
          </Tabs>
        )}

        {data?.error && (
          <Alert>
            <AlertDescription>
              <p className="font-semibold mb-2">Unable to parse structured recommendations</p>
              <div className="text-sm whitespace-pre-wrap">{data.rawResponse}</div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function FertilizerCard({ 
  name, 
  data, 
  color 
}: { 
  name: string; 
  data: { amount: string; timing: string; type: string }; 
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <h3 className={`text-lg font-bold ${color} mb-3`}>{name}</h3>
      <div className="space-y-2">
        <div>
          <p className="text-xs text-muted-foreground">Amount</p>
          <p className="text-sm font-medium text-foreground">{data.amount}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Timing</p>
          <p className="text-sm font-medium text-foreground">{data.timing}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground">Type</p>
          <p className="text-sm font-medium text-foreground">{data.type}</p>
        </div>
      </div>
    </div>
  );
}

function RecommendationSection({ 
  title, 
  items, 
  icon 
}: { 
  title: string; 
  items: string[]; 
  icon: string;
}) {
  return (
    <div className="bg-muted/30 rounded-lg p-4">
      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
        <span>{icon}</span>
        {title}
      </h4>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
            <span className="text-primary mt-0.5">•</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function InfoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="bg-card border border-border rounded-lg p-4">
      <p className="text-xs text-muted-foreground mb-1">{title}</p>
      <p className="text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}
