import React from 'react';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  Zap,
  Battery,
  Sun,
  ShieldCheck
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { ForecastData } from '../types';

interface PowerForecastViewProps {
  forecast: ForecastData;
}

export const PowerForecastView: React.FC<PowerForecastViewProps> = ({ forecast }) => {
  const [selectedHorizon, setSelectedHorizon] = React.useState('4h');

  return (
    <div className="space-y-5">
      {/* Top Banner / Statements */}
      <div className="rounded-2xl bg-[#111827] border border-[#1f2c42] p-5 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base tracking-wide flex items-center gap-2">
                PREDICTIVE POWER DEMAND FORECAST
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800">
                  AI PROJECTION HORIZON
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Machine learning load trajectory models forecasting 15m, 30m, 1h, and 4h ahead
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            {['15m', '30m', '1h', '4h'].map(horizon => (
              <button
                key={horizon}
                onClick={() => setSelectedHorizon(horizon)}
                className={`px-3 py-1 rounded-lg transition-colors ${
                  selectedHorizon === horizon
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {horizon}
              </button>
            ))}
          </div>
        </div>

        {/* AI Predictive Insight Statements */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
          {forecast.statements.map((statement, idx) => (
            <div
              key={idx}
              className="p-3.5 rounded-xl bg-[#0d1524] border border-cyan-500/20 text-xs font-mono flex items-start gap-2.5 text-slate-200"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold block mb-0.5">
                  AI Predictive Assessment #{idx + 1}
                </span>
                <span>{statement}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Primary Chart: Demand vs Generation Forecast */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Chart 1: Available Generation vs Predicted Demand */}
        <div className="rounded-2xl bg-[#111827] border border-[#1f2c42] p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              Power Demand vs Available Bus Capacity (kW)
            </h4>
            <span className="text-[11px] font-mono text-slate-400">Kilowatt Horizon</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecast.points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="availableGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="demandGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ec4899" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#ec4899" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="availablePower"
                  name="Available Generation (kW)"
                  stroke="#0ea5e9"
                  fillOpacity={1}
                  fill="url(#availableGrad)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="predictedDemand"
                  name="Predicted Demand (kW)"
                  stroke="#ec4899"
                  fillOpacity={1}
                  fill="url(#demandGrad)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Battery State of Charge & Solar Projection */}
        <div className="rounded-2xl bg-[#111827] border border-[#1f2c42] p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-white text-sm flex items-center gap-2">
              <Battery className="w-4 h-4 text-emerald-400" />
              BESS Battery Reserve (%) & Solar Output (kW)
            </h4>
            <span className="text-[11px] font-mono text-slate-400">Storage & Renewables</span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecast.points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f293d" />
                <XAxis dataKey="time" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Line
                  type="monotone"
                  dataKey="batteryLevel"
                  name="Battery SOC (%)"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="solarGen"
                  name="Solar Array (kW)"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
