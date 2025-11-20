import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { Thermometer, Droplets, Zap, AlertTriangle } from 'lucide-react';
import { SensorData, InventoryItem } from '../types';

interface DashboardProps {
  sensorData: SensorData[];
  inventory: InventoryItem[];
}

const Dashboard: React.FC<DashboardProps> = ({ sensorData, inventory }) => {
  // Calculate quick stats
  const expiringSoonCount = inventory.filter(i => (i.daysRemaining ?? 100) <= 2).length;
  const totalItems = inventory.length;
  const currentTemp = sensorData[sensorData.length - 1]?.fridgeTemp || 3.5;
  const currentPower = sensorData[sensorData.length - 1]?.powerUsage || 120;

  const StatCard = ({ title, value, sub, icon: Icon, color, alert }: any) => (
    <div className={`bg-iot-panel p-5 rounded-2xl border border-gray-800 relative overflow-hidden ${alert ? 'ring-2 ring-iot-danger' : ''}`}>
      <div className={`absolute top-0 right-0 p-4 opacity-10 ${color}`}>
        <Icon size={64} />
      </div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-2 text-gray-400 text-sm font-medium">
          <Icon size={16} />
          {title}
        </div>
        <div className="text-3xl font-bold text-white mb-1">{value}</div>
        <div className={`text-xs ${alert ? 'text-red-400 font-bold' : 'text-gray-500'}`}>{sub}</div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-white">System Overview</h2>
          <p className="text-gray-400 text-sm">Real-time monitoring and analytics</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-800 rounded-full">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-green-400 font-mono">ONLINE</span>
        </div>
      </header>

      {/* Key Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Fridge Temp" 
          value={`${currentTemp}°C`} 
          sub="Optimal Range: 2°C - 4°C"
          icon={Thermometer} 
          color="text-cyan-400"
        />
        <StatCard 
          title="Expiring Soon" 
          value={expiringSoonCount} 
          sub="Items within 48h"
          icon={AlertTriangle} 
          color="text-orange-400"
          alert={expiringSoonCount > 0}
        />
         <StatCard 
          title="Total Items" 
          value={totalItems} 
          sub="Across 5 categories"
          icon={Droplets} 
          color="text-purple-400"
        />
        <StatCard 
          title="Energy Usage" 
          value={`${currentPower}W`} 
          sub="Efficiency: 94%"
          icon={Zap} 
          color="text-yellow-400"
        />
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-6">
        
        {/* Temperature History */}
        <div className="bg-iot-panel p-6 rounded-2xl border border-gray-800 h-[350px] flex flex-col">
          <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <Thermometer className="text-iot-accent" size={18} /> Temperature History (24h)
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sensorData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                  domain={[0, 10]}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="fridgeTemp" 
                  stroke="#38bdf8" 
                  strokeWidth={3} 
                  dot={false} 
                  activeDot={{ r: 6, fill: '#38bdf8' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="freezerTemp" 
                  stroke="#a855f7" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  dot={false} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Humidity/Power Area */}
        <div className="bg-iot-panel p-6 rounded-2xl border border-gray-800 h-[350px] flex flex-col">
           <h3 className="text-white font-semibold mb-6 flex items-center gap-2">
            <Zap className="text-yellow-400" size={18} /> Power Consumption
          </h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sensorData}>
                <defs>
                  <linearGradient id="colorPower" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis 
                  dataKey="time" 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="#64748b" 
                  fontSize={10} 
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                   contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px' }}
                   itemStyle={{ color: '#e2e8f0' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="powerUsage" 
                  stroke="#fbbf24" 
                  fillOpacity={1} 
                  fill="url(#colorPower)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;