import React from 'react';
import { View, Text, FlatList, TouchableOpacity, Image } from 'react-native';
import { useTheme } from 'react-native-paper';

const ShowList = ({ shows, onShowSelect }) => {
  const { colors } = useTheme();

  return (
    <FlatList
      data={shows}
      keyExtractor={item => item._id}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => onShowSelect(item)}
          className="flex-row items-center p-4 my-2 rounded-xl shadow-md"
          style={{ backgroundColor: colors.background_paper, shadowColor: colors.primary_main, shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 5 }}
        >
          {item.image ? (
            <Image source={{ uri: item.image }} style={{ width: 70, height: 70, borderRadius: 10, marginRight: 16 }} />
          ) : (
            <View style={{ width: 70, height: 70, borderRadius: 10, backgroundColor: '#ccc', marginRight: 16, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: '#666' }}>No Image</Text>
            </View>
          )}
          <View>
            <Text style={{ color: colors.primary_main, fontSize: 18, fontWeight: '700' }}>{item.name}</Text>
            <Text style={{ color: colors.text_secondary }}>
              ₹{item.price}
            </Text>
            <Text style={{ color: item.isActive ? colors.primary_main : colors.error_main, fontWeight:'600' }}>
              {item.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

export default ShowList;
