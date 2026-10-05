import React, { useEffect } from 'react';
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
import { Colors } from '../../theme/colors';

export default function DevicesScreen() {
  const {
    devices,
    toggleDevice,
    updatingDeviceId,
    isGatewayConnected,
    isDevicesLoading,
    deviceError,
    fetchDevices,
    clearDeviceError,
  } = useIoT();

  useEffect(() => {
    fetchDevices();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Devices</Text>
      <Text style={styles.subtitle}>Control your connected devices</Text>

      {/* Gateway disconnected banner */}
      {!isGatewayConnected && (
        <View style={styles.bannerWarning}>
          <Ionicons name="warning-outline" size={20} color={Colors.warning} />
          <Text style={styles.bannerWarningText}>
            IoT Gateway is disconnected. Controls are disabled.
          </Text>
        </View>
      )}

      {/* Device error banner with dismiss */}
      {deviceError && (
        <View style={styles.bannerError}>
          <Ionicons name="alert-circle-outline" size={20} color={Colors.danger} />
          <Text style={styles.bannerErrorText}>{deviceError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchDevices}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearDeviceError} style={styles.dismissButton}>
            <Ionicons name="close-outline" size={18} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      )}

      {/* Refresh button */}
      <TouchableOpacity
        style={[styles.refreshButton, isDevicesLoading && styles.refreshButtonDisabled]}
        onPress={fetchDevices}
        disabled={isDevicesLoading}
      >
        {isDevicesLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={Colors.textLight} />
            <Text style={styles.refreshButtonText}>Loading Devices...</Text>
          </View>
        ) : (
          <View style={styles.loadingRow}>
            <Ionicons name="refresh-outline" size={16} color={Colors.textLight} />
            <Text style={styles.refreshButtonText}>Refresh Devices</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Device list */}
      {isDevicesLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Fetching devices from gateway...</Text>
        </View>
      ) : devices.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="hardware-chip-outline" size={48} color={Colors.textMuted} />
          <Text style={styles.emptyStateText}>No devices found.</Text>
          <Text style={styles.emptyStateSubtext}>
            Check your gateway connection and try refreshing.
          </Text>
        </View>
      ) : (
        devices.map((device) => {
          const isUpdating = updatingDeviceId === device.id;
          const isSwitchDisabled = !isGatewayConnected || updatingDeviceId !== null;

          return (
            <View key={device.id} style={styles.deviceCard}>
              <View style={styles.deviceInfo}>
                <View style={[styles.iconContainer, device.status && styles.iconContainerActive]}>
                  <Ionicons
                    name={device.icon}
                    size={26}
                    color={device.status ? Colors.primary : Colors.textMuted}
                  />
                </View>

                <View style={styles.deviceDetails}>
                  <Text style={styles.deviceName}>{device.name}</Text>
                  <Text style={styles.deviceType}>{device.type}</Text>
                  <Text
                    style={[
                      styles.deviceState,
                      {
                        color: isUpdating
                          ? Colors.warning
                          : device.status
                          ? Colors.success
                          : Colors.danger,
                      },
                    ]}
                  >
                    {isUpdating ? '● Updating...' : device.status ? '● ON' : '● OFF'}
                  </Text>
                </View>
              </View>

              {isUpdating ? (
                <ActivityIndicator size="small" color={Colors.primary} />
              ) : (
                <Switch
                  value={device.status}
                  disabled={isSwitchDisabled}
                  onValueChange={(value) => toggleDevice(device.id, value)}
                />
              )}
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
    backgroundColor: Colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 20,
    color: Colors.textMuted,
  },
  bannerWarning: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.warningBg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
  },
  bannerWarningText: {
    color: Colors.warning,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  bannerError: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dangerBg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 14,
    gap: 6,
  },
  bannerErrorText: {
    color: Colors.danger,
    fontSize: 13,
    flex: 1,
    marginLeft: 4,
  },
  retryButton: {
    backgroundColor: Colors.danger,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.textLight,
    fontSize: 12,
    fontWeight: 'bold',
  },
  dismissButton: {
    padding: 2,
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  refreshButtonText: {
    color: Colors.textLight,
    fontSize: 14,
    fontWeight: 'bold',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    gap: 8,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  emptyStateSubtext: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
  },
  deviceCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 15,
    backgroundColor: Colors.card,
    marginBottom: 14,
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
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconContainerActive: {
    backgroundColor: Colors.cardActive,
  },
  deviceDetails: {
    flex: 1,
  },
  deviceName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colors.text,
  },
  deviceType: {
    fontSize: 12,
    marginTop: 2,
    color: Colors.textMuted,
  },
  deviceState: {
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
});