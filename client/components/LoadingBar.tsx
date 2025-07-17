import React, { useEffect, useRef } from "react";
import { View, Text, Animated } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

interface LoadingBarProps {
  progress?: number;
  label?: string;
  duration?: number;
  autoAnimate?: boolean;
}

export const LoadingBar: React.FC<LoadingBarProps> = ({
  progress,
  label = "Loading...",
  duration = 1000,
  autoAnimate = true,
}) => {
  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (autoAnimate) {
      Animated.timing(animatedProgress, {
        toValue: 1,
        duration: duration,
        useNativeDriver: false,
      }).start();
    } else if (typeof progress === "number") {
      Animated.timing(animatedProgress, {
        toValue: progress,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [progress, autoAnimate, duration]);

  const animatedWidth = animatedProgress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
    extrapolate: "clamp",
  });

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        backgroundColor: "#000000",
      }}
    >
      <View
        style={{
          width: 400,
          height: 30,
          borderRadius: 10,
          position: "relative",
        }}
      >
        <LinearGradient
          colors={["#8C8C8C", "#1A1A1A"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 10,
            position: "absolute",
          }}
        />

        <View
          style={{
            position: "absolute",
            top: -20,
            left: 0,
            right: 0,
            alignItems: "center",
            zIndex: 1,
          }}
        >
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 25,
              fontWeight: "bold",
              textShadowColor: "#000000",
              textShadowOffset: { width: 1, height: 1 },
              textShadowRadius: 1,
            }}
          >
            {label}
          </Text>
        </View>

        <Animated.View
          style={{
            width: animatedWidth,
            height: "100%",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <LinearGradient
            colors={["#FFEAB4", "#DE9538"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Animated.View>
      </View>
    </View>
  );
};

export default LoadingBar;
