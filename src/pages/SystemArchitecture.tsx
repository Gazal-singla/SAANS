import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { Cpu, Wifi, Cloud, Brain, Monitor, Settings2, Radio, ArrowRight } from 'lucide-react';

const layers = [
  {
    icon: Radio,
    title: 'Sensors',
    description: 'DHT22, MQ-135, PMS5003, PIR motion sensor collect real-time PM2.5, CO₂, VOC, temperature, humidity, and occupancy data.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Cpu,
    title: 'ESP32 Microcontroller',
    description: 'Processes raw sensor signals, performs initial filtering, and packages data for wireless transmission.',
    color: 'bg-info/10 text-info',
  },
  {
    icon: Wifi,
    title: 'WiFi Communication',
    description: 'ESP32 transmits sensor data via WiFi using MQTT/HTTP protocol to the cloud backend.',
    color: 'bg-warning/10 text-warning',
  },
  {
    icon: Cloud,
    title: 'Cloud Backend',
    description: 'Data is stored in the cloud database with real-time sync. Handles user authentication and data persistence.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Brain,
    title: 'ML Model (Random Forest)',
    description: 'Trained Random Forest model predicts future air quality (60-min window). Provides feature importance for Explainable AI.',
    color: 'bg-info/10 text-info',
  },
  {
    icon: Monitor,
    title: 'Dashboard',
    description: 'Real-time visualization with charts, scores, and alerts. Updates every 30 seconds with live data.',
    color: 'bg-primary/10 text-primary',
  },
  {
    icon: Settings2,
    title: 'Multi-Device Control',
    description: 'Automated control of 8 devices (purifier, AC, heater, fans, windows, etc.) based on AI predictions and thresholds.',
    color: 'bg-warning/10 text-warning',
  },
];

export default function SystemArchitecture() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-10 px-4 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <h1 className="text-3xl font-bold font-display text-foreground">System Architecture</h1>
          <p className="text-muted-foreground mt-2">End-to-end flow from sensors to smart device control</p>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

          <div className="space-y-4">
            {layers.map((layer, i) => (
              <motion.div
                key={layer.title}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="sensor-card flex items-start gap-4 md:ml-14 relative">
                  {/* Connector dot */}
                  <div className="absolute -left-[2.15rem] top-6 w-4 h-4 rounded-full bg-card border-2 border-primary hidden md:block" />

                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${layer.color}`}>
                    <layer.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-semibold font-display text-foreground">{layer.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{layer.description}</p>
                  </div>
                </div>

                {i < layers.length - 1 && (
                  <div className="flex justify-center md:ml-14 py-1">
                    <ArrowRight className="w-4 h-4 text-muted-foreground rotate-90" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 sensor-card border-info/20 bg-info/[0.02]"
        >
          <h3 className="text-lg font-semibold font-display text-foreground mb-2">How SAANS Works</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            SAANS collects environmental data from IoT sensors via an ESP32 microcontroller. Data is transmitted wirelessly to a cloud backend where it's stored and processed. A Random Forest ML model analyzes current readings and predicts conditions 60 minutes ahead. Based on predictions and configurable health-profile thresholds, the system automatically controls up to 8 devices. Every decision is explainable — users can see which features drove each automation action.
          </p>
        </motion.div>
      </main>
    </div>
  );
}
