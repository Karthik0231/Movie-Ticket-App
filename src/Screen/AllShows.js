import React, { useContext, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
  Alert,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import { AuthContext } from '../Context/Context';
import { useTheme } from 'react-native-paper';
import * as ImagePicker from 'react-native-image-picker';
import Header from './Component/Header';

const ShowsScreen = () => {
  const { colors } = useTheme();
  const { allShows, AddShow, updateShow, deleteShow, signOut } = useContext(AuthContext);

  const [showFormVisible, setShowFormVisible] = useState(false);
  const [editShow, setEditShow] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [image, setImage] = useState(null);

  const openAddForm = useCallback(() => {
    setEditShow(null);
    setName('');
    setDescription('');
    setPrice('');
    setIsActive(true);
    setImage(null);
    setShowFormVisible(true);
  }, []);

  const openEditForm = useCallback((show) => {
    setEditShow(show);
    setName(show.name);
    setDescription(show.description || '');
    setPrice(show.price?.toString() || '');
    setIsActive(show.isActive ?? true);
    setImage(show.image ? { uri: show.image } : null);
    setShowFormVisible(true);
  }, []);

  const closeForm = useCallback(() => {
    setShowFormVisible(false);
  }, []);

  const pickImage = useCallback(() => {
    ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.7,
      },
      (response) => {
        if (!response.didCancel && !response.errorCode) {
          const asset = response.assets[0];
          setImage({
            uri: asset.uri,
            name: asset.fileName,
            type: asset.type,
          });
        }
      },
    );
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert('Validation', 'Name and price are required');
      return;
    }

    const showData = {
      name: name.trim(),
      description: description.trim(),
      price: price.trim(),
      isActive,
    };

    if (image) {
      showData.image = {
        uri: image.uri,
        name: image.name || 'photo.jpg',
        type: image.type || 'image/jpeg',
      };
    }

    let result;
    if (editShow) {
      result = await updateShow(editShow._id, showData);
    } else {
      result = await AddShow(showData);
    }

    if (result?.success) {
      closeForm();
    } else {
      Alert.alert('Error', result?.message || 'Failed to save show');
    }
  }, [name, description, price, isActive, image, editShow, updateShow, AddShow, closeForm]);

  const handleDelete = useCallback((id) => {
    Alert.alert('Delete Show', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteShow(id),
      },
    ]);
  }, [deleteShow]);

  const renderShowItem = useCallback(
    ({ item }) => (
      <View
        className="rounded-2xl p-4 mb-4 shadow-md"
        style={{
          backgroundColor: colors.background_paper,
          shadowColor: colors.primary_main,
          shadowOpacity: 0.25,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        }}
      >
        <View className="flex-row">
          {item.image ? (
            <Image
              source={{ uri: item.image }}
              className="w-20 h-20 rounded-xl mr-3"
              style={{ resizeMode: 'cover' }}
            />
          ) : (
            <View
              className="w-20 h-20 rounded-xl mr-3 items-center justify-center"
              style={{ backgroundColor: colors.background_neutral }}
            >
              <Text style={{ color: colors.text_secondary, fontSize: 12 }}>No Image</Text>
            </View>
          )}

          <View className="flex-1 pr-3">
            <Text
              className="text-xl font-bold"
              style={{ color: colors.primary_main }}
            >
              {item.name}
            </Text>
            {item.description ? (
              <Text
                className="text-sm mt-1"
                style={{ color: colors.text_secondary }}
                numberOfLines={2}
              >
                {item.description}
              </Text>
            ) : null}
            <Text
              className="text-sm mt-1"
              style={{ color: colors.text_secondary }}
            >
              Price: ₹{item.price}
            </Text>
            <Text
              className="text-sm mt-1 font-semibold"
              style={{
                color: item.isActive ? colors.primary_main : colors.error_main,
              }}
            >
              Status: {item.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>

          <View className="justify-center space-y-2">
            <TouchableOpacity onPress={() => openEditForm(item)} className="px-3 py-1 rounded-lg">
              <Text
                className="font-semibold"
                style={{ color: colors.primary_main }}
              >
                Edit
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item._id)} className="px-3 py-1 rounded-lg">
              <Text
                className="font-semibold"
                style={{ color: colors.error_main }}
              >
                Delete
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    ),
    [colors, openEditForm, handleDelete]
  );

  const inputStyle = useMemo(
    () => ({
      backgroundColor: colors.background_neutral,
      color: colors.text_primary,
    }),
    [colors.background_neutral, colors.text_primary]
  );

  const modalBackgroundStyle = useMemo(
    () => ({
      backgroundColor: colors.background_paper,
      maxHeight: '90%',
    }),
    [colors.background_paper]
  );

  return (
    <View className="flex-1 p-3">
      <StatusBar
        barStyle={colors.custom === 'darkTheme' ? 'light-content' : 'dark-content'}
        backgroundColor={colors.background_default}
      />
      <Header screenName={'Shows Management'} onLogoutPress={signOut} />

      <TouchableOpacity
        onPress={openAddForm}
        className="py-3 rounded-xl items-center mb-4 mt-4"
        style={{ backgroundColor: colors.primary_main }}
      >
        <Text className="text-white text-lg font-bold">Add Show</Text>
      </TouchableOpacity>

      <FlatList
        data={allShows}
        keyExtractor={(item) => item._id}
        renderItem={renderShowItem}
        ListEmptyComponent={
          <View className="items-center justify-center py-20">
            <Text className="text-xl font-bold mb-2" style={{ color: colors.text_primary }}>
              No Shows Yet
            </Text>
            <Text className="text-sm" style={{ color: colors.text_secondary }}>
              Tap "Add Show" to create your first show
            </Text>
          </View>
        }
      />

      {/* Form Modal */}
      <Modal visible={showFormVisible} animationType="slide" transparent>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50 px-6">
          <View className="w-full rounded-2xl p-6" style={modalBackgroundStyle}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text
                className="text-2xl font-bold mb-6"
                style={{ color: colors.primary_main }}
              >
                {editShow ? 'Edit Show' : 'Add Show'}
              </Text>

              <TextInput
                placeholder="Show Name"
                placeholderTextColor="#A1A1A1"
                value={name}
                onChangeText={setName}
                className="mb-4 p-3 rounded-xl"
                style={inputStyle}
              />

              <TextInput
                placeholder="Description (optional)"
                placeholderTextColor="#A1A1A1"
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                className="mb-4 p-3 rounded-xl"
                style={[inputStyle, { minHeight: 80, textAlignVertical: 'top' }]}
              />

              <TextInput
                placeholder="Price"
                placeholderTextColor="#A1A1A1"
                value={price}
                onChangeText={setPrice}
                keyboardType="numeric"
                className="mb-4 p-3 rounded-xl"
                style={inputStyle}
              />

              <View
                className="flex-row justify-between items-center mb-4 p-4 rounded-xl"
                style={{ backgroundColor: colors.background_neutral }}
              >
                <Text
                  className="font-semibold"
                  style={{ color: colors.text_primary }}
                >
                  Active Status
                </Text>
                <TouchableOpacity
                  onPress={() => setIsActive(!isActive)}
                  className="w-12 h-6 rounded-full justify-center"
                  style={{
                    backgroundColor: isActive
                      ? colors.primary_main
                      : colors.error_main,
                  }}
                >
                  <View
                    className="w-5 h-5 rounded-full bg-white absolute"
                    style={{ left: isActive ? 26 : 2 }}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={pickImage}
                className="mb-4 py-3 rounded-xl items-center"
                style={{ backgroundColor: colors.primary_main }}
              >
                <Text className="text-white font-semibold">
                  {image ? 'Change Image' : 'Pick Image'}
                </Text>
              </TouchableOpacity>

              {image && (
                <View className="mb-4 items-center">
                  <Image
                    source={{ uri: image.uri }}
                    className="w-full rounded-xl"
                    style={{ height: 200, resizeMode: 'cover' }}
                  />
                </View>
              )}

              <TouchableOpacity
                onPress={handleSubmit}
                className="py-4 rounded-xl items-center mb-4"
                style={{ backgroundColor: colors.primary_main }}
              >
                <Text className="text-white text-lg font-semibold">
                  {editShow ? 'Update Show' : 'Add Show'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={closeForm} className="items-center">
                <Text
                  className="font-semibold text-base"
                  style={{ color: colors.error_main }}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ShowsScreen;
