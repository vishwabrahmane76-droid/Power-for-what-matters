import React from 'react';
import {
  LayoutDashboard,
  Globe,
  Share2,
  Server,
  TableProperties,
  PlayCircle,
  Sliders,
  BatteryCharging,
  TrendingUp,
  ShieldAlert,
  MapPin,
  History,
  Lock,
  MessageSquareCode,
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { sounds } from '../utils/audio';

export type ActiveTab =
  | 'dashboard'
  | 'landing'
  | 'power-flow'
  | 'systems'
  | 'allocation-table'
  | 'simulator'
  | 'scenarios'
  | 'power-sources'
  | 'forecast'
  | 'risk-monitor'
  | 'facility-map'
  | 'history'
  | 'manual-control'
  | 'ai-assistant'
  | 'settings';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  collapsed,
  onToggleCollapse
}) => {
  const navItems: { id: ActiveTab; label: string; icon: React.ElementType; badge?: string }[] = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    { id: 'landing', label: 'Public Showcase', icon: Globe },
    { id: 'power-flow', label: 'Power Flow Map', icon: Share2, badge: 'Live' },
    { id: 'systems', label: 'Facility Systems', icon: Server, badge: '8' },
    { id: 'allocation-table', label: 'AI Allocation Table', icon: TableProperties },
    { id: 'simulator', label: 'Live Simulation', icon: PlayCircle },
    { id: 'scenarios', label: 'Scenario Simulator', icon: Sliders },
    { id: 'power-sources', label: 'Power Sources', icon: BatteryCharging },
    { id: 'forecast', label: 'Predictive Forecast', icon: TrendingUp },
    { id: 'risk-monitor', label: 'Risk Monitor', icon: ShieldAlert },
    { id: 'facility-map', label: 'Facility Floor Map', icon: MapPin },
    { id: 'history', label: 'Decision History', icon: History },
    { id: 'manual-control', label: 'Manual Control', icon: Lock, badge: 'Lock' },
    { id: 'ai-assistant', label: 'PowerAI Assistant', icon: MessageSquareCode, badge: 'AI' },
    { id: 'settings', label: 'System Settings', icon: SettingsIcon },
  ];

  return (
    <aside
      className={`relative z-30 transition-all duration-300 flex flex-col bg-[#0c121e]/90 border-r border-[#1a263c] ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Navigation List */}
      <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                sounds.playClick();
                onSelectTab(item.id);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all group relative ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-600/20 to-blue-600/10 text-cyan-300 border border-cyan-500/30 shadow-sm shadow-cyan-900/20 font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`w-4 h-4 flex-shrink-0 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />
              {!collapsed && (
                <span className="truncate tracking-wide text-left flex-1">{item.label}</span>
              )}
              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    item.badge === 'Live'
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : item.badge === 'AI'
                      ? 'bg-purple-950 text-purple-300 border border-purple-800'
                      : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse Toggle Footer */}
      <div className="p-2 border-t border-[#1a263c] flex items-center justify-between">
        {!collapsed && (
          <div className="text-[11px] font-mono text-slate-500 px-2 truncate">
            EOC CORE v2.4.0
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors mx-auto"
          title={collapsed ? 'Expand Menu' : 'Collapse Menu'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
};
