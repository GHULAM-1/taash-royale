import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";

interface MethodProps {
  method: "google" | "facebook";
}

const Method = ({ method }: MethodProps) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {}}
        style={[
          styles.button,
          { backgroundColor: method === "google" ? "#FFF" : "#1877F2" },
        ]}
      >
        <Image
          source={
            method === "google"
              ? require("@/assets/images/google.png")
              : require("@/assets/images/facebook.png")
          }
          style={styles.icon}
        />
        <Text style={styles.text}>
          {method === "google"
            ? "Continue with Google"
            : "Continue with Facebook"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default Method;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginVertical: 10,
  },
  button: {
    backgroundColor: "white",
    padding: 14,
    borderRadius: 10,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#000000",
  },
  icon: {
    width: 30,
    height: 30,
    resizeMode: "contain",
    position: "absolute",
    left: 10,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "#000000",
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 2,
  },
});
