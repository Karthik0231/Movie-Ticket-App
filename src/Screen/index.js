import React, { useState, useEffect, useContext, useCallback } from 'react';
import { View, Text, FlatList, StatusBar } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AuthContext } from '../Context/Context';

import Header from './Component/Header';
import NFCScanner from './NfcScanner';
import ShowList from './ShowList';
import TicketPurchaseModal from './TicketPurchaseModal';

const UsersScreen = () => {
  const { colors } = useTheme();
  const { getUserByCardId, getActiveShows, purchaseTickets, signOut } = useContext(AuthContext);

  const [scannedCardId, setScannedCardId] = useState(null);
  const [user, setUser] = useState(null);
  const [shows, setShows] = useState([]);
  const [selectedShow, setSelectedShow] = useState(null);
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false);

  useEffect(() => {
    async function fetchShows() {
      await getActiveShows();
    }
    fetchShows();
  }, []);

  useEffect(() => {
    async function fetchUser() {
      if (scannedCardId) {
        const res = await getUserByCardId(scannedCardId);
        if (res?.success) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      }
    }
    fetchUser();
  }, [scannedCardId]);

  const onShowSelect = useCallback((show) => {
    setSelectedShow(show);
    setPurchaseModalVisible(true);
  }, []);

  const onPurchaseSuccess = useCallback(() => {
    setPurchaseModalVisible(false);
  }, []);

  return (
    <View className="flex-1 bg-background_default">
      <StatusBar barStyle={colors.custom === 'darkTheme' ? 'light-content' : 'dark-content'} backgroundColor={colors.background_default} />
      <Header screenName="Welcome" Manage={true} />

      <NFCScanner onCardScanned={setScannedCardId} />

      {user ? (
        <View className="p-4">
          <Text style={{ color: colors.text_primary, fontSize: 18, fontWeight: 'bold' }}>
            Hello, {user.name}
          </Text>
          <Text style={{ color: colors.text_secondary, marginBottom: 8 }}>
            Wallet Balance: ₹{user.walletBalance.toFixed(2)}
          </Text>

          <ShowList shows={shows} onShowSelect={onShowSelect} />
        </View>
      ) : (
        <View className="p-4 items-center">
          <Text style={{ color: colors.text_secondary, fontSize: 16 }}>
            Please scan your NFC card to see available shows!
          </Text>
        </View>
      )}

      <TicketPurchaseModal
        visible={purchaseModalVisible}
        onDismiss={() => setPurchaseModalVisible(false)}
        user={user}
        show={selectedShow}
        onPurchaseSuccess={onPurchaseSuccess}
        purchaseTickets={purchaseTickets}
      />
    </View>
  );
};

export default UsersScreen;
