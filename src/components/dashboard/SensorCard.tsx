import { motion } from 'framer-motion';
import { type LucideIcon } from 'lucide-react';

interface SensorCardProps {
  label: string;
  value: string | number;
  unit: string;
  icon: LucideIcon;
  status: 'safe' | 'warning' | 'danger';
  index: number;
}

const statusClasses = {
  safe: 'border-safe/20 bg-safe/5',
  warning: 'border-warning/20 bg-warning/5',
  danger: 'border-danger/20 bg-danger/5',
};

const iconClasses = {
  safe: 'bg-safe/10 text-safe',
  warning: 'bg-warning/10 text-warning',
  danger: 'bg-danger/10 text-danger',
};

const dotClasses = {
  safe: 'bg-safe',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

export default function SensorCard({ label, value, unit, icon: Icon, status, index }: SensorCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`sensor-card border ${statusClasses[status]}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconClasses[status]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex items-center gap-1.5">
          <div className={`w-2 h-2 rounded-full ${dotClasses[status]} animate-pulse-glow`} />
          <span className="text-xs font-medium text-muted-foreground capitalize">{status}</span>
        </div>
      </div>
      <p className="text-2xl font-bold font-display text-foreground">
        {value}
        <span className="text-sm font-normal text-muted-foreground ml-1">{unit}</span>
      </p>
      <p className="text-sm text-muted-foreground mt-1">{label}</p>
    </motion.div>
  );
}
