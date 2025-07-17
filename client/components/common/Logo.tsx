import { Image } from "react-native";
import React from "react";

const Logo = ({
  width = 100,
  height = 100,
}: {
  width?: number;
  height?: number;
}) => {
  return (
    <Image
      source={require("@/assets/images/logo.png")}
      style={{ width, height }}
    />
  );
};

export default Logo;
