import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  unit?: string;
  icon: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  status?: 'success' | 'warning' | 'danger' | 'info';
}

export default function StatCard({
  title,
  value,
  unit,
  icon: Icon,
  trend,
  trendValue,
  status = 'info',
}: StatCardProps) {
  const statusColors = {
    success: 'bg-primary/10 text-primary border-primary/20',
    warning: 'bg-accent/10 text-accent border-accent/20',
    danger: 'bg-destructive/10 text-destructive border-destructive/20',
    info: 'bg-secondary text-secondary-foreground border-border',
  };

  return (
    <div className="stat-card group">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg border ${statusColors[status]} group-hover:scale-110 transition-transform`}>
          <Icon className="h-5 w-5" />
        </div>
        {trend && trendValue && (
          <div className={`text-xs font-medium px-2 py-1 rounded ${
            trend === 'up' ? 'bg-primary/10 text-primary' : 
            trend === 'down' ? 'bg-destructive/10 text-destructive' : 
            'bg-muted text-muted-foreground'
          }`}>
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-1">{title}</p>
        <div className="flex items-baseline gap-1">
          <p className="text-3xl font-bold text-foreground">{value}</p>
          {unit && <span className="text-sm text-muted-foreground">{unit}</span>}
        </div>
      </div>
    </div>
  );
}
