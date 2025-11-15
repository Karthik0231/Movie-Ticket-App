import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useTheme } from 'react-native-paper';

const TicketPurchaseModal = ({ visible, onDismiss, user, show, onPurchaseSuccess, purchaseTickets }) => {
  const { colors } = useTheme();
  const [quantity, setQuantity] = useState('1');
  const maxTickets = show && user ? Math.floor(user.walletBalance / show.price) : 0;

  useEffect(() => {
    setQuantity('1');
  }, [visible]);

  const handlePurchase = async () => {
    const numTickets = parseInt(quantity);
    if (isNaN(numTickets) || numTickets <= 0) {
      Alert.alert('Invalid quantity', 'Please enter a valid ticket quantity');
      return;
    }
    if (numTickets > maxTickets) {
      Alert.alert('Insufficient balance', `You can buy up to ${maxTickets} tickets`);
      return;
    }
    const res = await purchaseTickets(user._id, show._id, numTickets);
    if (res.success) {
      Alert.alert('Success', `Purchased ${numTickets} ticket${numTickets > 1 ? 's' : ''}`);
      onPurchaseSuccess();
    } else {
      Alert.alert('Error', res.message || 'Purchase failed');
    }
  };

  if (!show || !user) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-5">
        <View className="w-full rounded-2xl p-5 bg-white max-h-[80%]">
          <Text className="text-xl font-bold mb-4" style={{ color: colors.primary_main }}>
            Purchase Tickets for {show.name}
          </Text>
          <Text style={{ marginBottom: 16, color: colors.text_secondary }}>
            Available Balance: ₹{user.walletBalance.toFixed(2)}
          </Text>
          <TextInput
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            placeholder={`Number of tickets (max ${maxTickets})`}
            placeholderTextColor="#A1A1A1"
            className="mb-6 p-3 rounded-xl border"
            style={{ borderColor: colors.divider, color: colors.text_primary }}
          />
          <TouchableOpacity
            onPress={handlePurchase}
            className="py-3 rounded-xl items-center mb-3"
            style={{ backgroundColor: colors.primary_main }}
          >
            <Text className="text-white font-semibold">Confirm Purchase</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onDismiss} className="items-center">
            <Text className="text-error_main font-semibold">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default TicketPurchaseModal;
