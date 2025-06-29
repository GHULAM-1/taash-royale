import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useRouter } from "expo-router";

export default function GameSettings() {
  const router = useRouter();
  const [players, setPlayers] = useState(3);
  const [tableType, setTableType] = useState<'public' | 'private'>('private');
  const minPlayers = 3;
  const maxPlayers = 6;
  
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 400;
  const isMediumScreen = screenWidth >= 400 && screenWidth < 600;

  const handleContinue = () => {
    if (tableType === 'private') {
      router.push('/(lobby)/private-table');
    } else {
      // handle public table navigation
    }
  };

  return (
    <View className="flex-1 bg-[#181A20] justify-center items-center">
      <ScrollView 
        className="flex-1 w-full" 
        contentContainerStyle={{ 
          flexGrow: 1, 
          justifyContent: 'center', 
          alignItems: 'center',
          paddingVertical: 20
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className={`${isSmallScreen ? 'w-[92%]' : isMediumScreen ? 'w-[85%]' : 'w-[80%]'} max-w-md bg-[#23242a] bg-opacity-95 rounded-2xl shadow-2xl ${isSmallScreen ? 'p-4' : 'p-6'} items-center`}>
          <Text className={`${isSmallScreen ? 'text-2xl' : 'text-3xl'} font-extrabold text-white text-center drop-shadow-lg mb-4`} 
                 style={{textShadowColor:'#000',textShadowOffset:{width:2,height:2},textShadowRadius:4}}>
            Game Settings
          </Text>
          
          {/* Players */}
          <View className="w-full mb-4">
            <Text className={`${isSmallScreen ? 'text-base' : 'text-lg'} font-bold text-white mb-2`}>Players</Text>
            <Text className="text-xs text-gray-300 mb-2">Max Players: {maxPlayers}</Text>
            <View className="flex-row items-center bg-[#181A20] rounded-xl px-3 py-2">
              <Text className={`flex-1 ${isSmallScreen ? 'text-xl' : 'text-2xl'} text-white font-bold text-center`}>{players}</Text>
              <TouchableOpacity
                className="bg-yellow-400 rounded-xl px-3 py-2 mx-1"
                onPress={() => setPlayers(Math.max(players - 1, minPlayers))}
              >
                <Text className="text-black text-xl font-bold">-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="bg-yellow-400 rounded-xl px-3 py-2 mx-1"
                onPress={() => setPlayers(Math.min(players + 1, maxPlayers))}
              >
                <Text className="text-black text-xl font-bold">+</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Game Type */}
          <View className="w-full mb-6">
            <Text className={`${isSmallScreen ? 'text-base' : 'text-lg'} font-bold text-white mb-2`}>Game Type</Text>
            <View className={`flex-row w-full ${isSmallScreen ? 'space-x-2' : 'space-x-4'}`}>
              <TouchableOpacity
                className={`flex-1 rounded-xl px-2 py-4 items-center border-2 ${tableType === 'public' ? 'border-yellow-400 bg-green-700/80' : 'border-transparent bg-green-700/40'}`}
                onPress={() => setTableType('public')}
              >
                <Text className={`${isSmallScreen ? 'text-lg' : 'text-xl'} font-extrabold text-white mb-1`}>Public Table</Text>
                <Text className="text-xs text-white text-center">Play with random players from around the world.</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 rounded-xl px-2 py-4 items-center border-2 ${tableType === 'private' ? 'border-yellow-400 bg-red-900/80' : 'border-transparent bg-red-900/40'}`}
                onPress={() => setTableType('private')}
              >
                <Text className={`${isSmallScreen ? 'text-lg' : 'text-xl'} font-extrabold text-white mb-1`}>Private Table</Text>
                <Text className="text-xs text-white text-center">Share the table code to invite your friends.</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Buttons */}
          <View className="flex-row w-full justify-between">
            <TouchableOpacity 
              className={`bg-yellow-400 rounded-xl ${isSmallScreen ? 'px-6 py-2' : 'px-8 py-3'} shadow-lg`} 
              onPress={() => router.back()}
            >
              <Text className={`text-[#222] font-bold ${isSmallScreen ? 'text-base' : 'text-lg'}`}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className={`bg-yellow-400 rounded-xl ${isSmallScreen ? 'px-6 py-2' : 'px-8 py-3'} shadow-lg`} 
              onPress={handleContinue}
            >
              <Text className={`text-[#222] font-bold ${isSmallScreen ? 'text-base' : 'text-lg'}`}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 