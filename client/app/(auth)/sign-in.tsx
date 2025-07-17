import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import Card from "@/components/common/Card";
import Logo from "@/components/common/Logo";
import Method from "@/components/auth/Method";

const signIn = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Card>
        <Logo />
        <Text style={styles.title}>Sign In to Play</Text>
        <Method method="google" />
        <Method method="facebook" />
        <Text style={styles.subtitle}>
          By continuing, you agree to our{" "}
          <Text style={styles.link}>Terms of Service</Text> and{" "}
          <Text style={styles.link}>Privacy Policy</Text>.
        </Text>
      </Card>
    </SafeAreaView>
  );
};

export default signIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    maxWidth: "70%",
    opacity: 0.8,
    marginTop: 10,
  },
  link: {
    textDecorationLine: "underline",
  },
});
