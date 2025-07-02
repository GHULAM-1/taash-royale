import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FriendsModal from "./friends-modal";
import { useRouter } from "expo-router";
import { ENV } from "@/env";
import { useUserStore } from "../../store/userStore";

// Utility to generate random username and id
function generateRandomUser() {
  const id = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const username = `guest_${Math.random().toString(36).substr(2, 5)}`;
  return { id, username };
}

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
      style={[
        styles.card,
        active ? styles.cardActive : styles.cardInactive,
      ]}
      {...(onPress ? { onPress, activeOpacity: 0.85 } : {})}
    >
      <Text
        style={[
          styles.cardTitle,
          active ? {} : styles.cardTitleInactive,
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.cardSubtitle,
          active ? {} : styles.cardSubtitleInactive,
        ]}
      >
        {subtitle}
      </Text>
      {comingSoon && (
        <View style={styles.comingSoonOverlay}>
          <Text style={styles.comingSoonText}>Coming soon...</Text>
        </View>
      )}
    </Wrapper>
  );
};

interface PendingInvite {
  roomCode: string;
  creator: string;
  maxPlayers: number;
  invite: { id: string; username: string };
}

export default function PlayWithFriendsCard() {
  const [modalVisible, setModalVisible] = useState(false);
  const [pendingInvites, setPendingInvites] = useState<PendingInvite[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [currentInvite, setCurrentInvite] = useState<PendingInvite | null>(null);
  const setUser = useUserStore((state) => state.setUser);
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  // Poll for pending invites
  useEffect(() => {
    if (!user) return;
    
    const pollInvites = async () => {
      try {
        const res = await fetch(`${ENV.BASE_URL}/api/rooms/pending-invites/${user.id}`);
        if (!res.ok) return;
        const data = await res.json();
        if (data.pendingInvites && data.pendingInvites.length > 0) {
          setPendingInvites(data.pendingInvites);
          if (!showInviteModal) {
            setCurrentInvite(data.pendingInvites[0]);
            setShowInviteModal(true);
          }
        }
      } catch (err) {
        // Silent fail for polling
      }
    };
    
    pollInvites();
    const interval = setInterval(pollInvites, 3000); // Poll every 3 seconds
    return () => clearInterval(interval);
  }, [user, showInviteModal]);

  useEffect(() => {
    if (!user) {
      const newUser = generateRandomUser();
      fetch(`${ENV.BASE_URL}/api/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      })
        .then(async (res) => {
          if (!res.ok) throw new Error("Failed to register user");
          const data = await res.json();
          setUser({ id: data.id, username: data.username });
        })
        .catch((err) => {
          Alert.alert("Registration Error", err.message);
        });
    }
  }, []);

  const handleAcceptInvite = async () => {
    if (!currentInvite || !user) return;
    
    try {
      const res = await fetch(`${ENV.BASE_URL}/api/rooms/accept-invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: currentInvite.roomCode, userId: user.id }),
      });
      
      if (!res.ok) throw new Error("Failed to accept invite");
      
      // Remove from pending invites
      setPendingInvites(prev => prev.filter(inv => inv.roomCode !== currentInvite.roomCode));
      setShowInviteModal(false);
      setCurrentInvite(null);
      
      // Navigate to the room
      router.push({ pathname: '/(lobby)/private-table', params: { roomCode: currentInvite.roomCode } });
    } catch (err) {
      Alert.alert("Error", err instanceof Error ? err.message : "Failed to accept invite");
    }
  };

  const handleDeclineInvite = () => {
    if (!currentInvite) return;
    
    // Remove from pending invites
    setPendingInvites(prev => prev.filter(inv => inv.roomCode !== currentInvite.roomCode));
    setShowInviteModal(false);
    setCurrentInvite(null);
  };

  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
        <Card title="Play" subtitle="with Friends" active onPress={() => router.push("/(lobby)/game-mode")} />
        <Card title="Play" subtitle="Random" comingSoon />
        <Card title="Daily" subtitle="Rewards" comingSoon />
      </View>
      <TouchableOpacity
        style={styles.friendsButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="people" size={28} color="#222" />
        <Text style={styles.friendsButtonText}>Friends</Text>
      </TouchableOpacity>
      <FriendsModal visible={modalVisible} onClose={() => setModalVisible(false)} />
      
      {/* Invite Notification Modal */}
      {showInviteModal && currentInvite && (
        <View style={styles.inviteModalOverlay}>
          <View style={styles.inviteModalContent}>
            <Text style={styles.inviteModalTitle}>Game Invitation!</Text>
            <Text style={styles.inviteModalText}>
              You've been invited to join a game room by {currentInvite.creator}
            </Text>
            <Text style={styles.inviteModalSubtext}>
              Room Code: {currentInvite.roomCode}
            </Text>
            <View style={styles.inviteButtonContainer}>
              <TouchableOpacity style={styles.declineButton} onPress={handleDeclineInvite}>
                <Text style={styles.declineButtonText}>Decline</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.acceptButton} onPress={handleAcceptInvite}>
                <Text style={styles.acceptButtonText}>Accept</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181A20",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  card: {
    width: 256, // w-64 = 16rem * 16 = 256px
    height: 320, // h-80 = 20rem * 16 = 320px
    marginHorizontal: 8, // mx-2 = 0.5rem * 16 = 8px
    borderRadius: 24, // rounded-3xl = 1.5rem * 16 = 24px
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 25,
    },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    borderWidth: 4,
  },
  cardActive: {
    backgroundColor: "#FFE6B0",
    borderColor: "#FBBF24", // yellow-400
  },
  cardInactive: {
    backgroundColor: "rgba(34, 34, 34, 0.8)", // #222c
    borderColor: "#9CA3AF", // gray-400
    opacity: 0.6,
  },
  cardTitle: {
    fontSize: 24, // text-2xl = 1.5rem * 16 = 24px
    fontWeight: "800", // font-extrabold
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 32, // mt-8 = 2rem * 16 = 32px
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  cardTitleInactive: {
    opacity: 0.8,
  },
  cardSubtitle: {
    fontSize: 18, // text-lg = 1.125rem * 16 = 18px
    fontWeight: "700", // font-bold
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8, // mb-2 = 0.5rem * 16 = 8px
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  cardSubtitleInactive: {
    opacity: 0.8,
  },
  comingSoonOverlay: {
    position: "absolute",
    inset: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 24, // rounded-3xl
  },
  comingSoonText: {
    color: "#FFFFFF",
    fontSize: 18, // text-lg
    fontWeight: "700", // font-bold
  },
  friendButton: {
    position: "absolute",
    bottom: 32, // bottom-8 = 2rem * 16 = 32px
    left: 32, // right-8 = 2rem * 16 = 32px
    backgroundColor: "#FBBF24", // yellow-400
    borderRadius: 12, // rounded-xl = 0.75rem * 16 = 12px
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24, // px-6 = 1.5rem * 16 = 24px
    paddingVertical: 12, // py-3 = 0.75rem * 16 = 12px
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 50,
  },
  friendsButton: {
    position: "absolute",
    bottom: 32, // bottom-8 = 2rem * 16 = 32px
    right: 32, // right-8 = 2rem * 16 = 32px
    backgroundColor: "#FBBF24", // yellow-400
    borderRadius: 12, // rounded-xl = 0.75rem * 16 = 12px
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24, // px-6 = 1.5rem * 16 = 24px
    paddingVertical: 12, // py-3 = 0.75rem * 16 = 12px
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 50,
  },
  friendsButtonText: {
    color: "#222",
    fontWeight: "700", // font-bold
    marginLeft: 8, // ml-2 = 0.5rem * 16 = 8px
    fontSize: 18, // text-lg
  },
  inviteModalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  inviteModalContent: {
    backgroundColor: "#23242a",
    borderRadius: 16,
    padding: 24,
    margin: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  inviteModalTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  inviteModalText: {
    fontSize: 16,
    color: "#FFFFFF",
    marginBottom: 8,
    textAlign: "center",
  },
  inviteModalSubtext: {
    fontSize: 14,
    color: "#FBBF24",
    marginBottom: 24,
    textAlign: "center",
    fontWeight: "700",
  },
  inviteButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  declineButton: {
    backgroundColor: "#EF4444",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginRight: 8,
    flex: 1,
  },
  declineButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },
  acceptButton: {
    backgroundColor: "#10B981",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginLeft: 8,
    flex: 1,
  },
  acceptButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },
});
