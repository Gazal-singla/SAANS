import { motion } from 'framer-motion';
import { Fan, Wind, Snowflake, Flame, ArrowUpFromLine, GalleryHorizontalEnd, Droplets, CloudRain } from 'lucide-react';
import type { DeviceState } from '@/lib/sensorSimulator';

const iconMap: Record<string, any> = {
  'Air Purifier': Wind,
  'Ventilation Fan': Fan,
  'Exhaust System': ArrowUpFromLine,
  'Smart Windows': GalleryHorizontalEnd,
  'AC': Snowflake,
  'Heater': Flame,
  'Dehumidifier': Droplets,
  'Humidifier': CloudRain,
};

export default function DevicePanel({ devices }: { devices: DeviceState[] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="sensor-card"
    >
      <h3 className="text-lg font-semibold font-display text-foreground mb-4">Device Automation</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {devices.map((device, i) => {
          const Icon = iconMap[device.name] || Fan;
          return (
            <motion.div
              key={device.name}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.04 }}
              className={`relative flex flex-col items-center p-3 rounded-xl border text-center transition-all ${
                device.on
                  ? 'bg-primary/5 border-primary/30 shadow-sm'
                  : 'bg-muted/30 border-border/50'
              }`}
              title={device.reason}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                device.on ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
              }`}>
                <Icon className={`w-5 h-5 ${device.on ? 'animate-pulse-glow' : ''}`} />
              </div>
              <span className="text-xs font-medium text-foreground leading-tight">{device.name}</span>
              <span className={`mt-1 text-[10px] font-bold uppercase tracking-wider ${
                device.on ? 'text-primary' : 'text-muted-foreground'
              }`}>
                {device.on ? 'ON' : 'OFF'}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
