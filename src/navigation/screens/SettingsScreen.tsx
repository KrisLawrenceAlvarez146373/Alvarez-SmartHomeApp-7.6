import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useIoT } from '../../context/IoTContext';
import { Colors } from '../../theme/colors';
import { DEFAULT_BASE_URL } from '../../services/IoTService';

export default function SettingsScreen() {
  const {
    isGatewayConnected,
    setGatewayConnected,
    notifications,
    setNotifications,
    autoConnect,
    setAutoConnect,
    darkMode,
    setDarkMode,
    apiBaseUrl,
    setApiBaseUrl,
  } = useIoT();

  const [editingUrl, setEditingUrl] = useState(false);
  const [urlDraft, setUrlDraft] = useState(apiBaseUrl);

  const saveUrl = () => {
    setApiBaseUrl(urlDraft.trim());
    setEditingUrl(false);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.subtitle}>Configure your IoT application</Text>

      {/* ── General ── */}
      <Text style={styles.sectionTitle}>General</Text>

      <View style={styles.settingCard}>
        <View style={styles.settingInfo}>
          <Ionicons name="notifications-outline" size={24} color={Colors.text} />
          <View style={styles.settingText}>
            <Text style={styles.settingName}>Notifications</Text>
            <Text style={styles.settingDescription}>
              Receive alerts from your IoT devices
            </Text>
          </View>
        </View>
        <Switch value={notifications} onValueChange={setNotifications} />
      </View>

      <View style={styles.settingCard}>
        <View style={styles.settingInfo}>
          <Ionicons name="wifi-outline" size={24} color={Colors.text} />
          <View style={styles.settingText}>
            <Text style={styles.settingName}>Auto Connect</Text>
            <Text style={styles.settingDescription}>
              Automatically reconnect to the IoT gateway
            </Text>
          </View>
        </View>
        <Switch value={autoConnect} onValueChange={setAutoConnect} />
      </View>

      <View style={styles.settingCard}>
        <View style={styles.settingInfo}>
          <Ionicons name="moon-outline" size={24} color={Colors.text} />
          <View style={styles.settingText}>
            <Text style={styles.settingName}>Dark Mode</Text>
            <Text style={styles.settingDescription}>
              Use a darker application appearance
            </Text>
          </View>
        </View>
        <Switch value={darkMode} onValueChange={setDarkMode} />
      </View>

      {/* ── Connection ── */}
      <Text style={styles.sectionTitle}>Connection</Text>

      <View style={styles.connectionCard}>
        <View style={styles.connectionInfo}>
          <Ionicons
            name={isGatewayConnected ? 'cloud-done-outline' : 'cloud-offline-outline'}
            size={28}
            color={isGatewayConnected ? Colors.success : Colors.danger}
          />
          <View style={styles.connectionText}>
            <Text style={styles.connectionTitle}>IoT Gateway</Text>
            <Text
              style={[
                styles.connectionStatus,
                { color: isGatewayConnected ? Colors.success : Colors.danger },
              ]}
            >
              {isGatewayConnected ? 'Connected' : 'Disconnected'}
            </Text>
          </View>
        </View>
        <Switch value={isGatewayConnected} onValueChange={setGatewayConnected} />
      </View>

      {/* ── Backend API ── */}
      <Text style={styles.sectionTitle}>Backend API</Text>

      <View style={styles.apiCard}>
        <View style={styles.apiLabelRow}>
          <Ionicons name="server-outline" size={20} color={Colors.text} />
          <Text style={styles.apiLabel}>API Base URL</Text>
        </View>

        {editingUrl ? (
          <View style={styles.apiEditRow}>
            <TextInput
              style={styles.apiInput}
              value={urlDraft}
              onChangeText={setUrlDraft}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="url"
              placeholder={DEFAULT_BASE_URL}
              placeholderTextColor={Colors.border}
            />
            <TouchableOpacity style={styles.saveButton} onPress={saveUrl}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setUrlDraft(apiBaseUrl);
                setEditingUrl(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.apiDisplayRow}>
            <Text style={styles.apiUrl} numberOfLines={1}>
              {apiBaseUrl}
            </Text>
            <TouchableOpacity onPress={() => setEditingUrl(true)} style={styles.editButton}>
              <Ionicons name="pencil-outline" size={16} color={Colors.primary} />
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.apiHint}>
          Point this to your REST backend server. All API calls in{' '}
          <Text style={styles.apiHintMono}>IoTService.tsx</Text> use this base.
          {'\n'}On Android emulator, the default is <Text style={styles.apiHintMono}>10.0.2.2</Text>.
        </Text>
      </View>

      {/* ── App Info ── */}
      <Text style={styles.sectionTitle}>App Info</Text>

      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>App Name</Text>
          <Text style={styles.infoValue}>IoT Home</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Version</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Platform</Text>
          <Text style={styles.infoValue}>Expo / React Native</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.infoRow}>
          <Text style={styles.infoKey}>Author</Text>
          <Text style={styles.infoValue}>Alvarez</Text>
        </View>
      </View>
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
    marginBottom: 24,
    color: Colors.textMuted,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 12,
    marginTop: 8,
  },
  settingCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.card,
    marginBottom: 10,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 14,
    flex: 1,
  },
  settingName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  settingDescription: {
    fontSize: 11,
    marginTop: 3,
    color: Colors.textMuted,
  },
  connectionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colors.card,
    marginBottom: 20,
  },
  connectionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  connectionText: {
    marginLeft: 14,
  },
  connectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  connectionStatus: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: '600',
  },
  apiCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  apiLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  apiLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  apiDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.borderLight,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  apiUrl: {
    fontSize: 13,
    color: Colors.textMuted,
    flex: 1,
    fontFamily: 'monospace',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingLeft: 10,
  },
  editButtonText: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  apiEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  apiInput: {
    flex: 1,
    backgroundColor: Colors.borderLight,
    borderRadius: 8,
    padding: 10,
    fontSize: 13,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: Colors.textLight,
    fontSize: 13,
    fontWeight: 'bold',
  },
  cancelButton: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  cancelButtonText: {
    color: Colors.textMuted,
    fontSize: 13,
  },
  apiHint: {
    fontSize: 11,
    color: Colors.textMuted,
    lineHeight: 16,
  },
  apiHintMono: {
    fontFamily: 'monospace',
    color: Colors.text,
  },
  infoCard: {
    backgroundColor: Colors.card,
    borderRadius: 14,
    overflow: 'hidden',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
  },
  infoKey: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 14,
  },
});