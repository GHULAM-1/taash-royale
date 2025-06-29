import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Dimensions } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StreamChat } from "stream-chat";
import { Chat, Channel, MessageList, MessageInput } from "stream-chat-react-native";
import { ENV } from "../../env";

const API_URL = ENV.API_URL;
const STREAM_API_KEY = ENV.STREAM_API_KEY;

const generateUserId = () => {
  return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

const players = [
  { name: "saeed4747", score: 43, avatar: require('../../assets/images/icon.png'), isHost: true },
  { name: "saimxoxo", score: 43, avatar: require('../../assets/images/icon.png'), isHost: false },
  { name: "saeed4747", score: 43, avatar: require('../../assets/images/icon.png'), isHost: false },
  { name: "", score: 0, avatar: null, isHost: false },
];

export default function PrivateTable() {
  const router = useRouter();
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [userId] = useState(generateUserId()); // Generate unique ID once

  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 768;
  const isMediumScreen = screenWidth >= 768 && screenWidth < 1024;

  useEffect(() => {
    async function setupChat() {
      try {
        const chatClient = StreamChat.getInstance(ENV.STREAM_API_KEY || "");

        if (chatClient.userID) {
          await chatClient.disconnectUser();
        }

        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const { token } = await response.json();

        await chatClient.connectUser(
          {
            id: userId,
            name: userId,
          },
          token
        );

        const channel = chatClient.channel("messaging", "global-chat", {
          members: [userId],
        });
        await channel.watch();

        setClient(chatClient);
        setChannel(channel);
      } catch (error) {
        console.error("Error setting up chat:", error);
      }
    }

    setupChat();
    return () => {
      if (client) client.disconnectUser();
    };
    // eslint-disable-next-line
  }, []);

  return (
    <View className="flex-1 bg-[#181A20] flex-row justify-center items-center relative">
      {/* Players List */}
      <View className={`${isSmallScreen ? 'w-[35%]' : isMediumScreen ? 'w-[60%]' : 'w-[60vw]'} max-w-2xl bg-[#23242a] bg-opacity-95 rounded-2xl shadow-2xl ${isSmallScreen ? 'p-4' : 'p-6'} m-4`}>
        <Text className="text-2xl font-extrabold text-white mb-2">Players</Text>
        <Text className="text-xs text-gray-300 mb-4">Max Players: 6</Text>
        <ScrollView className="max-h-96" showsVerticalScrollIndicator={false}>
          <View className={`flex flex-wrap flex-row ${isSmallScreen ? 'gap-2' : 'gap-4'} mb-4`}>
            {players.map((p, i) => (
              <View key={i} className={`${isSmallScreen ? 'w-full' : 'w-48'} h-16 bg-[#181A20] rounded-xl flex-row items-center px-4 relative`}>
                {p.avatar ? (
                  <Image source={p.avatar} className="w-10 h-10 rounded-full mr-2" />
                ) : (
                  <View className="w-10 h-10 rounded-full mr-2 bg-gray-600" />
                )}
                <View className="flex-1">
                  <Text className="text-white font-bold text-base">{p.name || <Text className='text-gray-500'>+</Text>}</Text>
                  <Text className="text-xs text-gray-400">{p.score ? p.score : ''}</Text>
                </View>
                {p.isHost && <Ionicons name="color-wand" size={18} color="#FFD700" className="ml-1" />}
                {p.name && (
                  <TouchableOpacity className="ml-2">
                    <Ionicons name="remove-circle" size={20} color="#fff" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </View>
        </ScrollView>
        <View className="w-full bg-yellow-400 rounded-xl py-3 flex items-center mt-4">
          <Text className="text-black font-bold">waiting for others to join...</Text>
        </View>
      </View>
      
      {/* Live Chat */}
      <View className={`${isSmallScreen ? 'w-[95%] mt-4' : isMediumScreen ? 'w-[35%]' : 'w-[28vw]'} max-w-md bg-[#23242a] bg-opacity-95 rounded-2xl shadow-2xl ${isSmallScreen ? 'p-4' : 'p-4'} m-4 flex flex-col ${isSmallScreen ? 'h-96' : 'h-[80vh]'}`}>
        <Text className="text-2xl font-extrabold text-white mb-2">Live Chat</Text>
        {client && channel ? (
          <Chat client={client}>
            <Channel channel={channel}>
              <MessageList />
              <MessageInput />
            </Channel>
          </Chat>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-white">Connecting to chat...</Text>
          </View>
        )}
      </View>
    </View>
  );
} 