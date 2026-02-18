import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { TrendingUp, Award } from 'lucide-react';

const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function getAchievement(avg: number): { label: string; color: string } {
  if (avg >= 75) return { label: '🥇 Gold Air Room', color: 'text-warning' };
  if (avg >= 50) return { label: '🥈 Silver Air Room', color: 'text-muted-foreground' };
  return { label: '⚠️ Needs Improvement', color: 'text-danger' };
}

export default function WeeklyTracker({ scores }: { scores: number[] }) {
  const data = scores.map((s, i) => ({ day: days[i], score: s }));
  const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  const improvement = scores.length >= 2 ? Math.round(((scores[6] - scores[0]) / Math.max(scores[0], 1)) * 100) : 0;
  const achievement = getAchievement(avg);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.45 }}
      className="sensor-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold font-display text-foreground">Weekly Tracker</h3>
        </div>
        <div className="flex items-center gap-1 text-sm">
          <TrendingUp className={`w-4 h-4 ${improvement >= 0 ? 'text-safe' : 'text-danger'}`} />
          <span className={`font-medium ${improvement >= 0 ? 'text-safe' : 'text-danger'}`}>
            {improvement >= 0 ? '+' : ''}{improvement}%
          </span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={140}>
        <BarChart data={data}>
          <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              fontSize: 12,
            }}
          />
          <Bar dataKey="score" radius={[6, 6, 0, 0]} barSize={24}>
            {data.map((d, i) => (
              <Cell key={i} fill={d.score >= 70 ? 'hsl(var(--safe))' : d.score >= 40 ? 'hsl(var(--warning))' : 'hsl(var(--danger))'} opacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-3 flex items-center justify-center gap-2">
        <Award className="w-4 h-4" />
        <span className={`text-sm font-semibold ${achievement.color}`}>{achievement.label}</span>
      </div>
    </motion.div>
  );
}
