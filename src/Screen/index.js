import { View, Text, TouchableOpacity } from "react-native";

export default function HomeScreen() {
  return (
    <View className="flex-1 bg-black items-center justify-center p-5">
      
      <Text className="text-3xl text-white font-bold mb-10">
        🎟️ Movie Ticket Booking
      </Text>

      <TouchableOpacity className="w-4/5 p-4 bg-red-600 rounded-xl mb-4">
        <Text className="text-white text-lg font-semibold text-center">
          View Shows
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="w-4/5 p-4 bg-red-600 rounded-xl mb-4">
        <Text className="text-white text-lg font-semibold text-center">
          My Bookings
        </Text>
      </TouchableOpacity>

      <TouchableOpacity className="w-4/5 p-4 bg-gray-700 rounded-xl mt-4">
        <Text className="text-white text-lg font-semibold text-center">
          Admin Login
        </Text>
      </TouchableOpacity>
    </View>
  );
}
