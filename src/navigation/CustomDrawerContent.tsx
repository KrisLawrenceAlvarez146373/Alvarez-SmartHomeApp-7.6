import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../context/IoTContext';
import { Colors } from '../theme/colors';

export default function CustomDrawerContent(props: any) {
  const { isGatewayConnected } = useIoT();

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Ionicons
            name="hardware-chip-outline"
            size={40}
            color={Colors.primary}
          />
        </View>

        <Text style={styles.title}>IoT Home</Text>
        <Text style={styles.subtitle}>Smart Environment</Text>

        {/* Gateway status badge */}
        <View style={[
          styles.statusBadge,
          isGatewayConnected ? styles.statusBadgeConnected : styles.statusBadgeDisconnected,
        ]}>
          <Ionicons
            name={isGatewayConnected ? 'cloud-done-outline' : 'cloud-offline-outline'}
            size={13}
            color={isGatewayConnected ? Colors.success : Colors.danger}
          />
          <Text style={[
            styles.statusBadgeText,
            { color: isGatewayConnected ? Colors.success : Colors.danger },
          ]}>
            {isGatewayConnected ? 'Gateway Connected' : 'Gateway Disconnected'}
          </Text>
        </View>
      </View>

      {/* Nav items */}
      <View style={styles.menu}>
        <DrawerItemList {...props} />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>IoT Home v1.0.0</Text>
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingBottom: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: 8,
  },
  logoContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 3,
    marginBottom: 10,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeConnected: {
    backgroundColor: Colors.successBg,
  },
  statusBadgeDisconnected: {
    backgroundColor: Colors.dangerBg,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  menu: {
    flex: 1,
    paddingTop: 4,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});