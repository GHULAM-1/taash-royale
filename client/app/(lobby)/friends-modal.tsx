import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions, Platform, Alert, Share } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { runOnJS } from 'react-native-reanimated';
import * as Clipboard from 'expo-clipboard';

const SCREEN_WIDTH = Dimensions.get('window').width;
const GAME_LINK = "https://play.google.com/store/apps?hl=en";
const GAME_TITLE = "Taash Royale - Download Game";

function UnsendFriendRequestDialog({ visible, onClose, username, onUnsend }: { visible: boolean; onClose: () => void; username: string; onUnsend: () => void }) {
  if (!visible) return null;
  return (
    <View className="absolute inset-0 z-50 flex justify-center items-center bg-black/40">
      <View className="w-[90vw] max-w-md bg-[#23242a] rounded-2xl shadow-2xl p-6 items-center relative">
        <TouchableOpacity className="absolute top-3 right-3" onPress={onClose}>
          <View className="bg-[#333] rounded-full p-1">
            <Ionicons name="close" size={22} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text className="text-white text-xl font-bold mb-4 text-center">Unsend Friend Request?</Text>
        <Text className="text-white text-center mb-6">
          This will remove your friend request to <Text className="font-bold">{username}</Text>.
          {"\n"}They will no longer see your request, and you can send a new one later.
        </Text>
        <View className="flex-row w-full justify-between mt-2">
          <TouchableOpacity className="flex-1 bg-[#23242a] border border-[#444] rounded-xl py-2 mr-2 items-center" onPress={onClose}>
            <Text className="text-white font-bold">Keep Request</Text>
          </TouchableOpacity>
          <TouchableOpacity className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl py-2 ml-2 items-center" onPress={onUnsend}>
            <Text className="text-black font-bold">Unsend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function SearchTab() {
  return (
    <View className="flex-1">
      <View className="flex-row items-center bg-[#23242a] rounded-lg px-4 py-2 mt-4 mx-4">
        <TextInput
          className="flex-1 text-white"
          placeholder="Search by username or ID"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity className="ml-2 bg-yellow-400 rounded-lg px-3 py-1">
          <Text className="font-bold text-black">Search</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-white font-bold mt-6 ml-6 mb-2">People You may know</Text>
      <ScrollView className="px-4">
        {[1,2,3].map((i) => (
          <View key={i} className="flex-row items-center bg-[#181A20] rounded-xl mb-3 px-4 py-2">
            <View className="w-10 h-10 bg-gray-400 rounded-full mr-3" />
            <Text className="flex-1 text-white font-bold">saeed4747</Text>
            <TouchableOpacity className="bg-blue-500 rounded-lg px-4 py-1">
              <Text className="text-white font-bold">+ Add</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function MyFriendsTab({ onUnsend }: { onUnsend: (username: string) => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(GAME_LINK);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: GAME_LINK,
        title: GAME_TITLE,
      });
    } catch (e) {
      Alert.alert('Share failed', 'Unable to open share dialog.');
    }
  };

  return (
    <View className="flex-1">
      <View className="flex-row items-center bg-[#23242a] rounded-lg px-4 py-2 mt-4 mx-4">
        <TextInput
          className="flex-1 text-white"
          value={GAME_LINK}
          editable={false}
        />
        <TouchableOpacity className="ml-2 bg-yellow-400 rounded-lg px-3 py-1" onPress={handleCopy}>
          <Ionicons name="copy" size={18} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity className="ml-2 bg-yellow-400 rounded-lg px-3 py-1" onPress={handleShare}>
          <Ionicons name="share-social" size={18} color="#222" />
        </TouchableOpacity>
      </View>
      {copied && (
        <View className="absolute left-1/2 -translate-x-1/2 top-2 z-50 bg-black/80 px-4 py-2 rounded-xl">
          <Text className="text-white font-bold">Copied!</Text>
        </View>
      )}
      <Text className="text-white font-bold mt-6 ml-6 mb-2">Invite Players</Text>
      <ScrollView className="px-4">
        {["saeed4747", "Saimxoxo", "Ridakhusi212"].map((username, i) => (
          <View key={i} className="flex-row items-center bg-[#181A20] rounded-xl mb-3 px-4 py-2">
            <View className="w-10 h-10 bg-gray-400 rounded-full mr-3" />
            <Text className="flex-1 text-white font-bold">{username}</Text>
            <TouchableOpacity className="bg-gray-600 rounded-full p-2 mr-2" onPress={() => onUnsend(username)}>
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-green-400 rounded-lg px-4 py-1">
              <Text className="text-black font-bold">Spectate</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function IncomingRequestsTab({ onUnsend }: { onUnsend: (username: string) => void }) {
  return (
    <View className="flex-1">
      <ScrollView className="px-4 mt-6">
        {["saeed4747", "Saimxoxo", "Saimxoxo"].map((username, i) => (
          <View key={i} className="flex-row items-center bg-[#181A20] rounded-xl mb-3 px-4 py-2">
            <View className="w-10 h-10 bg-gray-400 rounded-full mr-3" />
            <Text className="flex-1 text-white font-bold">{username}{"\n"}Sent you a friend request</Text>
            <TouchableOpacity className="bg-red-500 rounded-full p-2 mr-2" onPress={() => onUnsend(username)}>
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity className="bg-green-500 rounded-full p-2">
              <Ionicons name="checkmark" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const TABS = ["Search", "My Friends", "Incoming Requests"];

export default function FriendsModal({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [tab, setTab] = useState(0);
  const [shouldRender, setShouldRender] = useState(visible);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogUser, setDialogUser] = useState("");
  const translateX = useSharedValue(SCREEN_WIDTH);

  useEffect(() => {
    if (visible) {
      setShouldRender(true);
      translateX.value = withTiming(0, { duration: 300 });
    } else {
      translateX.value = withTiming(SCREEN_WIDTH, { duration: 300 }, (finished) => {
        if (finished) runOnJS(setShouldRender)(false);
      });
    }
  }, [visible]);
  

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  if (!shouldRender) return null;

  const handleUnsend = (username: string) => {
    setDialogUser(username);
    setDialogVisible(true);
  };

  return (
    <View className="absolute inset-0 z-50">
      <TouchableOpacity
        className="absolute inset-0 bg-black/60"
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[{ width: '95%', maxWidth: 480, height: '90%', top: '5%', right: 0, position: 'absolute' }, animatedStyle]}
        className="bg-[#23242a] rounded-2xl shadow-2xl p-2"
      >
        {/* Close button */}
        <TouchableOpacity className="absolute top-4 right-4 z-10" onPress={onClose}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        {/* Tabs */}
        <View className="flex-row justify-between items-center mt-4 mb-2 px-4">
          {TABS.map((t, i) => (
            <TouchableOpacity
              key={t}
              className={`flex-1 mx-1 py-2 rounded-xl ${tab === i ? "bg-yellow-400" : "bg-[#181A20]"}`}
              onPress={() => setTab(i)}
            >
              <Text className={`text-center font-bold ${tab === i ? "text-black" : "text-white"}`}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Tab content */}
        <View className="flex-1">
          {tab === 0 && <SearchTab />}
          {tab === 1 && <MyFriendsTab onUnsend={handleUnsend} />}
          {tab === 2 && <IncomingRequestsTab onUnsend={handleUnsend} />}
        </View>
      </Animated.View>
      <UnsendFriendRequestDialog
        visible={dialogVisible}
        username={dialogUser}
        onClose={() => setDialogVisible(false)}
        onUnsend={() => {
          setDialogVisible(false);
          // Add your unsend logic here
        }}
      />
    </View>
  );
} 