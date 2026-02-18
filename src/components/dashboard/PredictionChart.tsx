import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';
import { motion } from 'framer-motion';

interface PredictionChartProps {
  predictions: Array<{ minute: number; pm25: number; co2: number; temperature: number; humidity: number }>;
  threshold: number;
}

export default function PredictionChart({ predictions, threshold }: PredictionChartProps) {
  const currentData = predictions.slice(0, 3);
  const futureData = predictions.slice(2);

  const combined = predictions.map((p, i) => ({
    ...p,
    current: i <= 2 ? p.pm25 : undefined,
    predicted: i >= 2 ? p.pm25 : undefined,
    label: `${p.minute}m`,
  }));

  const maxPm25 = Math.max(...predictions.map(p => p.pm25));
  const unsafeZoneTop = maxPm25 > threshold ? maxPm25 + 20 : undefined;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="sensor-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold font-display text-foreground">PM2.5 Prediction</h3>
          <p className="text-sm text-muted-foreground">Next 60-minute forecast</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-primary rounded" />
            <span className="text-muted-foreground">Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-4 h-0.5 bg-accent rounded border-dashed border border-accent" style={{ borderStyle: 'dashed' }} />
            <span className="text-muted-foreground">Predicted</span>
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={combined}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: 12,
            }}
          />
          {unsafeZoneTop && (
            <ReferenceArea y1={threshold} y2={unsafeZoneTop} fill="hsl(var(--danger))" fillOpacity={0.08} />
          )}
          <ReferenceLine y={threshold} stroke="hsl(var(--danger))" strokeDasharray="5 5" label={{ value: 'Threshold', position: 'right', fontSize: 11, fill: 'hsl(var(--danger))' }} />
          <Line type="monotone" dataKey="current" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} connectNulls={false} />
          <Line type="monotone" dataKey="predicted" stroke="hsl(var(--accent))" strokeWidth={2} strokeDasharray="6 4" dot={false} connectNulls={false} />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
