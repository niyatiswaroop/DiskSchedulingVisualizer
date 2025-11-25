import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from "recharts";

export const ComparisonChart = ({ algorithmResults, currentAlgorithm }) => {
  if (!algorithmResults || algorithmResults.size === 0) {
    return null;
  }

  const data = Array.from(algorithmResults.entries()).map(([algo, metrics]) => ({
    name: algo,
    "Total Seek Time": metrics.totalSeekTime,
    "Average Seek Time": parseFloat(metrics.averageSeekTime.toFixed(2)),
    isCurrent: algo === currentAlgorithm,
  }));

  return (
    <Card className="p-6 bg-card">
      <h3 className="text-lg font-semibold mb-4 text-foreground">
        Algorithm Comparison
        <span className="text-sm font-normal text-muted-foreground ml-2">
          (Showing {algorithmResults.size} algorithm{algorithmResults.size > 1 ? "s" : ""})
        </span>
      </h3>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="name" stroke="hsl(var(--foreground))" />
          <YAxis stroke="hsl(var(--foreground))" />
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
          <Legend />
          <Bar dataKey="Total Seek Time" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-ts-${index}`}
                fill={entry.isCurrent ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                opacity={entry.isCurrent ? 1 : 0.6}
              />
            ))}
          </Bar>

          <Bar dataKey="Average Seek Time" radius={[8, 8, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-as-${index}`}
                fill={entry.isCurrent ? "hsl(var(--accent))" : "hsl(var(--muted-foreground))"}
                opacity={entry.isCurrent ? 1 : 0.6}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <p className="text-sm text-muted-foreground mt-4 text-center">
        Run different algorithms with the same parameters to compare their performance
      </p>
    </Card>
  );
};
