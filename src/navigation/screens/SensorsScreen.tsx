import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';
import { Colors } from '../../theme/colors';

type SensorCardProps = {
  icon: keyof typeof Ionicons.glyphMap;
  name: string;
  value: string;
  description: string;
  loading: boolean;
};

function SensorCard({ icon, name, value, description, loading }: SensorCardProps) {
  return (
    <View style={styles.sensorCard}>
      <View style={styles.sensorHeader}>
        <Ionicons name={icon} size={28} color={Colors.text} />
        <Text style={styles.sensorName}>{name}</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="small" color={Colors.primary} style={styles.sensorLoading} />
      ) : (
        <Text style={styles.sensorValue}>{value}</Text>
      )}
      <Text style={styles.sensorDescription}>{description}</Text>
    </View>
  );
}

export default function SensorsScreen() {
  const {
    sensors,
    refreshSensors,
    isSensorsLoading,
    sensorError,
    clearSensorError,
    isGatewayConnected,
  } = useIoT();

  useEffect(() => {
    refreshSensors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Sensors</Text>
      <Text style={styles.subtitle}>Monitor your environment</Text>

      {/* Gateway disconnected banner */}
      {!isGatewayConnected && (
        <View style={styles.bannerWarning}>
          <Ionicons name="warning-outline" size={18} color={Colors.warning} />
          <Text style={styles.bannerWarningText}>
            IoT Gateway is disconnected. Showing cached readings.
          </Text>
        </View>
      )}

      {/* Error banner with dismiss */}
      {sensorError && (
        <View style={styles.bannerError}>
          <Ionicons name="alert-circle-outline" size={20} color={Colors.danger} />
          <Text style={styles.bannerErrorText}>{sensorError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshSensors}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={clearSensorError} style={styles.dismissButton}>
            <Ionicons name="close-outline" size={18} color={Colors.danger} />
          </TouchableOpacity>
        </View>
      )}

      <SensorCard
        icon="thermometer-outline"
        name="Temperature"
        value={`${sensors.temperature}°C`}
        description="Current room temperature"
        loading={isSensorsLoading}
      />

      <SensorCard
        icon="water-outline"
        name="Humidity"
        value={`${sensors.humidity}%`}
        description="Current relative humidity"
        loading={isSensorsLoading}
      />

      <SensorCard
        icon="sunny-outline"
        name="Light Level"
        value={`${sensors.lightLevel} lux`}
        description="Current ambient light level"
        loading={isSensorsLoading}
      />

      <TouchableOpacity
        style={[styles.refreshButton, isSensorsLoading && styles.refreshButtonDisabled]}
        onPress={refreshSensors}
        disabled={isSensorsLoading}
      >
        {isSensorsLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color={Colors.textLight} />
            <Text style={styles.refreshButtonText}>Refreshing Sensors...</Text>
          </View>
        ) : (
          <View style={styles.loadingRow}>
            <Ionicons name="refresh-outline" size={16} color={Colors.textLight} />
            <Text style={styles.refreshButtonText}>Refresh Sensors</Text>
          </View>
        )}
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
  sensorCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: Colors.card,
    marginBottom: 14,
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sensorName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.text,
  },
  sensorValue: {
    fontSize: 34,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 18,
  },
  sensorLoading: {
    marginTop: 18,
    alignSelf: 'flex-start',
  },
  sensorDescription: {
    fontSize: 12,
    marginTop: 6,
    color: Colors.textMuted,
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  refreshButtonDisabled: {
    opacity: 0.6,
  },
  refreshButtonText: {
    color: Colors.textLight,
    fontSize: 15,
    fontWeight: 'bold',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});