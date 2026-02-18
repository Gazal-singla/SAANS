import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { Brain } from 'lucide-react';

interface XAIProps {
  features: Array<{ name: string; importance: number }>;
  explanation: string;
}

export default function ExplainableAI({ features, explanation }: XAIProps) {
  const chartData = features.map(f => ({
    name: f.name,
    importance: Math.round(f.importance * 100),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 }}
      className="sensor-card border-info/20 bg-info/[0.02]"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="w-9 h-9 rounded-lg bg-info/10 flex items-center justify-center">
          <Brain className="w-5 h-5 text-info" />
        </div>
        <div>
          <h3 className="text-lg font-semibold font-display text-foreground">Explainable AI</h3>
          <p className="text-xs text-muted-foreground">Random Forest — Feature Importance</p>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
          <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} domain={[0, 40]} />
          <YAxis dataKey="name" type="category" width={90} tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: 12,
            }}
            formatter={(val: number) => `${val}%`}
          />
          <Bar dataKey="importance" radius={[0, 4, 4, 0]} barSize={16}>
            {chartData.map((_, i) => (
              <Cell key={i} fill={i === 0 ? 'hsl(var(--info))' : i === 1 ? 'hsl(var(--primary))' : 'hsl(var(--muted-foreground))'} opacity={i < 2 ? 1 : 0.4} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-3 p-3 rounded-lg bg-info/5 border border-info/10">
        <p className="text-sm text-foreground leading-relaxed">{explanation}</p>
      </div>
    </motion.div>
  );
}
