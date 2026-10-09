import { SystemState } from '../types';

const API_BASE = '/api';

export const api = {
  async getStatus(): Promise<SystemState> {
    const res = await fetch(`${API_BASE}/status`);
    if (!res.ok) throw new Error('Failed to fetch status');
    const json = await res.json();
    return json.data;
  },

  async applyScenario(scenarioKey: string): Promise<SystemState> {
    const res = await fetch(`${API_BASE}/scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ scenarioKey })
    });
    if (!res.ok) throw new Error('Failed to apply scenario');
    const json = await res.json();
    return json.data;
  },

  async triggerEmergency(eventType: string): Promise<SystemState> {
    const res = await fetch(`${API_BASE}/emergency`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ eventType })
    });
    if (!res.ok) throw new Error('Failed to trigger emergency');
    const json = await res.json();
    return json.data;
  },

  async manualOverride(systemId: string, targetKw: number): Promise<{ success: boolean; blocked?: boolean; message: string; data?: SystemState }> {
    const res = await fetch(`${API_BASE}/override`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ systemId, targetKw })
    });
    const json = await res.json();
    if (!res.ok) {
      return { success: false, blocked: json.blocked, message: json.message || 'Override failed' };
    }
    return json;
  },

  async returnControlToAI(): Promise<SystemState> {
    const res = await fetch(`${API_BASE}/override/release`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    if (!res.ok) throw new Error('Failed to release override');
    const json = await res.json();
    return json.data;
  },

  async applyRecommendation(): Promise<{ success: boolean; message: string; state?: SystemState }> {
    const res = await fetch(`${API_BASE}/recommendation/apply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await res.json();
    return json;
  },

  async startSimulation(): Promise<SystemState> {
    const res = await fetch(`${API_BASE}/simulation/start`, { method: 'POST' });
    const json = await res.json();
    return json.data;
  },

  async pauseSimulation(): Promise<SystemState> {
    const res = await fetch(`${API_BASE}/simulation/pause`, { method: 'POST' });
    const json = await res.json();
    return json.data;
  },

  async resetSimulation(): Promise<SystemState> {
    const res = await fetch(`${API_BASE}/simulation/reset`, { method: 'POST' });
    const json = await res.json();
    return json.data;
  },

  async optimizeNow(): Promise<SystemState> {
    const res = await fetch(`${API_BASE}/optimize`, { method: 'POST' });
    const json = await res.json();
    return json.data;
  },

  async applyCustomScenario(payload: unknown): Promise<SystemState> {
    const res = await fetch(`${API_BASE}/custom-scenario`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    return json.data;
  },

  async updateSettings(settings: unknown): Promise<SystemState> {
    const res = await fetch(`${API_BASE}/settings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settings)
    });
    const json = await res.json();
    return json.data;
  },

  async markAlertRead(alertId: string) {
    await fetch(`${API_BASE}/alerts/${alertId}/read`, { method: 'POST' });
  },

  async dismissAlert(alertId: string) {
    await fetch(`${API_BASE}/alerts/${alertId}`, { method: 'DELETE' });
  },

  async sendChatMessage(message: string): Promise<{ answer: string; relevantSystem?: string; confidence: number }> {
    const res = await fetch(`${API_BASE}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    if (!res.ok) throw new Error('Chat failed');
    const json = await res.json();
    return json.data;
  }
};
