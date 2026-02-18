import Navbar from '@/components/layout/Navbar';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Calendar, TrendingUp, BarChart3, Brain } from 'lucide-react';

// Generate mock analytics data
const dailyData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  pm25: 20 + Math.random() * 40,
  co2: 400 + Math.random() * 300,
  temp: 22 + Math.random() * 6,
  humidity: 40 + Math.random() * 20,
}));

const weeklyData = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => ({
  day,
  avgPm25: 25 + Math.random() * 20,
  avgCo2: 450 + Math.random() * 200,
}));

const monthlyData = Array.from({ length: 4 }, (_, i) => ({
  week: `Week ${i + 1}`,
  avgScore: 60 + Math.random() * 30,
}));

const modelMetrics = { mae: 3.42, mse: 18.76, r2: 0.89 };

const featureHistory = [
  { name: 'PM2.5', jan: 32, feb: 28, mar: 35 },
  { name: 'CO₂', jan: 22, feb: 25, mar: 20 },
  { name: 'Temperature', jan: 18, feb: 20, mar: 15 },
  { name: 'Humidity', jan: 15, feb: 14, mar: 18 },
  { name: 'Occupancy', jan: 13, feb: 13, mar: 12 },
];

const chartStyle = {
  backgroundColor: 'hsl(var(--card))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: 12,
};

export default function Analytics() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-20 pb-10 px-4 max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-display text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">Environmental data insights & model performance</p>
        </div>

        {/* Daily Averages */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="sensor-card mb-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold font-display text-foreground">Daily Averages (24h)</h3>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="hour" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} interval={3} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={chartStyle} />
              <Line type="monotone" dataKey="pm25" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} name="PM2.5" />
              <Line type="monotone" dataKey="temp" stroke="hsl(var(--warning))" strokeWidth={2} dot={false} name="Temp" />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-4 mb-4">
          {/* Weekly Trends */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="sensor-card">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold font-display text-foreground">Weekly Trends</h3>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={chartStyle} />
                <Bar dataKey="avgPm25" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={20} name="Avg PM2.5" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Monthly Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="sensor-card">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-info" />
              <h3 className="text-lg font-semibold font-display text-foreground">Monthly Score Summary</h3>
            </div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={monthlyData}>
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip contentStyle={chartStyle} />
                <Bar dataKey="avgScore" radius={[6, 6, 0, 0]} barSize={28}>
                  {monthlyData.map((d, i) => (
                    <Cell key={i} fill={d.avgScore >= 70 ? 'hsl(var(--safe))' : d.avgScore >= 40 ? 'hsl(var(--warning))' : 'hsl(var(--danger))'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* Model Metrics */}
        <div className="grid lg:grid-cols-2 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="sensor-card border-info/20 bg-info/[0.02]">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="w-5 h-5 text-info" />
              <h3 className="text-lg font-semibold font-display text-foreground">Model Performance</h3>
            </div>
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'MAE', value: modelMetrics.mae.toFixed(2), desc: 'Mean Absolute Error' },
                { label: 'MSE', value: modelMetrics.mse.toFixed(2), desc: 'Mean Squared Error' },
                { label: 'R²', value: modelMetrics.r2.toFixed(2), desc: 'R-Squared Score' },
              ].map(m => (
                <div key={m.label} className="text-center p-4 rounded-xl bg-card border border-border/50">
                  <p className="text-2xl font-bold font-display text-foreground">{m.value}</p>
                  <p className="text-sm font-medium text-info">{m.label}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{m.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Feature Importance History */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="sensor-card">
            <h3 className="text-lg font-semibold font-display text-foreground mb-4">Feature Importance (3 months)</h3>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={featureHistory} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis dataKey="name" type="category" width={85} tick={{ fontSize: 11, fill: 'hsl(var(--foreground))' }} />
                <Tooltip contentStyle={chartStyle} />
                <Bar dataKey="jan" fill="hsl(var(--primary))" barSize={8} radius={[0, 3, 3, 0]} name="Jan" />
                <Bar dataKey="feb" fill="hsl(var(--info))" barSize={8} radius={[0, 3, 3, 0]} name="Feb" />
                <Bar dataKey="mar" fill="hsl(var(--warning))" barSize={8} radius={[0, 3, 3, 0]} name="Mar" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
