import { Device, SensorData, sampleDevices, sampleSensorData } from '../models/IoTmodels';

/**
 * Backend base URL — swap this value (or load from environment) when connecting
 * a real IoT API server.
 *
 * Example real usage:
 *   const response = await fetch(`${BASE_URL}/devices`);
 */
export const BASE_URL = 'http://localhost:3000';

export const delay = (ms: number = 1500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

let simulatedDevices: Device[] = JSON.parse(JSON.stringify(sampleDevices));
let simulatedSensorData: SensorData = { ...sampleSensorData };

let shouldSimulateFailure = false;

export const setSimulateFailure = (fail: boolean) => {
  shouldSimulateFailure = fail;
};

export const getSimulateFailure = () => shouldSimulateFailure;

/**
 * Fetch all sensor readings.
 * Replace the body with a real fetch call when the backend is ready:
 *   const res = await fetch(`${BASE_URL}/sensors`);
 *   if (!res.ok) throw new Error('Unable to retrieve sensor data.');
 *   return res.json();
 */
export async function getSensorData(): Promise<SensorData> {
  await delay(1500);

  if (shouldSimulateFailure) {
    throw new Error('Unable to retrieve sensor data.');
  }

  simulatedSensorData = {
    temperature: Math.round((26 + Math.random() * 4) * 10) / 10,
    humidity: Math.round(58 + Math.random() * 12),
    lightLevel: Math.round(680 + Math.random() * 80),
  };

  return { ...simulatedSensorData };
}

/**
 * Fetch all devices.
 * Replace the body with a real fetch call when the backend is ready:
 *   const res = await fetch(`${BASE_URL}/devices`);
 *   if (!res.ok) throw new Error('Unable to retrieve devices.');
 *   return res.json();
 */
export async function getDevices(): Promise<Device[]> {
  await delay(1500);

  if (shouldSimulateFailure) {
    throw new Error('Unable to retrieve devices.');
  }

  return JSON.parse(JSON.stringify(simulatedDevices));
}

/**
 * Update a device's status.
 * Replace the body with a real fetch call when the backend is ready:
 *   const res = await fetch(`${BASE_URL}/devices/${id}`, {
 *     method: 'PATCH',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ status }),
 *   });
 *   if (!res.ok) throw new Error(`Unable to update device.`);
 *   return res.json();
 */
export async function updateDeviceStatus(id: number, status: boolean): Promise<Device> {
  await delay(1500);

  const device = simulatedDevices.find((d) => d.id === id);

  if (shouldSimulateFailure) {
    throw new Error(`Unable to update ${device ? device.name : 'device'}.`);
  }

  if (!device) {
    throw new Error(`Device with ID ${id} not found.`);
  }

  device.status = status;
  return { ...device };
}

export const resetDevices = () => {
  simulatedDevices = JSON.parse(JSON.stringify(sampleDevices));
};

export default {
  getSensorData,
  getDevices,
  updateDeviceStatus,
  delay,
  setSimulateFailure,
  getSimulateFailure,
  resetDevices,
};
