// Simulates realistic IoT sensor data with gradual changes

let state = {
  pm25: 25 + Math.random() * 20,
  co2: 450 + Math.random() * 100,
  gas: 0.3 + Math.random() * 0.4,
  temperature: 24 + Math.random() * 4,
  humidity: 45 + Math.random() * 15,
  occupancy: Math.floor(Math.random() * 5),
};

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val));
}

function drift(current: number, min: number, max: number, maxDelta: number) {
  const delta = (Math.random() - 0.48) * maxDelta;
  return clamp(current + delta, min, max);
}

export function getSimulatedSensorData() {
  state = {
    pm25: Math.round(drift(state.pm25, 5, 200, 8) * 10) / 10,
    co2: Math.round(drift(state.co2, 350, 2000, 30)),
    gas: Math.round(drift(state.gas, 0.1, 5, 0.2) * 100) / 100,
    temperature: Math.round(drift(state.temperature, 15, 40, 0.5) * 10) / 10,
    humidity: Math.round(drift(state.humidity, 20, 90, 2) * 10) / 10,
    occupancy: Math.max(0, Math.round(drift(state.occupancy, 0, 10, 0.5))),
  };
  return { ...state };
}

export function computeAQI(pm25: number): { value: number; label: string; status: 'safe' | 'warning' | 'danger' } {
  if (pm25 <= 35) return { value: Math.round((pm25 / 35) * 50), label: 'Good', status: 'safe' };
  if (pm25 <= 75) return { value: Math.round(50 + ((pm25 - 35) / 40) * 50), label: 'Moderate', status: 'warning' };
  return { value: Math.round(100 + ((pm25 - 75) / 125) * 100), label: 'Unhealthy', status: 'danger' };
}

export function getRoomHealth(pm25: number, co2: number, temperature: number, humidity: number): { label: string; status: 'safe' | 'warning' | 'danger' } {
  let issues = 0;
  if (pm25 > 50) issues++;
  if (co2 > 1000) issues++;
  if (temperature > 32 || temperature < 18) issues++;
  if (humidity > 70 || humidity < 30) issues++;
  if (issues === 0) return { label: 'Excellent', status: 'safe' };
  if (issues <= 2) return { label: 'Moderate', status: 'warning' };
  return { label: 'Poor', status: 'danger' };
}

export type HealthProfile = 'Normal' | 'Asthma' | 'Child' | 'Elderly';

export function getThresholds(profile: HealthProfile) {
  const base = { pm25: 50, co2: 1000, tempHigh: 30, tempLow: 18, humidityHigh: 70, humidityLow: 30 };
  switch (profile) {
    case 'Asthma': return { ...base, pm25: 25, co2: 800, humidityHigh: 60 };
    case 'Child': return { ...base, pm25: 30, co2: 800, tempHigh: 28, tempLow: 20 };
    case 'Elderly': return { ...base, pm25: 35, co2: 900, tempHigh: 28, tempLow: 20 };
    default: return base;
  }
}

export interface DeviceState {
  name: string;
  on: boolean;
  reason: string;
}

