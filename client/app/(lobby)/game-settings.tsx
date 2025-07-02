import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Dimensions, StyleSheet, Alert, ActivityIndicator, Modal } from "react-native";
import { useRouter } from "expo-router";
import { ENV } from "@/env";
import { useUserStore } from "../../store/userStore";

interface User {
  id: string;
  username: string;
}

interface InviteModalProps {
  visible: boolean;
  onInvite: (user: User) => void;
  onClose: () => void;
  inviting: boolean;
  invited: User[];
  maxInvites: number;
  users: User[];
}

function InviteModal({ visible, onInvite, onClose, inviting, invited, maxInvites, users }: InviteModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.inviteModalOverlay}>
        <View style={styles.inviteModalContent}>
          <Text style={styles.inviteModalTitle}>Invite Players</Text>
          <Text style={styles.inviteModalSubtitle}>Select {maxInvites} users to invite:</Text>
          <View style={styles.inviteUsersList}>
            {users.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={[styles.inviteUserButton, invited.some((u: any) => u.id === user.id) && styles.inviteUserButtonInvited]}
                onPress={() => onInvite(user)}
                disabled={invited.some((u: any) => u.id === user.id) || invited.length >= maxInvites || inviting}
              >
                <Text style={styles.inviteUserText}>{user.username}</Text>
                {invited.some((u: any) => u.id === user.id) && <Text style={{ color: '#4ADE80', marginLeft: 8 }}>Invited</Text>}
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.inviteModalClose} onPress={onClose} disabled={inviting}>
            <Text style={styles.inviteModalCloseText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

export default function GameSettings() {
  const router = useRouter();
  const user = useUserStore((state) => state.user);
  const [players, setPlayers] = useState(3);
  const [tableType, setTableType] = useState<'public' | 'private'>('private');
  const [loading, setLoading] = useState(false);
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [invited, setInvited] = useState<User[]>([]);
  const [waiting, setWaiting] = useState(false);
  const [roomStatus, setRoomStatus] = useState('waiting_for_invites');
  const [mockUsers, setMockUsers] = useState<User[]>([]);
  const minPlayers = 2;
  const maxPlayers = 6;
  const maxInvites = 1;
  
  const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
  const isSmallScreen = screenWidth < 400;
  const isMediumScreen = screenWidth >= 400 && screenWidth < 600;

  // Fetch mock users from backend after room creation
  React.useEffect(() => {
    if (!showInviteModal || !user) return;
    async function fetchMockUsers() {
      try {
        console.log("Fetching mock users", user!.id);
        const res = await fetch(`${ENV.BASE_URL}/api/mock-users?limit=4&exclude=${user!.id}`);
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        console.log("Mock users", data);
        const users = data.map((u: any) => ({
          id: u.id || u._id, // prefer id, fallback to _id
          username: u.username
        }));
        setMockUsers(users);
      } catch (err) {
        console.error('Error fetching mock users:', err instanceof Error ? err.message : 'Unknown error');
        setMockUsers([]);
      }
    }
    fetchMockUsers();
  }, [showInviteModal, user]);

  const handleContinue = async () => {
    if (!user) {
      Alert.alert("User not registered");
      return;
    }
    if (tableType === 'private') {
      setLoading(true);
      try {
        const res = await fetch(`${ENV.BASE_URL}/api/games`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ creator: user.id, maxPlayers: players }),
        });
        if (!res.ok) throw new Error("Failed to create room");
        const data = await res.json();
        setRoomCode(data.code);
        setShowInviteModal(true);
      } catch (err: any) {
        Alert.alert("Room Creation Error", err.message);
      } finally {
        setLoading(false);
      }
    } else {
      // handle public table navigation
    }
  };

  // Invite logic
  const handleInvite = async (invitee: User) => {
    if (!roomCode) return;
    setLoading(true);
    try {
      console.log("Inviting user:", invitee);
      const res = await fetch(`${ENV.BASE_URL}/api/games/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: roomCode, invitees: [{ id: invitee.id, username: invitee.username }] }),
      });
      if (!res.ok) throw new Error("Failed to invite user");
      setInvited((prev) => {
        const updated = [...prev, invitee];
        if (updated.length === maxInvites) {
          setShowInviteModal(false);
          setWaiting(true);
          // Move owner to private-table immediately
          router.push({ pathname: '/(lobby)/private-table', params: { roomCode } });
        }
        return updated;
      });
    } catch (err) {
      Alert.alert("Invite Error", err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Poll for room status if waiting
  React.useEffect(() => {
    if (!roomCode || !waiting) return;
    let interval: any;
    async function pollRoom() {
      try {
        const res = await fetch(`${ENV.BASE_URL}/api/games/${roomCode}`);
        if (!res.ok) return;
        const data = await res.json();
        setRoomStatus(data.game.gameInfo.status);
        if (data.game.gameInfo.status === 'ready') {
          setWaiting(false);
          router.push({ pathname: '/(lobby)/private-table', params: { roomCode } });
        }
      } catch {}
    }
    pollRoom();
    interval = setInterval(pollRoom, 2000);
    return () => clearInterval(interval);
  }, [roomCode, waiting]);

  // After inviting 1 user, start waiting
  React.useEffect(() => {
    if (invited.length === maxInvites && roomCode) {
      setShowInviteModal(false);
      setWaiting(true);
    }
  }, [invited, maxInvites, roomCode]);

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[
          styles.settingsContainer,
          isSmallScreen ? styles.settingsContainerSmall : 
          isMediumScreen ? styles.settingsContainerMedium : 
          styles.settingsContainerLarge,
          isSmallScreen ? styles.paddingSmall : styles.paddingLarge
        ]}>
          <Text style={[
            styles.title,
            isSmallScreen ? styles.titleSmall : styles.titleLarge
          ]}>
            Game Settings
          </Text>
          
          {/* Players */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isSmallScreen ? styles.sectionTitleSmall : styles.sectionTitleLarge]}>Players</Text>
            <Text style={styles.maxPlayersText}>Max Players: {maxPlayers}</Text>
            <View style={styles.playersContainer}>
              <Text style={[styles.playersCount, isSmallScreen ? styles.playersCountSmall : styles.playersCountLarge]}>{players}</Text>
              <TouchableOpacity
                style={styles.playerButton}
                onPress={() => setPlayers(Math.max(players - 1, minPlayers))}
              >
                <Text style={styles.playerButtonText}>-</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.playerButton}
                onPress={() => setPlayers(Math.min(players + 1, maxPlayers))}
              >
                <Text style={styles.playerButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Game Type */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, isSmallScreen ? styles.sectionTitleSmall : styles.sectionTitleLarge]}>Game Type</Text>
            <View style={[styles.gameTypeContainer, isSmallScreen ? styles.gameTypeContainerSmall : styles.gameTypeContainerLarge]}>
              <TouchableOpacity
                style={[
                  styles.gameTypeButton,
                  tableType === 'public' ? styles.gameTypeButtonActive : styles.gameTypeButtonInactive,
                  styles.publicButton
                ]}
                onPress={() => setTableType('public')}
              >
                <Text style={[styles.gameTypeTitle, isSmallScreen ? styles.gameTypeTitleSmall : styles.gameTypeTitleLarge]}>Public Table</Text>
                <Text style={styles.gameTypeDescription}>Play with random players from around the world.</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.gameTypeButton,
                  tableType === 'private' ? styles.gameTypeButtonActive : styles.gameTypeButtonInactive,
                  styles.privateButton
                ]}
                onPress={() => setTableType('private')}
              >
                <Text style={[styles.gameTypeTitle, isSmallScreen ? styles.gameTypeTitleSmall : styles.gameTypeTitleLarge]}>Private Table</Text>
                <Text style={styles.gameTypeDescription}>Share the table code to invite your friends.</Text>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, isSmallScreen ? styles.buttonSmall : styles.buttonLarge]} 
              onPress={() => router.back()}
            >
              <Text style={[styles.buttonText, isSmallScreen ? styles.buttonTextSmall : styles.buttonTextLarge]}>Back</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.button, isSmallScreen ? styles.buttonSmall : styles.buttonLarge]} 
              onPress={handleContinue}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#222" />
              ) : (
                <Text style={[styles.buttonText, isSmallScreen ? styles.buttonTextSmall : styles.buttonTextLarge]}>Continue</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {/* Invite Modal */}
      <InviteModal
        visible={showInviteModal}
        onInvite={handleInvite}
        onClose={() => setShowInviteModal(false)}
        inviting={loading}
        invited={invited}
        maxInvites={maxInvites}
        users={mockUsers}
      />
      {/* Waiting Modal */}
      <Modal visible={waiting} transparent animationType="fade">
        <View style={styles.inviteModalOverlay}>
          <View style={styles.inviteModalContent}>
            <Text style={styles.inviteModalTitle}>Waiting for players to accept...</Text>
            <ActivityIndicator color="#FBBF24" style={{ marginTop: 16 }} />
            <Text style={{ color: '#fff', marginTop: 16 }}>Room code: {roomCode}</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181A20",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    width: "100%",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
  },
  settingsContainer: {
    maxWidth: 448, // max-w-md
    backgroundColor: "rgba(35, 36, 42, 0.95)", // bg-[#23242a] bg-opacity-95
    borderRadius: 16, // rounded-2xl
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 10,
    alignItems: "center",
  },
  settingsContainerSmall: {
    width: "92%",
  },
  settingsContainerMedium: {
    width: "85%",
  },
  settingsContainerLarge: {
    width: "80%",
  },
  paddingSmall: {
    padding: 16, // p-4
  },
  paddingLarge: {
    padding: 24, // p-6
  },
  title: {
    fontWeight: "800", // font-extrabold
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 16, // mb-4
    textShadowColor:'#000',
    textShadowOffset:{width:2,height:2},
    textShadowRadius:4,
  },
  titleSmall: {
    fontSize: 24, // text-2xl
  },
  titleLarge: {
    fontSize: 30, // text-3xl
  },
  section: {
    width: "100%",
    marginBottom: 16, // mb-4
  },
  sectionTitle: {
    fontWeight: "700", // font-bold
    color: "#FFFFFF",
    marginBottom: 8, // mb-2
  },
  sectionTitleSmall: {
    fontSize: 16, // text-base
  },
  sectionTitleLarge: {
    fontSize: 18, // text-lg
  },
  maxPlayersText: {
    fontSize: 12, // text-xs
    color: "#D1D5DB", // text-gray-300
    marginBottom: 8, // mb-2
  },
  playersContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#181A20",
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 12, // px-3
    paddingVertical: 8, // py-2
  },
  playersCount: {
    flex: 1,
    color: "#FFFFFF",
    fontWeight: "700", // font-bold
    textAlign: "center",
  },
  playersCountSmall: {
    fontSize: 20, // text-xl
  },
  playersCountLarge: {
    fontSize: 24, // text-2xl
  },
  playerButton: {
    backgroundColor: "#FBBF24", // bg-yellow-400
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 12, // px-3
    paddingVertical: 8, // py-2
    marginHorizontal: 4, // mx-1
  },
  playerButtonText: {
    color: "#000",
    fontSize: 20, // text-xl
    fontWeight: "700", // font-bold
  },
  gameTypeContainer: {
    flexDirection: "row",
    width: "100%",
  },
  gameTypeContainerSmall: {
    // gap: 8, // space-x-2 - not supported in React Native
  },
  gameTypeContainerLarge: {
    // gap: 16, // space-x-4 - not supported in React Native
  },
  gameTypeButton: {
    flex: 1,
    borderRadius: 12, // rounded-xl
    paddingHorizontal: 8, // px-2
    paddingVertical: 16, // py-4
    alignItems: "center",
    borderWidth: 2,
    marginHorizontal: 4, // Add spacing between buttons
  },
  gameTypeButtonActive: {
    borderColor: "#FBBF24", // border-yellow-400
  },
  gameTypeButtonInactive: {
    borderColor: "transparent",
  },
  publicButton: {
    backgroundColor: "rgba(21, 128, 61, 0.8)", // bg-green-700/80
  },
  privateButton: {
    backgroundColor: "rgba(127, 29, 29, 0.8)", // bg-red-900/80
  },
  gameTypeTitle: {
    fontWeight: "800", // font-extrabold
    color: "#FFFFFF",
    marginBottom: 4, // mb-1
  },
  gameTypeTitleSmall: {
    fontSize: 18, // text-lg
  },
  gameTypeTitleLarge: {
    fontSize: 20, // text-xl
  },
  gameTypeDescription: {
    fontSize: 12, // text-xs
    color: "#FFFFFF",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  button: {
    backgroundColor: "#FBBF24", // bg-yellow-400
    borderRadius: 12, // rounded-xl
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonSmall: {
    paddingHorizontal: 24, // px-6
    paddingVertical: 8, // py-2
  },
  buttonLarge: {
    paddingHorizontal: 32, // px-8
    paddingVertical: 12, // py-3
  },
  buttonText: {
    color: "#222",
    fontWeight: "700", // font-bold
  },
  buttonTextSmall: {
    fontSize: 16, // text-base
  },
  buttonTextLarge: {
    fontSize: 18, // text-lg
  },
  inviteModalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  inviteModalContent: {
    backgroundColor: "#181A20",
    padding: 20,
    borderRadius: 16,
    maxWidth: "80%",
    width: "100%",
    alignItems: "center",
  },
  inviteModalTitle: {
    fontWeight: "800",
    color: "#FFFFFF",
    fontSize: 20,
    marginBottom: 16,
  },
  inviteModalSubtitle: {
    fontSize: 12,
    color: "#FFFFFF",
    marginBottom: 16,
  },
  inviteUsersList: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 16,
  },
  inviteUserButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 8,
    margin: 4,
  },
  inviteUserButtonInvited: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
  inviteUserText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
  inviteModalClose: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 8,
  },
  inviteModalCloseText: {
    color: "#FFFFFF",
    fontWeight: "700",
  },
}); 