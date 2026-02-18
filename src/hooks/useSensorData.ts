import { useState, useEffect, useCallback } from 'react';
import {
  getSimulatedSensorData,
  computeAQI,
  getRoomHealth,
  computeAutomation,
  generatePredictions,
  getFeatureImportance,
  getThresholds,
  type HealthProfile,
  type DeviceState,
} from '@/lib/sensorSimulator';

export function useSensorData(healthProfile: HealthProfile = 'Normal') {
  const [sensorData, setSensorData] = useState(getSimulatedSensorData());
  const [predictions, setPredictions] = useState(generatePredictions(sensorData));
  const [devices, setDevices] = useState<DeviceState[]>([]);
  const [xai, setXai] = useState(getFeatureImportance([]));
  const [history, setHistory] = useState<Array<ReturnType<typeof getSimulatedSensorData> & { time: string }>>([]);
  const [score, setScore] = useState(72);
  const [weeklyScores, setWeeklyScores] = useState([65, 70, 68, 75, 72, 78, 72]);

  const refresh = useCallback(() => {
    const data = getSimulatedSensorData();
    const thresholds = getThresholds(healthProfile);
    const devs = computeAutomation(data, thresholds);
    const preds = generatePredictions(data);
    const feat = getFeatureImportance(devs);

    setSensorData(data);
    setDevices(devs);
    setPredictions(preds);
    setXai(feat);

    const aqi = computeAQI(data.pm25);
    setScore(prev => {
      const delta = aqi.status === 'safe' ? 1 : -2;
      return Math.max(0, Math.min(100, prev + delta));
    });

    setHistory(prev => {
      const next = [...prev, { ...data, time: new Date().toLocaleTimeString() }];
      return next.slice(-20);
    });

    setWeeklyScores(prev => {
      const updated = [...prev];
      updated[6] = Math.max(0, Math.min(100, updated[6] + (aqi.status === 'safe' ? 1 : -1)));
      return updated;
    });
  }, [healthProfile]);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, [refresh]);

  const aqi = computeAQI(sensorData.pm25);
  const roomHealth = getRoomHealth(sensorData.pm25, sensorData.co2, sensorData.temperature, sensorData.humidity);

  return { sensorData, aqi, roomHealth, devices, predictions, xai, history, score, weeklyScores, refresh };
}
