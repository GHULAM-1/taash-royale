import React from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function GameSelect() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <View style={styles.cardsContainer}>
        {/* Bhabhi Thulla Card */}
        <TouchableOpacity style={styles.bhabhiCard} onPress={() => router.push("/(lobby)/game-settings")}> 
          {/* Replace with actual image if available */}
          <Text style={styles.bhabhiTitle1}>BHABHI</Text>
          <Text style={styles.bhabhiTitle2}>THULLA</Text>
          <TouchableOpacity style={styles.infoButton}>
            <Ionicons name="information-circle" size={18} color="#fff" />
          </TouchableOpacity>
        </TouchableOpacity>
        {/* Dacait Dacaiti Card */}
        <View style={styles.dacaitCard}>
          <Text style={styles.dacaitTitle1}>DACAIT</Text>
          <Text style={styles.dacaitTitle2}>DACAITI</Text>
          <View style={styles.comingSoonOverlay}>
            <Text style={styles.comingSoonText}>Coming soon...</Text>
          </View>
        </View>
        {/* Teen Patti Card */}
        <View style={styles.teenPattiCard}>
          <Text style={styles.teenPattiTitle1}>TEEN</Text>
          <Text style={styles.teenPattiTitle2}>PATTI</Text>
          <View style={styles.comingSoonOverlay}>
            <Text style={styles.comingSoonText}>Coming soon...</Text>
          </View>
        </View>
      </View>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#181A20",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  cardsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bhabhiCard: {
    width: 160, // w-40 = 10rem * 16 = 160px
    height: 176, // h-44 = 11rem * 16 = 176px
    backgroundColor: "rgba(251, 191, 36, 0.9)", // bg-yellow-400/90
    borderWidth: 4,
    marginRight: 80, // mr-20 = 5rem * 16 = 80px
    borderColor: "#EAB308", // border-yellow-500
    borderRadius: 16, // rounded-2xl = 1rem * 16 = 16px
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
    position: "relative",
  },
  bhabhiTitle1: {
    fontSize: 18, // text-lg
    fontWeight: "800", // font-extrabold
    color: "#4B3200",
    marginTop: 8, // mt-2 = 0.5rem * 16 = 8px
  },
  bhabhiTitle2: {
    fontSize: 18, // text-lg
    fontWeight: "800", // font-extrabold
    color: "#4B3200",
    marginTop: -8, // -mt-2 = -0.5rem * 16 = -8px
  },
  infoButton: {
    position: "absolute",
    bottom: 8, // bottom-2 = 0.5rem * 16 = 8px
    right: 8, // right-2 = 0.5rem * 16 = 8px
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20, // rounded-full
    padding: 4, // p-1 = 0.25rem * 16 = 4px
  },
  dacaitCard: {
    width: 160, // w-40 = 10rem * 16 = 160px
    height: 176, // h-44 = 11rem * 16 = 176px
    backgroundColor: "rgba(34, 34, 34, 0.8)", // bg-[#222c]
    borderWidth: 4,
    marginRight: 80, // mr-20 = 5rem * 16 = 80px
    borderColor: "#9CA3AF", // border-gray-400
    borderRadius: 16, // rounded-2xl = 1rem * 16 = 16px
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
    opacity: 0.6,
    position: "relative",
  },
  dacaitTitle1: {
    fontSize: 18, // text-lg
    fontWeight: "800", // font-extrabold
    color: "#FFFFFF",
    marginTop: 32, // mt-8 = 2rem * 16 = 32px
  },
  dacaitTitle2: {
    fontSize: 18, // text-lg
    fontWeight: "800", // font-extrabold
    color: "#FFFFFF",
    marginTop: -8, // -mt-2 = -0.5rem * 16 = -8px
  },
  teenPattiCard: {
    width: 160, // w-40 = 10rem * 16 = 160px
    height: 176, // h-44 = 11rem * 16 = 176px
    backgroundColor: "rgba(252, 165, 165, 0.9)", // bg-orange-300/90
    borderWidth: 4,
    borderColor: "#FB923C", // border-orange-400
    borderRadius: 16, // rounded-2xl = 1rem * 16 = 16px
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
    opacity: 0.6,
    position: "relative",
  },
  teenPattiTitle1: {
    fontSize: 18, // text-lg
    fontWeight: "800", // font-extrabold
    color: "#FFFFFF",
    marginTop: 32, // mt-8 = 2rem * 16 = 32px
  },
  teenPattiTitle2: {
    fontSize: 18, // text-lg
    fontWeight: "800", // font-extrabold
    color: "#FFFFFF",
    marginTop: -8, // -mt-2 = -0.5rem * 16 = -8px
  },
  comingSoonOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 16, // rounded-2xl
    justifyContent: "center",
    alignItems: "center",
  },
  comingSoonText: {
    color: "#FFFFFF",
    fontSize: 18, // text-lg
    fontWeight: "700", // font-bold
  },
  backButton: {
    position: "absolute",
    bottom: 32, // bottom-8 = 2rem * 16 = 32px
    left: 32, // left-8 = 2rem * 16 = 32px
    backgroundColor: "#FBBF24", // bg-yellow-400
    borderRadius: 12, // rounded-xl = 0.75rem * 16 = 12px
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
  backButtonText: {
    color: "#222",
    fontWeight: "700", // font-bold
    fontSize: 18, // text-lg
  },
}); 