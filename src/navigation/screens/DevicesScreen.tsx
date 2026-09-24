import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';

export default function DevicesScreen() {
  const {
    devices,
    toggleDevice,
    updatingDeviceId,
    isGatewayConnected,
    isDevicesLoading,
    deviceError,
    fetchDevices,
  } = useIoT();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Devices</Text>
      <Text style={styles.subtitle}>Control your connected devices</Text>

      {!isGatewayConnected && (
        <View style={styles.bannerWarning}>
          <Ionicons name="warning-outline" size={20} color="#b91c1c" />
          <Text style={styles.bannerWarningText}>IoT Gateway is disconnected.</Text>
        </View>
      )}

      {deviceError && (
        <View style={styles.bannerError}>
          <Ionicons name="alert-circle-outline" size={20} color="#b91c1c" />
          <Text style={styles.bannerErrorText}>{deviceError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDevices}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {isDevicesLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#000000" />
          <Text style={styles.loadingText}>Loading devices...</Text>
        </View>
      ) : (
        devices.map((device) => {
          const isUpdating = updatingDeviceId === device.id;
          const isSwitchDisabled = !isGatewayConnected || updatingDeviceId !== null;

          return (
            <View key={device.id} style={styles.deviceCard}>
              <View style={styles.deviceInfo}>
                <View style={styles.iconContainer}>
                  <Ionicons name={device.icon} size={28} />
                </View>

                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceType}>{device.type}</Text>
                  <Text style={styles.deviceState}>
                    {isUpdating ? 'Updating...' : device.status ? 'ON' : 'OFF'}
                  </Text>
                </View>
              </View>

              <Switch
                value={device.status}
                disabled={isSwitchDisabled}
                onValueChange={(value) => {
                  toggleDevice(device.id, value);
                }}
              />
            </View>
          );
        })
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 20,
  },
  bannerWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  bannerWarningText: {
    color: '#b91c1c',
    fontSize: 14,
    fontWeight: '600',
  },
  bannerError: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
  },
  bannerErrorText: {
    color: '#b91c1c',
    fontSize: 13,
    flex: 1,
    marginLeft: 8,
  },
  retryButton: {
    backgroundColor: '#b91c1c',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    gap: 10,
  },
  loadingText: {
    fontSize: 14,
    color: '#555555',
  },
  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceType: {
    fontSize: 13,
    marginTop: 3,
  },
  deviceState: {
    fontSize: 12,
    marginTop: 5,
    fontWeight: '600',
  },
});