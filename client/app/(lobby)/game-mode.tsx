import React, { useState } from "react";
import { View, Text, TouchableOpacity, TextInput, StyleSheet, Alert, Modal, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useUserStore } from "../../store/userStore";
import { ENV } from "@/env";

export default function GameMode() {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const handleJoin = async () => {
    if (!inviteCode.trim()) {
      Alert.alert("Please enter an invite code");
      return;
    }
    if (!user) {
      Alert.alert("User not registered");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${ENV.BASE_URL}/api/rooms/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: inviteCode.trim(), userId: user.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to join room");
      }
      setShowJoinModal(false);
      setInviteCode("");
      // Success: navigate to private-table with roomCode
      router.push({ pathname: '/(lobby)/private-table', params: { roomCode: inviteCode.trim() } });
    } catch (err: any) {
      Alert.alert("Join Room Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Play Taash Royale</Text>
      <View style={styles.cardsContainer}>
        {/* Join Card */}
        <TouchableOpacity style={styles.joinCard} activeOpacity={0.85} onPress={() => setShowJoinModal(true)}>
          <Text style={styles.cardText}>Join</Text>
        </TouchableOpacity>
        {/* Create Card */}
        <TouchableOpacity style={styles.createCard} activeOpacity={0.85} onPress={() => router.push("/(lobby)/game-settings") }>
          <Text style={styles.cardText}>Create</Text>
        </TouchableOpacity>
      </View>
      {/* Join Modal */}
      <Modal
        visible={showJoinModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowJoinModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Join Room</Text>
            <Text style={styles.label}>Enter Invite Code:</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Invite code"
                value={inviteCode}
                onChangeText={setInviteCode}
                autoCapitalize="none"
                autoCorrect={false}
                editable={!loading}
              />
              <TouchableOpacity style={styles.joinButton} onPress={handleJoin} disabled={loading}>
                {loading ? (
                  <ActivityIndicator color="#222" />
                ) : (
                  <Text style={styles.joinButtonText}>Join</Text>
                )}
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setShowJoinModal(false)} disabled={loading}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
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
    padding: 16,
  },
  title: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 28,
    marginBottom: 32,
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginBottom: 24,
  },
  joinCard: {
    width: 192,
    height: 224,
    backgroundColor: "rgba(96, 165, 250, 0.8)",
    marginRight: 32,
    borderWidth: 4,
    borderColor: "#93C5FD",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  createCard: {
    width: 192,
    height: 224,
    backgroundColor: "rgba(252, 165, 165, 0.8)",
    borderWidth: 4,
    borderColor: "#FB923C",
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 25 },
    shadowOpacity: 0.25,
    shadowRadius: 50,
    elevation: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  cardText: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    textShadowColor: "#000",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: '#23242a',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 22,
    marginBottom: 16,
  },
  label: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 8,
    fontSize: 16,
    alignSelf: 'flex-start',
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    width: '100%',
  },
  input: {
    flex: 1,
    backgroundColor: "#181A20",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#444",
  },
  joinButton: {
    backgroundColor: "#FBBF24",
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  joinButtonText: {
    color: "#222",
    fontWeight: "700",
    fontSize: 16,
  },
  cancelButton: {
    marginTop: 18,
    backgroundColor: '#444',
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
}); 