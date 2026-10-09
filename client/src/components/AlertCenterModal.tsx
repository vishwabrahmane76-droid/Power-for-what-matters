import React from 'react';
import {
  Bell,
  X,
  AlertTriangle,
  Info,
  AlertOctagon,
  Check,
  Trash2
} from 'lucide-react';
import { AlertItem } from '../types';
import { sounds } from '../utils/audio';

interface AlertCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerts: AlertItem[];
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}

export const AlertCenterModal: React.FC<AlertCenterModalProps> = ({
  isOpen,
  onClose,
  alerts,
  onMarkRead,
  onDismiss
}) => {
  const [filter, setFilter] = React.useState<string>('ALL');

  if (!isOpen) return null;

  const filtered = alerts.filter(a => (filter === 'ALL' ? true : a.level === filter));

  const getAlertIcon = (level: string) => {
    switch (level) {
      case 'CRITICAL': return AlertOctagon;
      case 'HIGH':
      case 'WARNING': return AlertTriangle;
      default: return Info;
    }
  };

  const getAlertColor = (level: string) => {
    switch (level) {
      case 'CRITICAL': return 'border-red-600 bg-red-950/40 text-red-400';
      case 'HIGH': return 'border-orange-600 bg-orange-950/40 text-orange-400';
      case 'WARNING': return 'border-amber-600 bg-amber-950/40 text-amber-400';
      default: return 'border-cyan-600 bg-cyan-950/40 text-cyan-400';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl rounded-2xl bg-[#111827] border border-[#233554] shadow-2xl p-5 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">EMERGENCY ALERT CENTER</h3>
              <p className="text-xs text-slate-400">
                Live stream of grid faults, load limits, and automated mitigation notifications
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 py-3 border-b border-slate-800 text-xs font-mono">
          {['ALL', 'CRITICAL', 'HIGH', 'WARNING', 'INFO'].map(lvl => (
            <button
              key={lvl}
              onClick={() => setFilter(lvl)}
              className={`px-3 py-1 rounded-lg transition-colors ${
                filter === lvl
                  ? 'bg-cyan-600 text-white font-bold'
                  : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        {/* Alert List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="text-center py-10 text-slate-500 font-mono text-xs">
              No notifications matching this filter.
            </div>
          ) : (
            filtered.map(alert => {
              const Icon = getAlertIcon(alert.level);
              return (
                <div
                  key={alert.id}
                  className={`p-3.5 rounded-xl border text-xs transition-all flex items-start justify-between gap-3 ${getAlertColor(
                    alert.level
                  )} ${alert.isRead ? 'opacity-60' : 'opacity-100'}`}
                >
                  <div className="flex items-start gap-2.5">
                    <Icon className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-white text-xs">{alert.title}</span>
                        <span className="text-[10px] font-mono opacity-75">{alert.timestamp}</span>
                      </div>
                      <p className="text-slate-200 leading-snug">{alert.message}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    {!alert.isRead && (
                      <button
                        onClick={() => onMarkRead(alert.id)}
                        className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                        title="Mark as Read"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={() => onDismiss(alert.id)}
                      className="p-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300"
                      title="Dismiss"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
