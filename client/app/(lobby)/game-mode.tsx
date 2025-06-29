import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";

export default function GameMode() {
  const router = useRouter();
  return (
    <View className="flex-1 bg-[#181A20] justify-center items-center relative">
      <View className="flex-row justify-center items-center space-x-8">
        {/* Join Card */}
        <TouchableOpacity className="w-48 h-56 bg-blue-400/80 mr-20 border-4 border-blue-300 rounded-3xl shadow-2xl flex justify-center items-center" activeOpacity={0.85} onPress={() => router.push("/(lobby)/game-select")}>
          <Text className="text-3xl font-extrabold text-white drop-shadow-lg" style={{textShadowColor:'#000',textShadowOffset:{width:2,height:2},textShadowRadius:4}}>Join</Text>
        </TouchableOpacity>
        {/* Create Card */}
        <TouchableOpacity className="w-48 h-56 bg-orange-300/80 border-4 border-orange-400 rounded-3xl shadow-2xl flex justify-center items-center" activeOpacity={0.85} onPress={() => router.push("/(lobby)/game-select")}>
          <Text className="text-3xl font-extrabold text-white drop-shadow-lg" style={{textShadowColor:'#000',textShadowOffset:{width:2,height:2},textShadowRadius:4}}>Create</Text>
        </TouchableOpacity>
      </View>
      {/* Back Button */}
      <TouchableOpacity className="absolute bottom-8 left-8 bg-yellow-400 rounded-xl px-6 py-3 shadow-lg z-50" onPress={() => router.back()}>
        <Text className="text-[#222] font-bold text-lg">Back</Text>
      </TouchableOpacity>
    </View>
  );
} 