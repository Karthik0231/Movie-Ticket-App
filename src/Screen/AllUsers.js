import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  StatusBar,
  ScrollView,
  Animated,
} from 'react-native';
import NfcManager, { NfcEvents } from 'react-native-nfc-manager';
import { useTheme } from 'react-native-paper';
import { AuthContext } from '../Context/Context';
import Header from './Component/Header';

NfcManager.start();

const UsersScreen = () => {
  const {
    allUsers,
    getAllUsers,
    deleteUser,
    AddUser,
    updateUser,
    assignCard,
    toggleCardStatus,
    rechargeWallet, signOut 
  } = useContext(AuthContext);
  const { colors } = useTheme();

  // Form states
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cardId: '',
  });
  const [scanning, setScanning] = useState(false);

  // FAB menu states
  const [fabOpen, setFabOpen] = useState(false);
  const [fabAnimation] = useState(new Animated.Value(0));

  // Modal states
  const [showCardAssignModal, setShowCardAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [tempCardId, setTempCardId] = useState('');
  const [rechargeAmount, setRechargeAmount] = useState('');

  useEffect(() => {
    getAllUsers();

    return () => {
      NfcManager.unregisterTagEvent().catch(() => {});
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    };
  }, []);

  // Toggle FAB menu
  const toggleFab = () => {
    const toValue = fabOpen ? 0 : 1;
    Animated.spring(fabAnimation, {
      toValue,
      friction: 5,
      useNativeDriver: true,
    }).start();
    setFabOpen(!fabOpen);
  };

  // NFC Functions
  const startNfcScan = async (isForCardAssign = false) => {
    try {
      setScanning(true);
      NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
        if (tag?.id) {
          if (isForCardAssign) {
            setTempCardId(tag.id);
          } else {
            setFormData(prev => ({ ...prev, cardId: tag.id }));
          }
          Alert.alert('NFC Card Detected', `Card ID: ${tag.id}`);
          stopNfcScan();
        }
      });
      await NfcManager.registerTagEvent();
    } catch (err) {
      Alert.alert('NFC Error', 'Failed to start scanning: ' + err.message);
      setScanning(false);
    }
  };

  const stopNfcScan = () => {
    NfcManager.unregisterTagEvent()
      .catch(() => {})
      .finally(() => {
        NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
        setScanning(false);
      });
  };

  // Form handlers
  const openAddForm = () => {
    setCurrentUser(null);
    setFormData({ name: '', email: '', phone: '', cardId: '' });
    setShowForm(true);
  };

  const openEditForm = (user) => {
    setCurrentUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      cardId: user.cardId || '',
    });
    setShowForm(true);
  };

  const handleFormSubmit = async () => {
    if (!formData.name || !formData.phone) {
      Alert.alert('Validation Error', 'Name and Phone are required');
      return;
    }

    let res;
    if (currentUser) {
      res = await updateUser(currentUser._id, formData);
    } else {
      res = await AddUser(formData);
    }

    if (res?.success) {
      setShowForm(false);
      setFormData({ name: '', email: '', phone: '', cardId: '' });
    } else {
      Alert.alert('Error', res?.message || 'Failed to save user');
    }
  };

  const handleDelete = (userId) => {
    Alert.alert('Delete User?', 'This action cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteUser(userId);
        },
      },
    ]);
  };

  // Card assignment handler
  const handleAssignCard = async () => {
    if (!tempCardId) {
      Alert.alert('Error', 'Please scan an NFC card first');
      return;
    }

    const res = await assignCard(selectedUserId, tempCardId);
    if (res?.success) {
      setShowCardAssignModal(false);
      setTempCardId('');
      setSelectedUserId(null);
    } else {
      Alert.alert('Error', res?.message || 'Failed to assign card');
    }
  };

  // Status toggle handler
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = !currentStatus;
    const res = await toggleCardStatus(userId, newStatus);
    if (!res?.success) {
      Alert.alert('Error', res?.message || 'Failed to update status');
    }
  };

  // Recharge handler
  const handleRecharge = async () => {
    const amount = parseFloat(rechargeAmount);
    if (!amount || amount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    const res = await rechargeWallet(selectedUserId, amount);
    if (res?.success) {
      setShowRechargeModal(false);
      setRechargeAmount('');
      setSelectedUserId(null);
    } else {
      Alert.alert('Error', res?.message || 'Failed to recharge wallet');
    }
  };

  // Open action modals
  const openCardAssignModal = (userId) => {
    setSelectedUserId(userId);
    setTempCardId('');
    setShowCardAssignModal(true);
  };

  const openRechargeModal = (userId) => {
    setSelectedUserId(userId);
    setRechargeAmount('');
    setShowRechargeModal(true);
  };

  // FAB Menu Animations
  const fabRotation = fabAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '45deg'],
  });

  const action1Style = {
    transform: [
      { scale: fabAnimation },
      {
        translateY: fabAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -70],
        }),
      },
    ],
  };

  const action2Style = {
    transform: [
      { scale: fabAnimation },
      {
        translateY: fabAnimation.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -140],
        }),
      },
    ],
  };

  // Memoized input change handlers
  const handleNameChange = useCallback((text) => {
    setFormData(prev => ({ ...prev, name: text }));
  }, []);

  const handleEmailChange = useCallback((text) => {
    setFormData(prev => ({ ...prev, email: text }));
  }, []);

  const handlePhoneChange = useCallback((text) => {
    setFormData(prev => ({ ...prev, phone: text }));
  }, []);

  // User Form Modal
  const UserFormModal = React.memo(() => (
    <Modal visible={showForm} animationType="slide" transparent>
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View className="w-full rounded-2xl p-6 max-h-[80%]" style={{ backgroundColor: colors.background_paper }}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text className="text-2xl font-bold mb-6 text-center" style={{ color: colors.primary_main }}>
              {currentUser ? 'Edit User' : 'Add User'}
            </Text>

            <TextInput
              placeholder="Name *"
              placeholderTextColor="#A1A1A1"
              value={formData.name}
              onChangeText={handleNameChange}
              className="mb-4 p-3 rounded-xl"
              style={{ backgroundColor: colors.background_neutral, color: colors.text_primary }}
            />

            <TextInput
              placeholder="Email (optional)"
              placeholderTextColor="#A1A1A1"
              value={formData.email}
              onChangeText={handleEmailChange}
              keyboardType="email-address"
              autoCapitalize="none"
              className="mb-4 p-3 rounded-xl"
              style={{ backgroundColor: colors.background_neutral, color: colors.text_primary }}
            />

            <TextInput
              placeholder="Phone *"
              placeholderTextColor="#A1A1A1"
              value={formData.phone}
              onChangeText={handlePhoneChange}
              keyboardType="phone-pad"
              className="mb-4 p-3 rounded-xl"
              style={{ backgroundColor: colors.background_neutral, color: colors.text_primary }}
            />

            <TouchableOpacity
              onPress={() => startNfcScan(false)}
              disabled={scanning}
              className="mb-4 py-3 rounded-xl items-center"
              style={{ backgroundColor: scanning ? '#999999' : colors.primary_main }}
            >
              <Text className="font-semibold" style={{ color: colors.onPrimary }}>
                {scanning ? 'Scanning NFC...' : 'Scan NFC Card (Optional)'}
              </Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Card ID"
              placeholderTextColor="#A1A1A1"
              value={formData.cardId}
              editable={false}
              className="mb-6 p-3 rounded-xl"
              style={{ backgroundColor: colors.background_neutral, color: colors.text_primary }}
            />

            <TouchableOpacity
              onPress={handleFormSubmit}
              className="py-4 rounded-xl items-center mb-4"
              style={{ backgroundColor: colors.primary_main }}
            >
              <Text className="text-lg font-semibold" style={{ color: colors.onPrimary }}>
                {currentUser ? 'Update User' : 'Add User'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowForm(false);
                setFormData({ name: '', email: '', phone: '', cardId: '' });
              }}
              className="items-center"
            >
              <Text className="font-semibold" style={{ color: colors.error_main }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  ));

  const handleRechargeAmountChange = useCallback((text) => {
    setRechargeAmount(text);
  }, []);

  // Card Assignment Modal
  const CardAssignModal = React.memo(() => (
    <Modal visible={showCardAssignModal} animationType="fade" transparent>
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View className="w-full rounded-2xl p-6" style={{ backgroundColor: colors.background_paper }}>
          <Text className="text-xl font-bold mb-6 text-center" style={{ color: colors.primary_main }}>
            Assign NFC Card
          </Text>

          <TouchableOpacity
            onPress={() => startNfcScan(true)}
            disabled={scanning}
            className="mb-4 py-3 rounded-xl items-center"
            style={{ backgroundColor: scanning ? '#999999' : colors.primary_main }}
          >
            <Text className="font-semibold" style={{ color: colors.onPrimary }}>
              {scanning ? 'Scanning...' : 'Scan NFC Card'}
            </Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Card ID"
            placeholderTextColor="#A1A1A1"
            value={tempCardId}
            editable={false}
            className="mb-6 p-3 rounded-xl"
            style={{ backgroundColor: colors.background_neutral, color: colors.text_primary }}
          />

          <TouchableOpacity
            onPress={handleAssignCard}
            className="py-3 rounded-xl items-center mb-3"
            style={{ backgroundColor: colors.primary_main }}
          >
            <Text className="font-semibold" style={{ color: colors.onPrimary }}>
              Assign Card
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowCardAssignModal(false);
              setTempCardId('');
            }}
            className="items-center"
          >
            <Text className="font-semibold" style={{ color: colors.error_main }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  ));

  // Recharge Modal
  const RechargeModal = React.memo(() => (
    <Modal visible={showRechargeModal} animationType="fade" transparent>
      <View className="flex-1 justify-center items-center px-6" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <View className="w-full rounded-2xl p-6" style={{ backgroundColor: colors.background_paper }}>
          <Text className="text-xl font-bold mb-6 text-center" style={{ color: colors.primary_main }}>
            Recharge Wallet
          </Text>

          <TextInput
            placeholder="Amount (₹)"
            placeholderTextColor="#A1A1A1"
            value={rechargeAmount}
            onChangeText={handleRechargeAmountChange}
            keyboardType="numeric"
            className="mb-6 p-3 rounded-xl"
            style={{ backgroundColor: colors.background_neutral, color: colors.text_primary }}
          />

          <TouchableOpacity
            onPress={handleRecharge}
            className="py-3 rounded-xl items-center mb-3"
            style={{ backgroundColor: colors.primary_main }}
          >
            <Text className="font-semibold" style={{ color: colors.onPrimary }}>
              Recharge
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setShowRechargeModal(false);
              setRechargeAmount('');
            }}
            className="items-center"
          >
            <Text className="font-semibold" style={{ color: colors.error_main }}>
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  ));

  // Render user item - memoized
  const renderUserItem = useCallback(({ item }) => (
    <View
      className="rounded-2xl p-4 mb-4"
      style={{
        backgroundColor: colors.background_paper,
        shadowColor: colors.primary_main,
        shadowOpacity: 0.15,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
      }}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-1">
          <Text className="text-xl font-bold mb-1" style={{ color: colors.primary_main }}>
            {item.name}
          </Text>
          <Text className="text-sm mb-1" style={{ color: colors.text_secondary }}>
           Email: {item.email || 'No email'}
          </Text>
          <Text className="text-sm mb-1" style={{ color: colors.text_secondary }}>
              Phone: {item.phone}
          </Text>
          <Text className="text-sm mb-1" style={{ color: colors.text_secondary }}>
            Card: {item.cardId || 'No card assigned'}
          </Text>
          <Text className="text-sm mb-1" style={{ color: colors.text_secondary }}>
            Wallet: ₹{item.walletBalance || 0}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => handleToggleStatus(item._id, item.isActive)}
          className="px-3 py-1 rounded-full"
          style={{
            backgroundColor: item.isActive
              ? `${colors.primary_main}20`
              : `${colors.error_main}20`,
          }}
        >
          <Text
            className="text-xs font-bold"
            style={{ color: item.isActive ? colors.primary_main : colors.error_main }}
          >
            {item.isActive ? 'ACTIVE' : 'INACTIVE'}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-between pt-3 border-t" style={{ borderTopColor: colors.divider }}>
        <TouchableOpacity
          onPress={() => openEditForm(item)}
          className="flex-1 py-2 mr-2 rounded-lg items-center"
          style={{ backgroundColor: `${colors.primary_main}15` }}
        >
          <Text className="font-semibold" style={{ color: colors.primary_main }}>
            Edit
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={() => openCardAssignModal(item._id)}
          className="flex-1 py-2 mx-1 rounded-lg items-center"
          style={{ backgroundColor: `${colors.primary_main}15` }}
        >
          <Text className="font-semibold" style={{ color: colors.primary_main }}>
            Card
          </Text>
        </TouchableOpacity> */}

        <TouchableOpacity
          onPress={() => openRechargeModal(item._id)}
          className="flex-1 py-2 mx-1 rounded-lg items-center"
          style={{ backgroundColor: `${colors.primary_main}15` }}
        >
          <Text className="font-semibold" style={{ color: colors.primary_main }}>
            Wallet
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete(item._id)}
          className="flex-1 py-2 ml-2 rounded-lg items-center"
          style={{ backgroundColor: `${colors.error_main}15` }}
        >
          <Text className="font-semibold" style={{ color: colors.error_main }}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  ), [colors, openEditForm, openCardAssignModal, openRechargeModal, handleDelete, handleToggleStatus]);

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background_default }}>
      <StatusBar
        barStyle={colors.custom === 'darkTheme' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background_default}
      />

      {/* <View className="p-4">
        <Text className="text-2xl font-bold mb-4" style={{ color: colors.text_primary }}>
          Users Management
        </Text>
      </View> */}
      <Header screenName={'Users Management'} onLogoutPress={signOut} />

      <FlatList
        data={allUsers}
        keyExtractor={(item) => item._id}
        renderItem={renderUserItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-lg" style={{ color: colors.text_secondary }}>
              No users found
            </Text>
            <Text className="text-sm mt-2" style={{ color: colors.text_secondary }}>
              Tap + to add a new user
            </Text>
          </View>
        }
      />

      {/* FAB Menu */}
      {fabOpen && (
        <TouchableOpacity
          activeOpacity={1}
          onPress={toggleFab}
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
        />
      )}

      <View className="absolute bottom-28 right-6">
        {/* Action Button 2 - Refresh */}
        <Animated.View style={[action2Style, { position: 'absolute', bottom: 0, right: 0 }]}>
          <TouchableOpacity
            onPress={() => {
              getAllUsers();
              toggleFab();
            }}
            className="w-12 h-12 rounded-full items-center justify-center shadow-lg"
            style={{
              backgroundColor: colors.primary_main,
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 5,
            }}
          >
            <Text className="text-2xl" style={{ color: colors.onPrimary }}>↻</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Action Button 1 - Add User */}
        <Animated.View style={[action1Style, { position: 'absolute', bottom: 0, right: 0 }]}>
          <TouchableOpacity
            onPress={() => {
              openAddForm();
              toggleFab();
            }}
            className="w-12 h-12 rounded-full items-center justify-center shadow-lg"
            style={{
              backgroundColor: colors.primary_main,
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowRadius: 4,
              shadowOffset: { width: 0, height: 2 },
              elevation: 5,
            }}
          >
            <Text className="text-2xl" style={{ color: colors.onPrimary }}>+</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Main FAB */}
        <TouchableOpacity
          onPress={toggleFab}
          className="w-14 h-14 rounded-full items-center justify-center shadow-lg"
          style={{
            backgroundColor: colors.primary_main,
            shadowColor: '#000',
            shadowOpacity: 0.3,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 3 },
            elevation: 8,
          }}
        >
          <Animated.Text
            className="text-3xl"
            style={{ color: colors.onPrimary, transform: [{ rotate: fabRotation }] }}
          >
            +
          </Animated.Text>
        </TouchableOpacity>
      </View>

      {/* Modals */}
      {showForm && <UserFormModal />}
      {showCardAssignModal && <CardAssignModal />}
      {showRechargeModal && <RechargeModal />}
    </View>
  );
};

export default UsersScreen;