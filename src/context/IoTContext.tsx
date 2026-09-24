import React, { createContext, useContext, useState, useEffect } from 'react';
import { Device, SensorData, sampleDevices, sampleSensorData } from '../models/IoTmodels';
import { getDevices, getSensorData, updateDeviceStatus } from '../services/IoTService';

type IoTContextType = {
  devices: Device[];
  sensors: SensorData;
  isGatewayConnected: boolean;
  setGatewayConnected: (connected: boolean) => void;
  isDevicesLoading: boolean;
  isSensorsLoading: boolean;
  updatingDeviceId: number | null;
  deviceError: string | null;
  sensorError: string | null;
  fetchDevices: () => Promise<void>;
  refreshSensors: () => Promise<void>;
  toggleDevice: (id: number, value: boolean) => Promise<void>;
  clearDeviceError: () => void;
  clearSensorError: () => void;
};

const IoTContext = createContext<IoTContextType | undefined>(undefined);

export function IoTProvider({ children }: { children: React.ReactNode }) {
  const [devices, setDevices] = useState<Device[]>(sampleDevices);
  const [sensors, setSensors] = useState<SensorData>(sampleSensorData);
  const [isGatewayConnected, setGatewayConnected] = useState<boolean>(true);
  const [isDevicesLoading, setIsDevicesLoading] = useState<boolean>(false);
  const [isSensorsLoading, setIsSensorsLoading] = useState<boolean>(false);
  const [updatingDeviceId, setUpdatingDeviceId] = useState<number | null>(null);
  const [deviceError, setDeviceError] = useState<string | null>(null);
  const [sensorError, setSensorError] = useState<string | null>(null);

  const fetchDevices = async () => {
    if (!isGatewayConnected) {
      setDeviceError('IoT Gateway is disconnected.');
      return;
    }
    setIsDevicesLoading(true);
    setDeviceError(null);
    try {
      const data = await getDevices();
      setDevices(data);
    } catch (err: any) {
      setDeviceError(err?.message || 'Loading devices failed.');
    } finally {
      setIsDevicesLoading(false);
    }
  };

  const refreshSensors = async () => {
    if (!isGatewayConnected) {
      setSensorError('IoT Gateway is disconnected.');
      return;
    }
    setIsSensorsLoading(true);
    setSensorError(null);
    try {
      const data = await getSensorData();
      setSensors(data);
    } catch (err: any) {
      setSensorError(err?.message || 'Unable to retrieve sensor data.');
    } finally {
      setIsSensorsLoading(false);
    }
  };

  const toggleDevice = async (id: number, value: boolean) => {
    if (!isGatewayConnected) {
      setDeviceError('IoT Gateway is disconnected.');
      return;
    }
    setUpdatingDeviceId(id);
    setDeviceError(null);
    try {
      const updated = await updateDeviceStatus(id, value);
      setDevices((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: updated.status } : d))
      );
    } catch (err: any) {
      const target = devices.find((d) => d.id === id);
      const name = target ? target.name : 'device';
      setDeviceError(err?.message || `Unable to update ${name}.`);
    } finally {
      setUpdatingDeviceId(null);
    }
  };

  const clearDeviceError = () => setDeviceError(null);
  const clearSensorError = () => setSensorError(null);

  return (
    <IoTContext.Provider
      value={{
        devices,
        sensors,
        isGatewayConnected,
        setGatewayConnected,
        isDevicesLoading,
        isSensorsLoading,
        updatingDeviceId,
        deviceError,
        sensorError,
        fetchDevices,
        refreshSensors,
        toggleDevice,
        clearDeviceError,
        clearSensorError,
      }}
    >
      {children}
    </IoTContext.Provider>
  );
}

export function useIoT() {
  const context = useContext(IoTContext);
  if (!context) {
    throw new Error('useIoT must be used inside IoTProvider');
  }
  return context;
}