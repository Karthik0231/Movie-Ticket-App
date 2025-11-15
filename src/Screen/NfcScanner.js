import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ActivityIndicator } from 'react-native';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import LottieView from 'lottie-react-native';

NfcManager.start();

const NFCScanner = ({ onCardScanned }) => {
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    startScan();

    return () => {
      NfcManager.unregisterTagEvent().catch(() => {});
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    };
  }, []);

  const startScan = async () => {
    try {
      setScanning(true);
      NfcManager.setEventListener(NfcEvents.DiscoverTag, tag => {
        if (tag?.id) {
          onCardScanned(tag.id);
          Alert.alert('NFC Card Detected', `Card ID: ${tag.id}`);
          stopScan();
        }
      });
      await NfcManager.registerTagEvent();
    } catch (ex) {
      Alert.alert('NFC Scan error', ex.message);
      setScanning(false);
    }
  };

  const stopScan = () => {
    NfcManager.unregisterTagEvent()
      .catch(() => {})
      .finally(() => {
        NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
        setScanning(false);
      });
  };

  return (
    <View className="items-center py-6">
      <LottieView
        source={require('../../assets/lottie-scan.json')}
        autoPlay
        loop
        style={{ width: 120, height: 120 }}
      />
      <Text className="text-center mt-3 text-primary_main" style={{ fontWeight: '600' }}>
        {scanning ? 'Scanning NFC card...' : 'Tap NFC card to scan'}
      </Text>
      {scanning && <ActivityIndicator size="small" color="#0A84FF" />}
    </View>
  );
};

export default NFCScanner;
