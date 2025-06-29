import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FriendsModal from "./friends-modal";
import { useRouter } from "expo-router";

interface CardProps {
  title: string;
  subtitle: string;
  active?: boolean;
  comingSoon?: boolean;
  onPress?: () => void;
}

const Card = ({
  title,
  subtitle,
  active = false,
  comingSoon = false,
  onPress,
}: CardProps) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper
      className={`relative w-64 h-80 mx-2 rounded-3xl shadow-2xl flex justify-center items-center overflow-hidden border-4 ${
        active
          ? "bg-[#FFE6B0] border-yellow-400"
          : "bg-[#222c] border-gray-400 opacity-60"
      }`}
      {...(onPress ? { onPress, activeOpacity: 0.85 } : {})}
    >
      <Text
        className={`text-2xl font-extrabold text-white drop-shadow-lg text-center mt-8 ${
          active ? "" : "opacity-80"
        }`}
        style={{
          textShadowColor: "#000",
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 4,
        }}
      >
        {title}
      </Text>
      <Text
        className={`text-lg font-bold text-white drop-shadow-lg text-center mb-2 ${
          active ? "" : "opacity-80"
        }`}
        style={{
          textShadowColor: "#000",
          textShadowOffset: { width: 2, height: 2 },
          textShadowRadius: 4,
        }}
      >
        {subtitle}
      </Text>
      {comingSoon && (
        <View className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-3xl">
          <Text className="text-white text-lg font-bold">Coming soon...</Text>
        </View>
      )}
    </Wrapper>
  );
};

export default function PlayWithFriendsCard() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  return (
    <View className="flex-1 bg-[#181A20] w-full h-full justify-center items-center">
      <View className="flex-row justify-center items-center w-full">
        <Card title="Play" subtitle="with Friends" active onPress={() => router.push("/(lobby)/game-mode")} />
        <Card title="Play" subtitle="Random" comingSoon />
        <Card title="Daily" subtitle="Rewards" comingSoon />
      </View>
      <TouchableOpacity
        className="absolute bottom-8 right-8 bg-yellow-400 rounded-xl flex-row items-center px-6 py-3 shadow-lg z-50"
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="people" size={28} color="#222" />
        <Text className="text-[#222] font-bold ml-2 text-lg">Friends</Text>
      </TouchableOpacity>
      <FriendsModal visible={modalVisible} onClose={() => setModalVisible(false)} />
    </View>
  );
}
