import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function GameSelect() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-[#181A20] justify-center items-center relative">
      <View className="flex-row justify-center items-center space-x-8">
        {/* Bhabhi Thulla Card */}
        <TouchableOpacity className="w-40 h-44 bg-yellow-400/90 border-4 mr-20 border-yellow-500 rounded-2xl shadow-2xl flex justify-center items-center relative" onPress={() => router.push("/(lobby)/game-settings")}> 
          {/* Replace with actual image if available */}
          <Text className="text-lg font-extrabold text-[#4B3200] mt-2">BHABHI</Text>
          <Text className="text-lg font-extrabold text-[#4B3200] -mt-2">THULLA</Text>
          <TouchableOpacity className="absolute bottom-2 right-2 bg-black/40 rounded-full p-1">
            <Ionicons name="information-circle" size={18} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
        {/* Dacait Dacaiti Card */}
        <View className="w-40 h-44 bg-[#222c] border-4 mr-20 border-gray-400 rounded-2xl shadow-2xl flex justify-center items-center opacity-60 relative">
          <Text className="text-lg font-extrabold text-white mt-8">DACAIT</Text>
          <Text className="text-lg font-extrabold text-white -mt-2">DACAITI</Text>
          <View className="absolute inset-0 bg-black/60 rounded-2xl flex justify-center items-center">
            <Text className="text-white text-lg font-bold">Coming soon...</Text>
          </View>
        </View>
        {/* Teen Patti Card */}
        <View className="w-40 h-44 bg-orange-300/90 border-4 border-orange-400 rounded-2xl shadow-2xl flex justify-center items-center opacity-60 relative">
          <Text className="text-lg font-extrabold text-white mt-8">TEEN</Text>
          <Text className="text-lg font-extrabold text-white -mt-2">PATTI</Text>
          <View className="absolute inset-0 bg-black/60 rounded-2xl flex justify-center items-center">
            <Text className="text-white text-lg font-bold">Coming soon...</Text>
          </View>
        </View>
      </View>
      {/* Back Button */}
      <TouchableOpacity className="absolute bottom-8 left-8 bg-yellow-400 rounded-xl px-6 py-3 shadow-lg z-50" onPress={() => router.back()}>
        <Text className="text-[#222] font-bold text-lg">Back</Text>
      </TouchableOpacity>
    </View>
  );
} 