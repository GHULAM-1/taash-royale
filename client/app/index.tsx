import { StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import { router } from "expo-router";
import Logo from "@/components/common/Logo";
import LoadingBar from "@/components/LoadingBar";

const index = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/sign-in");
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Logo width={250} height={250} />
      <LoadingBar label="Loading" duration={10000} />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
});
