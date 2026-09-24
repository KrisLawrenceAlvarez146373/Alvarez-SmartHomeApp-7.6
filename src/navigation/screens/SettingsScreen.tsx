import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [autoConnect, setAutoConnect] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const { isGatewayConnected, setGatewayConnected } = useIoT();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Configure your IoT application</Text>

      <Text style={styles.sectionTitle}>General</Text>

      <View style={styles.settingCard}>
        <View style={styles.settingInfo}>
          <Ionicons name="notifications-outline" size={26} />
          <View style={styles.settingText}>
            <Text style={styles.settingName}>Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive alerts from your IoT devices
            </Text>
          </View>
        </View>
        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />
      </View>

      <View style={styles.settingCard}>
        <View style={styles.settingInfo}>
          <Ionicons name="wifi-outline" size={26} />
          <View style={styles.settingText}>
            <Text style={styles.settingName}>Auto Connect</Text>
            <Text style={styles.settingDescription}>
              Automatically connect to the IoT gateway
            </Text>
          </View>
        </View>
        <Switch
          value={autoConnect}
          onValueChange={setAutoConnect}
        />
      </View>

      <View style={styles.settingCard}>
        <View style={styles.settingInfo}>
          <Ionicons name="moon-outline" size={26} />
          <View style={styles.settingText}>
            <Text style={styles.settingName}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Use a darker application appearance
            </Text>
          </View>
        </View>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
        />
      </View>

      <Text style={styles.sectionTitle}>Connection</Text>

      <View style={styles.connectionCard}>
        <View style={styles.connectionInfo}>
          <Ionicons
            name={isGatewayConnected ? 'cloud-done-outline' : 'cloud-offline-outline'}
            size={30}
            color={isGatewayConnected ? '#16a34a' : '#dc2626'}
          />
          <View style={styles.connectionText}>
            <Text style={styles.connectionTitle}>IoT Gateway</Text>
            <Text
              style={[
                styles.connectionStatus,
                { color: isGatewayConnected ? '#16a34a' : '#dc2626' },
              ]}
            >
              {isGatewayConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>
        <Switch
          value={isGatewayConnected}
          onValueChange={setGatewayConnected}
        />
      </View>
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
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    marginTop: 10,
  },
  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
    marginBottom: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 15,
    flex: 1,
  },
  settingName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  connectionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 18,
    borderRadius: 15,
    backgroundColor: '#eeeeee',
  },
  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  connectionText: {
    marginLeft: 15,
  },
  connectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  connectionStatus: {
    fontSize: 13,
    marginTop: 3,
    fontWeight: '600',
  },
});