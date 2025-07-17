import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { BlurView } from "expo-blur";

interface CardProps {
  children: React.ReactNode;
  intensity?: number;
  tint?: "light" | "dark" | "default";
}

const Card = ({ children, intensity = 70, tint = "dark" }: CardProps) => {
  return (
    <BlurView intensity={intensity} tint={tint} style={styles.container}>
      <View style={styles.overlay}>{children}</View>
    </BlurView>
  );
};

export default Card;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "black",
    color: "white",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    minWidth: "60%",
  },
});
