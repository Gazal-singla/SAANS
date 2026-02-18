import { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import SensorCard from '@/components/dashboard/SensorCard';
import PredictionChart from '@/components/dashboard/PredictionChart';
import DevicePanel from '@/components/dashboard/DevicePanel';
import ExplainableAI from '@/components/dashboard/ExplainableAI';
import AirQualityScore from '@/components/dashboard/AirQualityScore';
import WeeklyTracker from '@/components/dashboard/WeeklyTracker';
import HealthProfileSelector from '@/components/dashboard/HealthProfileSelector';
import { useSensorData } from '@/hooks/useSensorData';
import { getThresholds, type HealthProfile } from '@/lib/sensorSimulator';
import { Droplets, Thermometer, Wind, Gauge, CloudHail, Users, Activity, ShieldCheck } from 'lucide-react';

function getStatus(value: number, low: number, high: number): 'safe' | 'warning' | 'danger' {
  if (value <= low) return 'safe';
  if (value <= high) return 'warning';
  return 'danger';
}

export default function Dashboard() {
  const [healthProfile, setHealthProfile] = useState<HealthProfile>('Normal');
  const { sensorData, aqi, roomHealth, devices, predictions, xai, score, weeklyScores } = useSensorData(healthProfile);
  const thresholds = getThresholds(healthProfile);

  const cards: Array<{ label: string; value: string | number; unit: string; icon: typeof Wind; status: 'safe' | 'warning' | 'danger' }> = [
    { label: 'PM2.5', value: sensorData.pm25, unit: 'µg/m³', icon: Wind, status: getStatus(sensorData.pm25, thresholds.pm25 * 0.6, thresholds.pm25) },
    { label: 'CO₂', value: sensorData.co2, unit: 'ppm', icon: CloudHail, status: getStatus(sensorData.co2, thresholds.co2 * 0.7, thresholds.co2) },
    { label: 'Gas / VOC', value: sensorData.gas, unit: 'ppm', icon: Gauge, status: getStatus(sensorData.gas, 1.5, 3) },
    { label: 'Temperature', value: sensorData.temperature, unit: '°C', icon: Thermometer, status: (sensorData.temperature > thresholds.tempHigh || sensorData.temperature < thresholds.tempLow) ? 'danger' as const : 'safe' as const },
    { label: 'Humidity', value: sensorData.humidity, unit: '%', icon: Droplets, status: (sensorData.humidity > thresholds.humidityHigh || sensorData.humidity < thresholds.humidityLow) ? 'warning' as const : 'safe' as const },
    { label: 'AQI', value: aqi.value, unit: aqi.label, icon: Activity, status: aqi.status },
    { label: 'Occupancy', value: sensorData.occupancy, unit: sensorData.occupancy === 1 ? 'person' : 'people', icon: Users, status: sensorData.occupancy === 0 ? 'warning' as const : 'safe' as const },
    { label: 'Room Health', value: roomHealth.label, unit: '', icon: ShieldCheck, status: roomHealth.status },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-display text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Live environmental monitoring · Updates every 30s</p>
        </div>

        {/* Sensor Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          {cards.map((card, i) => (
            <SensorCard key={card.label} {...card} index={i} />
          ))}
        </div>

        {/* Prediction + Devices */}
        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          <PredictionChart predictions={predictions} threshold={thresholds.pm25} />
          <DevicePanel devices={devices} />
        </div>

        {/* XAI + Score */}
        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          <ExplainableAI features={xai.features} explanation={xai.explanation} />
          <AirQualityScore score={score} />
        </div>

        {/* Weekly + Health */}
        <div className="grid lg:grid-cols-2 gap-4">
          <WeeklyTracker scores={weeklyScores} />
          <HealthProfileSelector selected={healthProfile} onSelect={setHealthProfile} />
        </div>
      </main>
    </div>
  );
}
