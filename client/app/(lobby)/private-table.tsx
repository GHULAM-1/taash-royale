import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Dimensions, StyleSheet, Platform, SafeAreaView, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StreamChat } from "stream-chat";
import { Chat, Channel, MessageList, MessageInput } from "stream-chat-react-native";
import { ENV } from "../../env";
import { useUserStore } from "../../store/userStore";

const API_URL = ENV.BASE_URL;
const STREAM_API_KEY = ENV.STREAM_API_KEY;

export default function PrivateTable() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const roomCode = Array.isArray(params.roomCode) ? params.roomCode[0] : params.roomCode;
  const user = useUserStore((state) => state.user);
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const { width: screenWidth } = Dimensions.get('window');
  const isTablet = screenWidth >= 480;

  // Fetch room details and users
  useEffect(() => {
    let interval: any;
    let first = true;
    async function fetchRoom() {
      console.log("Fetching room", roomCode);
      if (first) setLoading(true);
      try {
        const res = await fetch(`${API_URL}/api/rooms/${roomCode}`);
        if (!res.ok) throw new Error("Room not found");
        const data = await res.json();
        console.log("Room data", data);
        setRoom(data.room);
        setUsers(data.room.users || []);
      } catch (err) {
        console.log("Fetch error", err);
        setRoom(null);
        setUsers([]);
      } finally {
        if (first) setLoading(false);
        first = false;
      }
    }
    fetchRoom();
    interval = setInterval(fetchRoom, 3000);
    return () => clearInterval(interval);
  }, [roomCode]);

  // Setup Stream Chat for this room
  useEffect(() => {
    async function setupChat() {
      if (!roomCode || !user) return;
      try {
        const chatClient = StreamChat.getInstance(STREAM_API_KEY || "");
        if (chatClient.userID) {
          await chatClient.disconnectUser();
        }
        // Get token from backend for this room
        const response = await fetch(`${API_URL}/api/token`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, roomCode }),
        });
        if (!response.ok) throw new Error("Failed to get token");
        const { token } = await response.json();
        await chatClient.connectUser(
          {
            id: user.id,
            name: user.username,
          },
          token
        );
        const channel = chatClient.channel("messaging", roomCode, {
          members: [user.id],
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
  }, [roomCode, user]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FBBF24" />
          <Text style={{ color: '#fff', marginTop: 16 }}>Loading room...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[styles.container, isTablet ? styles.containerTablet : styles.containerMobile]}> 
        <View style={[styles.playersContainer, { flex: 1 }]}> 
          <Text style={styles.playersTitle}>Players</Text>
          <Text style={styles.maxPlayersText}>Max Players: {room?.maxPlayers || 6}</Text>
          <ScrollView style={styles.playersScrollView} showsVerticalScrollIndicator={false}>
            <View style={styles.playersGrid}>
              {Array.from({ length: room?.maxPlayers || 6 }).map((_, i) => {
                const u = users[i];
                return (
                  <View key={i} style={styles.playerItem}>
                    <View style={styles.playerAvatarPlaceholder} />
                    <View style={styles.playerInfo}>
                      <Text style={styles.playerName}>{u ? (u.username || u.id || u) : <Text style={styles.emptyPlayerText}>+</Text>}</Text>
                    </View>
                    {room?.creator === (u?.id || u) && u && <Ionicons name="color-wand" size={18} color="#FFD700" style={styles.hostIcon} />}
                  </View>
                );
              })}
            </View>
          </ScrollView>
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingText}>waiting for others to join...</Text>
          </View>
        </View>
        <View style={[styles.chatContainer, { flex: 1 }]}> 
          <Text style={styles.chatTitle}>Live Chat</Text>
          <View style={styles.chatContentWrapper}>
            {client && channel ? (
              <Chat client={client}>
                <Channel channel={channel}>
                  <MessageList />
                  <MessageInput />
                </Channel>
              </Chat>
            ) : (
              <View style={styles.connectingContainer}>
                <Text style={styles.connectingText}>Connecting to chat...</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#181A20",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
    position: "relative",
  },
  containerMobile: {
    flexDirection: "column",
    padding: 8,
  },
  containerTablet: {
    flexDirection: "row",
    padding: 16,
  },
  playersContainer: {
    backgroundColor: "rgba(35, 36, 42, 0.95)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 12,
    marginTop: 12,
    marginRight: 0,
    marginLeft: 0,
    padding: 12,
    minHeight: 0,
  },
  playersTitle: {
    fontWeight: "800",
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 6,
  },
  maxPlayersText: {
    fontSize: 10,
    color: "#D1D5DB",
    marginBottom: 12,
  },
  playersScrollView: {
    marginBottom: 12,
    minHeight: 0,
  },
  playersGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  playerItem: {
    width: "100%",
    height: 56,
    backgroundColor: "#181A20",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginBottom: 6,
    paddingHorizontal: 12,
  },
  playerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 6,
  },
  playerAvatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 6,
    backgroundColor: "#4B5563",
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
  emptyPlayerText: {
    color: "#6B7280",
  },
  playerScore: {
    color: "#9CA3AF",
    fontSize: 10,
  },
  hostIcon: {
    marginLeft: 4,
  },
  removeButton: {
    marginLeft: 6,
  },
  waitingContainer: {
    width: "100%",
    backgroundColor: "#FBBF24",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 12,
    paddingVertical: 10,
  },
  waitingText: {
    color: "#000",
    fontWeight: "700",
    fontSize: 14,
  },
  chatContainer: {
    backgroundColor: "rgba(35, 36, 42, 0.95)",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 12,
    marginTop: 12,
    marginLeft: 0,
    marginRight: 0,
    padding: 12,
    minHeight: 0,
  },
  chatTitle: {
    fontWeight: "800",
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 6,
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  chatContentWrapper: {
    flex: 1,
    minHeight: 0,
  },
  connectingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  connectingText: {
    color: "#FFFFFF",
    fontSize: 14,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
}); 