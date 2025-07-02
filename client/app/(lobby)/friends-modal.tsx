import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, TextInput, ScrollView, Dimensions, Platform, Alert, Share, StyleSheet, ViewStyle, TextStyle } from "react-native";
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
    <View style={styles.dialogOverlay}>
      <View style={styles.dialogContainer}>
        <TouchableOpacity style={styles.dialogCloseButton} onPress={onClose}>
          <View style={styles.dialogCloseButtonBg}>
            <Ionicons name="close" size={22} color="#fff" />
          </View>
        </TouchableOpacity>
        <Text style={styles.dialogTitle}>Unsend Friend Request?</Text>
        <Text style={styles.dialogText}>
          This will remove your friend request to <Text style={styles.dialogBoldText}>{username}</Text>.
          {"\n"}They will no longer see your request, and you can send a new one later.
        </Text>
        <View style={styles.dialogButtonContainer}>
          <TouchableOpacity style={styles.dialogButtonKeep} onPress={onClose}>
            <Text style={styles.dialogButtonKeepText}>Keep Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.dialogButtonUnsend} onPress={onUnsend}>
            <Text style={styles.dialogButtonUnsendText}>Unsend</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

function SearchTab() {
  return (
    <View style={styles.tabContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by username or ID"
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.sectionTitle}>People You may know</Text>
      <ScrollView style={styles.scrollContainer}>
        {[1,2,3].map((i) => (
          <View key={i} style={styles.friendItem}>
            <View style={styles.avatar} />
            <Text style={styles.friendName}>saeed4747</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>+ Add</Text>
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
    <View style={styles.tabContainer}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          value={GAME_LINK}
          editable={false}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleCopy}>
          <Ionicons name="copy" size={18} color="#222" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.searchButton} onPress={handleShare}>
          <Ionicons name="share-social" size={18} color="#222" />
        </TouchableOpacity>
      </View>
      {copied && (
        <View style={styles.copiedToast}>
          <Text style={styles.copiedText}>Copied!</Text>
        </View>
      )}
      <Text style={styles.sectionTitle}>Invite Players</Text>
      <ScrollView style={styles.scrollContainer}>
        {["saeed4747", "Saimxoxo", "Ridakhusi212"].map((username, i) => (
          <View key={i} style={styles.friendItem}>
            <View style={styles.avatar} />
            <Text style={styles.friendName}>{username}</Text>
            <TouchableOpacity style={styles.removeButton} onPress={() => onUnsend(username)}>
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.spectateButton}>
              <Text style={styles.spectateButtonText}>Spectate</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function IncomingRequestsTab({ onUnsend }: { onUnsend: (username: string) => void }) {
  return (
    <View style={styles.tabContainer}>
      <ScrollView style={styles.scrollContainer}>
        {["saeed4747", "Saimxoxo", "Saimxoxo"].map((username, i) => (
          <View key={i} style={styles.friendItem}>
            <View style={styles.avatar} />
            <Text style={styles.friendName}>{username}{"\n"}Sent you a friend request</Text>
            <TouchableOpacity style={styles.rejectButton} onPress={() => onUnsend(username)}>
              <Ionicons name="close" size={18} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton}>
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
    <View style={styles.modalOverlay}>
      <TouchableOpacity
        style={styles.modalBackdrop}
        activeOpacity={1}
        onPress={onClose}
      />
      <Animated.View
        style={[styles.modalContainer, animatedStyle]}
      >
        {/* Close button */}
        <TouchableOpacity style={styles.modalCloseButton} onPress={onClose}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {TABS.map((t, i) => (
            <TouchableOpacity
              key={t}
              style={[styles.tabButton, tab === i ? styles.tabButtonActive : styles.tabButtonInactive]}
              onPress={() => setTab(i)}
            >
              <Text style={[styles.tabButtonText, tab === i ? styles.tabButtonTextActive : styles.tabButtonTextInactive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* Tab content */}
        <View style={styles.tabContent}>
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

const styles = StyleSheet.create({
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalContainer: {
    width: '95%',
    maxWidth: 480,
    height: '90%',
    top: '5%',
    right: 0,
    position: 'absolute',
    backgroundColor: "#23242a",
    borderRadius: 16, // rounded-2xl
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 10,
    padding: 8, // p-2
  },
  modalCloseButton: {
    position: "absolute",
    top: 16, // top-4
    right: 16, // right-4
    zIndex: 10,
  },
  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16, // mt-4
    marginBottom: 8, // mb-2
    paddingHorizontal: 16, // px-4
  },
  tabButton: {
    flex: 1,
    marginHorizontal: 4, // mx-1
    paddingVertical: 8, // py-2
    borderRadius: 12, // rounded-xl
  },
  tabButtonActive: {
    backgroundColor: "#FBBF24", // yellow-400
  },
  tabButtonInactive: {
    backgroundColor: "#181A20",
  },
  tabButtonText: {
    textAlign: "center",
    fontWeight: "700", // font-bold
  },
  tabButtonTextActive: {
    color: "#000",
  },
  tabButtonTextInactive: {
    color: "#fff",
  },
  tabContent: {
    flex: 1,
  },
  tabContainer: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#23242a",
    borderRadius: 8, // rounded-lg
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2
    marginTop: 16, // mt-4
    marginHorizontal: 16, // mx-4
  },
  searchInput: {
    flex: 1,
    color: "#fff",
  },
  searchButton: {
    marginLeft: 8, // ml-2
    backgroundColor: "#FBBF24", // yellow-400
    borderRadius: 8, // rounded-lg
    paddingHorizontal: 12, // px-3
    paddingVertical: 4, // py-1
  },
  searchButtonText: {
    fontWeight: "700", // font-bold
    color: "#000",
  },
  sectionTitle: {
    color: "#fff",
    fontWeight: "700", // font-bold
    marginTop: 24, // mt-6
    marginLeft: 24, // ml-6
    marginBottom: 8, // mb-2
  },
  scrollContainer: {
    paddingHorizontal: 16, // px-4
  },
  friendItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#181A20",
    borderRadius: 12, // rounded-xl
    marginBottom: 12, // mb-3
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2
  },
  avatar: {
    width: 40, // w-10
    height: 40, // h-10
    backgroundColor: "#9CA3AF", // gray-400
    borderRadius: 20, // rounded-full
    marginRight: 12, // mr-3
  },
  friendName: {
    flex: 1,
    color: "#fff",
    fontWeight: "700", // font-bold
  },
  addButton: {
    backgroundColor: "#3B82F6", // blue-500
    borderRadius: 8, // rounded-lg
    paddingHorizontal: 16, // px-4
    paddingVertical: 4, // py-1
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "700", // font-bold
  },
  removeButton: {
    backgroundColor: "#4B5563", // gray-600
    borderRadius: 20, // rounded-full
    padding: 8, // p-2
    marginRight: 8, // mr-2
  },
  spectateButton: {
    backgroundColor: "#4ADE80", // green-400
    borderRadius: 8, // rounded-lg
    paddingHorizontal: 16, // px-4
    paddingVertical: 4, // py-1
  },
  spectateButtonText: {
    color: "#000",
    fontWeight: "700", // font-bold
  },
  rejectButton: {
    backgroundColor: "#EF4444", // red-500
    borderRadius: 20, // rounded-full
    padding: 8, // p-2
    marginRight: 8, // mr-2
  },
  acceptButton: {
    backgroundColor: "#10B981", // green-500
    borderRadius: 20, // rounded-full
    padding: 8, // p-2
  },
  copiedToast: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -50 }], // -translate-x-1/2
    top: 8, // top-2
    zIndex: 50,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    paddingHorizontal: 16, // px-4
    paddingVertical: 8, // py-2
    borderRadius: 12, // rounded-xl
  },
  copiedText: {
    color: "#fff",
    fontWeight: "700", // font-bold
  },
  dialogOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  dialogContainer: {
    width: "90%",
    maxWidth: 448, // max-w-md
    backgroundColor: "#23242a",
    borderRadius: 16, // rounded-2xl
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 10,
    padding: 24, // p-6
    alignItems: "center",
    position: "relative",
  },
  dialogCloseButton: {
    position: "absolute",
    top: 12, // top-3
    right: 12, // right-3
  },
  dialogCloseButtonBg: {
    backgroundColor: "#333",
    borderRadius: 20, // rounded-full
    padding: 4, // p-1
  },
  dialogTitle: {
    color: "#fff",
    fontSize: 20, // text-xl
    fontWeight: "700", // font-bold
    marginBottom: 16, // mb-4
    textAlign: "center",
  },
  dialogText: {
    color: "#fff",
    textAlign: "center",
    marginBottom: 24, // mb-6
  },
  dialogBoldText: {
    fontWeight: "700", // font-bold
  },
  dialogButtonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginTop: 8, // mt-2
  },
  dialogButtonKeep: {
    flex: 1,
    backgroundColor: "#23242a",
    borderWidth: 1,
    borderColor: "#444",
    borderRadius: 12, // rounded-xl
    paddingVertical: 8, // py-2
    marginRight: 8, // mr-2
    alignItems: "center",
  },
  dialogButtonKeepText: {
    color: "#fff",
    fontWeight: "700", // font-bold
  },
  dialogButtonUnsend: {
    flex: 1,
    backgroundColor: "#FBBF24", // yellow-400
    borderRadius: 12, // rounded-xl
    paddingVertical: 8, // py-2
    marginLeft: 8, // ml-2
    alignItems: "center",
  },
  dialogButtonUnsendText: {
    color: "#000",
    fontWeight: "700", // font-bold
  },
}); 