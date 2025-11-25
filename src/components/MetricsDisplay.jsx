import { Card } from "@/components/ui/card";
import { Activity, Target, TrendingUp } from "lucide-react";

export const MetricsDisplay = ({ metrics }) => {
  if (!metrics) {
    return (
      <Card className="p-6 bg-card">
        <p className="text-center text-muted-foreground">Run an algorithm to see performance metrics</p>
      </Card>
    );
  }

  const metricItems = [
    {
      label: "Total Seek Time",
      value: metrics.totalSeekTime,
      icon: Activity,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      label: "Seek Count",
      value: metrics.seekCount,
      icon: Target,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Average Seek Time",
      value: typeof metrics.averageSeekTime === "number" ? metrics.averageSeekTime.toFixed(2) : metrics.averageSeekTime,
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {metricItems.map((item, idx) => {
        const Icon = item.icon;
        return (
          <Card key={idx} className="p-6 bg-card hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{item.label}</p>
                <p className={`text-3xl font-bold ${item.color}`}>{item.value}</p>
              </div>
              <div className={`p-3 rounded-full ${item.bgColor}`}>
                <Icon className={`w-6 h-6 ${item.color}`} />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
