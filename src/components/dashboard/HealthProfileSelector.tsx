import { motion } from 'framer-motion';
import { Heart, Baby, User, UserCog } from 'lucide-react';
import type { HealthProfile } from '@/lib/sensorSimulator';

const profiles: { value: HealthProfile; label: string; icon: any; description: string }[] = [
  { value: 'Normal', label: 'Normal', icon: User, description: 'Standard thresholds' },
  { value: 'Asthma', label: 'Asthma', icon: Heart, description: 'Stricter PM2.5 & CO₂' },
  { value: 'Child', label: 'Child', icon: Baby, description: 'Lower temperature range' },
  { value: 'Elderly', label: 'Elderly', icon: UserCog, description: 'Conservative limits' },
];

interface Props {
  selected: HealthProfile;
  onSelect: (p: HealthProfile) => void;
}

export default function HealthProfileSelector({ selected, onSelect }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="sensor-card"
    >
      <h3 className="text-lg font-semibold font-display text-foreground mb-4">Health Profile</h3>
      <div className="grid grid-cols-2 gap-2">
        {profiles.map(p => {
          const active = selected === p.value;
          return (
            <button
              key={p.value}
              onClick={() => onSelect(p.value)}
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                active
                  ? 'bg-primary/5 border-primary/30 shadow-sm'
                  : 'border-border/50 hover:bg-muted/50'
              }`}
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                active ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                <p.icon className="w-4 h-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{p.label}</p>
                <p className="text-[10px] text-muted-foreground">{p.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </motion.div>
  );
}
