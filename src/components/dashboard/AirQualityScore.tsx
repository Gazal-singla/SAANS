import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

function getBadge(score: number): { label: string; status: 'safe' | 'warning' | 'danger' } {
  if (score >= 70) return { label: 'Excellent', status: 'safe' };
  if (score >= 40) return { label: 'Moderate', status: 'warning' };
  return { label: 'Poor', status: 'danger' };
}

const badgeClasses = {
  safe: 'bg-safe/10 text-safe border border-safe/20',
  warning: 'bg-warning/10 text-warning border border-warning/20',
  danger: 'bg-danger/10 text-danger border border-danger/20',
};

export default function AirQualityScore({ score }: { score: number }) {
  const badge = getBadge(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="sensor-card"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-lg font-semibold font-display text-foreground">Room Air Score</h3>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${badgeClasses[badge.status]}`}>
          {badge.label}
        </span>
      </div>

      <div className="text-center mb-4">
        <span className="text-5xl font-bold font-display text-foreground">{score}</span>
        <span className="text-lg text-muted-foreground">/100</span>
      </div>

      <Progress value={score} className="h-2.5" />

      <p className="text-xs text-muted-foreground mt-3 text-center">
        Safe minute → +1 point · Unsafe minute → −2 points
      </p>
    </motion.div>
  );
}