export function computeAutomation(
  data: ReturnType<typeof getSimulatedSensorData>,
  thresholds: ReturnType<typeof getThresholds>
): DeviceState[] {
  const devices: DeviceState[] = [
    { name: 'Air Purifier', on: false, reason: '' },
    { name: 'Ventilation Fan', on: false, reason: '' },
    { name: 'Exhaust System', on: false, reason: '' },
    { name: 'Smart Windows', on: false, reason: '' },
    { name: 'AC', on: false, reason: '' },
    { name: 'Heater', on: false, reason: '' },
    { name: 'Dehumidifier', on: false, reason: '' },
    { name: 'Humidifier', on: false, reason: '' },
  ];

  if (data.occupancy === 0) {
    return devices.map(d => ({ ...d, reason: 'Room empty — Energy Saving Mode' }));
  }

  // Pollution
  if (data.pm25 > thresholds.pm25) {
    devices[0] = { ...devices[0], on: true, reason: `PM2.5 (${data.pm25}) exceeds threshold (${thresholds.pm25})` };
    devices[1] = { ...devices[1], on: true, reason: `PM2.5 elevated — increasing ventilation` };
  }
  if (data.pm25 > thresholds.pm25 * 2) {
    devices[2] = { ...devices[2], on: true, reason: `PM2.5 extremely high (${data.pm25})` };
    devices[3] = { ...devices[3], on: true, reason: `Opening windows for emergency ventilation` };
  }

  // Temperature
  if (data.temperature > thresholds.tempHigh) {
    devices[4] = { ...devices[4], on: true, reason: `Temperature (${data.temperature}°C) > ${thresholds.tempHigh}°C` };
  }
  if (data.temperature < thresholds.tempLow) {
    devices[5] = { ...devices[5], on: true, reason: `Temperature (${data.temperature}°C) < ${thresholds.tempLow}°C` };
  }

  // Humidity
  if (data.humidity > thresholds.humidityHigh) {
    devices[6] = { ...devices[6], on: true, reason: `Humidity (${data.humidity}%) > ${thresholds.humidityHigh}%` };
  }
  if (data.humidity < thresholds.humidityLow) {
    devices[7] = { ...devices[7], on: true, reason: `Humidity (${data.humidity}%) < ${thresholds.humidityLow}%` };
  }

  // High occupancy boost
  if (data.occupancy > 5) {
    devices[1] = { ...devices[1], on: true, reason: `High occupancy (${data.occupancy}) — boosting ventilation` };
  }

  return devices;
}

export function generatePredictions(current: ReturnType<typeof getSimulatedSensorData>) {
  const points = [];
  let pm25 = current.pm25;
  let co2 = current.co2;
  let temp = current.temperature;
  let hum = current.humidity;
  for (let i = 0; i <= 60; i += 5) {
    pm25 = clamp(pm25 + (Math.random() - 0.45) * 5, 5, 200);
    co2 = clamp(co2 + (Math.random() - 0.45) * 20, 350, 2000);
    temp = clamp(temp + (Math.random() - 0.48) * 0.3, 15, 40);
    hum = clamp(hum + (Math.random() - 0.48) * 1.5, 20, 90);
    points.push({
      minute: i,
      pm25: Math.round(pm25 * 10) / 10,
      co2: Math.round(co2),
      temperature: Math.round(temp * 10) / 10,
      humidity: Math.round(hum * 10) / 10,
    });
  }
  return points;
}

export function getFeatureImportance(devices: DeviceState[]) {
  const activeDevices = devices.filter(d => d.on);
  if (activeDevices.length === 0) {
    return {
      features: [
        { name: 'PM2.5', importance: 0.15 },
        { name: 'CO₂', importance: 0.12 },
        { name: 'Temperature', importance: 0.10 },
        { name: 'Humidity', importance: 0.08 },
        { name: 'Occupancy', importance: 0.05 },
      ],
      explanation: 'All parameters within safe limits. No automation required.',
    };
  }

  const features = [
    { name: 'PM2.5', importance: activeDevices.some(d => d.name.includes('Purifier') || d.name.includes('Exhaust')) ? 0.35 : 0.1 },
    { name: 'CO₂', importance: activeDevices.some(d => d.name.includes('Ventilation')) ? 0.25 : 0.08 },
    { name: 'Temperature', importance: activeDevices.some(d => d.name === 'AC' || d.name === 'Heater') ? 0.30 : 0.07 },
    { name: 'Humidity', importance: activeDevices.some(d => d.name.includes('humidifier')) ? 0.28 : 0.06 },
    { name: 'Occupancy', importance: activeDevices.some(d => d.reason.includes('occupancy')) ? 0.20 : 0.05 },
  ].sort((a, b) => b.importance - a.importance);

  const top2 = features.slice(0, 2);
  const deviceNames = activeDevices.map(d => d.name).join(', ');
  const explanation = `${deviceNames} activated because ${top2[0].name} was the primary factor (importance: ${(top2[0].importance * 100).toFixed(0)}%) and ${top2[1].name} contributed secondarily (${(top2[1].importance * 100).toFixed(0)}%).`;

  return { features, explanation };
}
