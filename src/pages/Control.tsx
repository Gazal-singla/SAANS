import { useState, useEffect } from 'react';
import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Fan, Wind, Snowflake, Flame, ArrowUpFromLine, GalleryHorizontalEnd, Droplets, CloudRain, ToggleRight, History } from 'lucide-react';

const deviceList = [
  { name: 'Air Purifier', icon: Wind },
  { name: 'Ventilation Fan', icon: Fan },
  { name: 'Exhaust System', icon: ArrowUpFromLine },
  { name: 'Smart Windows', icon: GalleryHorizontalEnd },
  { name: 'AC', icon: Snowflake },
  { name: 'Heater', icon: Flame },
  { name: 'Dehumidifier', icon: Droplets },
  { name: 'Humidifier', icon: CloudRain },
];

interface LogEntry { time: string; device: string; action: string; }

export default function Control() {
  const [autoMode, setAutoMode] = useState(true);
  const [manualStates, setManualStates] = useState<Record<string, boolean>>({});
  const [fanSpeed, setFanSpeed] = useState([50]);
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: '14:32', device: 'Air Purifier', action: 'Turned ON (Auto)' },
    { time: '14:30', device: 'AC', action: 'Turned ON (Auto)' },
    { time: '14:15', device: 'Ventilation Fan', action: 'Speed → 70%' },
    { time: '13:50', device: 'All Devices', action: 'Turned OFF (Room Empty)' },
    { time: '13:20', device: 'Dehumidifier', action: 'Turned ON (Auto)' },
  ]);

  const toggleDevice = (name: string) => {
    if (autoMode) return;
    const newState = !manualStates[name];
    setManualStates(prev => ({ ...prev, [name]: newState }));
    setLogs(prev => [
      { time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), device: name, action: `Turned ${newState ? 'ON' : 'OFF'} (Manual)` },
      ...prev.slice(0, 19),
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-display text-foreground">Device Control</h1>
          <p className="text-sm text-muted-foreground">Manual override & automation settings</p>
        </div>

        {/* Auto Mode Toggle */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sensor-card mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <ToggleRight className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold font-display text-foreground">Auto Mode</h3>
                <p className="text-sm text-muted-foreground">
                  {autoMode ? 'AI-driven automation is active' : 'Manual control enabled'}
                </p>
              </div>
            </div>
            <Switch checked={autoMode} onCheckedChange={setAutoMode} />
          </div>
        </motion.div>

        {/* Manual Device Control */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="sensor-card mb-4">
          <h3 className="text-lg font-semibold font-display text-foreground mb-4">Manual Device Control</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {deviceList.map(d => {
              const isOn = manualStates[d.name] ?? false;
              return (
                <button
                  key={d.name}
                  onClick={() => toggleDevice(d.name)}
                  disabled={autoMode}
                  className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                    autoMode ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  } ${
                    isOn && !autoMode
                      ? 'bg-primary/5 border-primary/30'
                      : 'bg-muted/20 border-border/50 hover:bg-muted/40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isOn && !autoMode ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
                  }`}>
                    <d.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-medium text-foreground">{d.name}</p>
                    <p className={`text-xs font-bold ${isOn && !autoMode ? 'text-primary' : 'text-muted-foreground'}`}>
                      {autoMode ? 'AUTO' : isOn ? 'ON' : 'OFF'}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Fan Speed */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="sensor-card mb-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold font-display text-foreground">Fan Speed</h3>
            <span className="text-lg font-bold font-display text-primary">{fanSpeed[0]}%</span>
          </div>
          <Slider value={fanSpeed} onValueChange={setFanSpeed} max={100} step={5} disabled={autoMode} className="w-full" />
        </motion.div>

        {/* Control History */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="sensor-card">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-5 h-5 text-info" />
            <h3 className="text-lg font-semibold font-display text-foreground">Control History</h3>
          </div>
          <div className="space-y-2">
            {logs.map((log, i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30 border border-border/30">
                <span className="text-xs font-mono text-muted-foreground w-12">{log.time}</span>
                <span className="text-sm font-medium text-foreground flex-1">{log.device}</span>
                <span className="text-xs text-muted-foreground">{log.action}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
