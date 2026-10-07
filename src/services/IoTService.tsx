import { Platform } from 'react-native';
import { Device, SensorData } from '../models/IoTmodels';

export const DEFAULT_BASE_URL = Platform.select({
  android: 'http://10.0.2.2:3001',
  default: 'http://localhost:3001',
}) as string;

let apiBaseUrl = DEFAULT_BASE_URL;

export const setApiBaseUrl = (url: string) => {
  apiBaseUrl = url.trim() || DEFAULT_BASE_URL;
};

export const getApiBaseUrl = () => apiBaseUrl;

const buildUrl = (path: string) => `${apiBaseUrl.replace(/\/$/, '')}${path}`;

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(buildUrl(path), {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  });

  const text = await response.text();
  const payload = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const message = payload?.message || payload?.error || 'Request failed.';
    throw new Error(message);
  }

  return payload as T;
}

export async function getSensorData(): Promise<SensorData> {
  return requestJson<SensorData>('/sensors');
}

export async function getDevices(): Promise<Device[]> {
  return requestJson<Device[]>('/devices');
}

export async function updateDeviceStatus(id: number, status: boolean): Promise<Device> {
  return requestJson<Device>(`/devices/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export default {
  getSensorData,
  getDevices,
  updateDeviceStatus,
  setApiBaseUrl,
  getApiBaseUrl,
};
