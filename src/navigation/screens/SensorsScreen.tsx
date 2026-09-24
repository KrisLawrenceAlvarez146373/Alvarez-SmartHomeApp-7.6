import React from 'react';
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

export default function SensorsScreen() {
  const {
    sensors,
    refreshSensors,
    isSensorsLoading,
    sensorError,
  } = useIoT();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Sensors</Text>
      <Text style={styles.subtitle}>Monitor your environment</Text>

      {sensorError && (
        <View style={styles.bannerError}>
          <Ionicons name="alert-circle-outline" size={20} color="#b91c1c" />
          <Text style={styles.bannerErrorText}>{sensorError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshSensors}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <Ionicons name="thermometer-outline" size={30} />
          <Text style={styles.sensorName}>Temperature</Text>
        </View>
        <Text style={styles.sensorValue}>{sensors.temperature}°C</Text>
        <Text style={styles.sensorDescription}>Current room temperature</Text>
      </View>

      <View style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <Ionicons name="water-outline" size={30} />
          <Text style={styles.sensorName}>Humidity</Text>
        </View>
        <Text style={styles.sensorValue}>{sensors.humidity}%</Text>
        <Text style={styles.sensorDescription}>Current relative humidity</Text>
      </View>

      <View style={styles.sensorCard}>
        <View style={styles.sensorHeader}>
          <Ionicons name="sunny-outline" size={30} />
          <Text style={styles.sensorName}>Light Level</Text>
        </View>
        <Text style={styles.sensorValue}>{sensors.lightLevel} lux</Text>
        <Text style={styles.sensorDescription}>Current ambient light</Text>
      </View>

      <TouchableOpacity
        style={[styles.refreshButton, isSensorsLoading && styles.refreshButtonDisabled]}
        onPress={refreshSensors}
        disabled={isSensorsLoading}
      >
        {isSensorsLoading ? (
          <View style={styles.loadingRow}>
            <ActivityIndicator size="small" color="#ffffff" />
            <Text style={styles.refreshButtonText}>Refreshing Sensors...</Text>
          </View>
        ) : (
          <Text style={styles.refreshButtonText}>Refresh Sensors</Text>
        )}
      </TouchableOpacity>
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
  sensorCard: {
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 15,
  },
  sensorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sensorName: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  sensorValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 20,
  },
  sensorDescription: {
    fontSize: 13,
    marginTop: 5,
  },
  refreshButton: {
    backgroundColor: '#111827',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 40,
  },
  refreshButtonDisabled: {
    opacity: 0.7,
  },
  refreshButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
});