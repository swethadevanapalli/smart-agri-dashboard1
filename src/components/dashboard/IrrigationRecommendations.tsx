import { Droplets, Calendar, Clock, Info } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function IrrigationRecommendations() {
  const recommendation = {
    waterNeeded: 25,
    nextIrrigation: 'Tomorrow, 6:00 AM',
    frequency: 'Every 3 days',
    reason: 'Based on current soil moisture (35%) and upcoming weather forecast',
  };

  return (
    <Card className="data-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Droplets className="h-5 w-5 text-accent" />
          </div>
          <div>
            <CardTitle>Irrigation Recommendations</CardTitle>
            <CardDescription>Smart watering schedule based on data analysis</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <RecommendationCard
            icon={Droplets}
            label="Water Needed"
            value={`${recommendation.waterNeeded} mm`}
            color="text-blue-500"
          />
          <RecommendationCard
            icon={Calendar}
            label="Next Irrigation"
            value={recommendation.nextIrrigation}
            color="text-green-500"
          />
          <RecommendationCard
            icon={Clock}
            label="Frequency"
            value={recommendation.frequency}
            color="text-purple-500"
          />
        </div>

        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 flex items-start gap-3">
          <Info className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-1">Analysis</h4>
            <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <IrrigationTip tip="Water early morning to reduce evaporation losses" />
          <IrrigationTip tip="Monitor soil moisture levels after each irrigation" />
          <IrrigationTip tip="Adjust schedule based on rainfall predictions" />
        </div>
      </CardContent>
    </Card>
  );
}

function RecommendationCard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  color: string;
}) {
  return (
    <div className="bg-card border border-border rounded-lg p-4 hover:shadow-md transition-all">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`h-5 w-5 ${color}`} />
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
      <p className="text-lg font-bold text-foreground">{value}</p>
    </div>
  );
}

function IrrigationTip({ tip }: { tip: string }) {
  return (
    <div className="flex items-start gap-2 text-sm text-muted-foreground">
      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
      <span>{tip}</span>
    </div>
  );
}
