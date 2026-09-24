import { Device, SensorData, sampleDevices, sampleSensorData } from '../models/IoTmodels';

export const delay = (ms: number = 1500): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

let simulatedDevices: Device[] = JSON.parse(JSON.stringify(sampleDevices));
let simulatedSensorData: SensorData = { ...sampleSensorData };

let shouldSimulateFailure = false;

export const setSimulateFailure = (fail: boolean) => {
  shouldSimulateFailure = fail;
};

export const getSimulateFailure = () => shouldSimulateFailure;

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

export async function getDevices(): Promise<Device[]> {
  await delay(1500);

  if (shouldSimulateFailure) {
    throw new Error('Unable to retrieve devices.');
  }

  return JSON.parse(JSON.stringify(simulatedDevices));
}

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
