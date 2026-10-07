import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';
import { Colors } from '../../theme/colors';

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function DashboardScreen() {
  const {
    devices,
    sensors,
    toggleDevice,
    updatingDeviceId,
    isGatewayConnected,
    isDevicesLoading,
    refreshSensors,
    deviceError,
    fetchDevices,
    clearDeviceError,
  } = useIoT();

  useEffect(() => {
    fetchDevices();
    refreshSensors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeCount = devices.filter((d) => d.status).length;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>{getGreeting()}</Text>
      <Text style={styles.title}>IoT Dashboard</Text>

      {/* Gateway disconnected banner */}
      {!isGatewayConnected && (
        <View style={styles.bannerWarning}>
          <Ionicons name="warning-outline" size={18} color={Colors.warning} />
          <Text style={styles.bannerWarningText}>
            IoT Gateway is disconnected. Showing cached data.
          </Text>
        </View>
      )}

      {/* Device error banner */}
      {deviceError && (
        <View style={styles.bannerError}>
          <Ionicons name="alert-circle-outline" size={18} color={Colors.danger} />
          <Text style={styles.bannerErrorText}>{deviceError}</Text>
          <TouchableOpacity onPress={clearDeviceError}>
            <Ionicons name="close-circle-outline" size={20} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      )}

      {/* Summary row */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryValue}>{devices.length}</Text>
          <Text style={styles.summaryLabel}>Total Devices</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: Colors.success }]}>{activeCount}</Text>
          <Text style={styles.summaryLabel}>Active</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={[styles.summaryValue, { color: Colors.danger }]}>
            {devices.length - activeCount}
          </Text>
          <Text style={styles.summaryLabel}>Inactive</Text>
        </View>
      </View>

      {/* Sensor cards */}
      <Text style={styles.sectionTitle}>Live Sensors</Text>
      <View style={styles.sensorRow}>
        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Ionicons name="thermometer-outline" size={20} color={Colors.text} />
            <Text style={styles.sensorLabel}>Temperature</Text>
          </View>
          <Text style={styles.sensorValue}>{sensors.temperature}°C</Text>
        </View>

        <View style={styles.sensorCard}>
          <View style={styles.sensorHeader}>
            <Ionicons name="water-outline" size={20} color={Colors.text} />
            <Text style={styles.sensorLabel}>Humidity</Text>
          </View>
          <Text style={styles.sensorValue}>{sensors.humidity}%</Text>
        </View>
      </View>

      <View style={styles.sensorCardFull}>
        <View style={styles.sensorHeader}>
          <Ionicons name="sunny-outline" size={20} color={Colors.text} />
          <Text style={styles.sensorLabel}>Light Level</Text>
        </View>
        <Text style={styles.sensorValue}>{sensors.lightLevel} lux</Text>
      </View>

      {/* Device status */}
      <Text style={styles.sectionTitle}>Device Status</Text>

      {isDevicesLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading devices...</Text>
        </View>
      ) : (
        devices.map((device) => {
          const isUpdating = updatingDeviceId === device.id;
          const isSwitchDisabled = !isGatewayConnected || updatingDeviceId !== null;

          return (
            <View key={device.id} style={styles.deviceCard}>
              <View style={styles.deviceInfo}>
                <View style={[styles.iconBg, device.status && styles.iconBgActive]}>
                  <Ionicons
                    name={device.icon}
                    size={24}
                    color={device.status ? Colors.primary : Colors.textMuted}
                  />
                </View>
                <View>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceType}>
                    {device.type} •{' '}
                    <Text
                      style={{
                        color: isUpdating
                          ? Colors.warning
                          : device.status
                          ? Colors.success
                          : Colors.danger,
                      }}
                    >
                      {isUpdating ? 'Updating...' : device.status ? 'ON' : 'OFF'}
                    </Text>
                  </Text>
                </View>
              </View>

              <Switch
                value={device.status}
                disabled={isSwitchDisabled}
                onValueChange={(value) => toggleDevice(device.id, value)}
              />
            </View>
          );
        })
      )}

      {/* Refresh devices */}
      <TouchableOpacity
        style={[styles.refreshButton, isDevicesLoading && styles.refreshButtonDisabled]}
        onPress={fetchDevices}
        disabled={isDevicesLoading}
      >
        <Ionicons name="refresh-outline" size={18} color={Colors.textLight} style={{ marginRight: 8 }} />
        <Text style={styles.refreshButtonText}>Refresh Devices</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  greeting: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 4,
    marginBottom: 16,
  },
  bannerWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.warningBg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  bannerWarningText: {
    color: Colors.warning,
    fontSize: 13,
    flex: 1,
    fontWeight: '600',
  },
  bannerError: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.dangerBg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  bannerErrorText: {
    color: Colors.danger,
    fontSize: 13,
    flex: 1,
    fontWeight: '600',
  },
  summaryRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
  },
  summaryLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
  },
  sensorRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  sensorCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.card,
  },
  sensorCardFull: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: Colors.card,
    marginBottom: 24,
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sensorLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  sensorValue: {
    fontSize: 26,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 8,
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
    color: Colors.textMuted,
  },
  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.card,
    marginBottom: 12,
  },
  deviceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBg: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconBgActive: {
    backgroundColor: Colors.cardActive,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  deviceType: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  refreshButton: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  refreshButtonText: {
    color: Colors.textLight,
    fontSize: 15,
    fontWeight: 'bold',
  },
});