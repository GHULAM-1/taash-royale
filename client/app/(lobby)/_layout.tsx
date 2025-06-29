// app/(lobby)/_layout.tsx
import { Stack } from "expo-router";
import { OverlayProvider } from "stream-chat-react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function LobbyLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <OverlayProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </OverlayProvider>
    </GestureHandlerRootView>
  );
}
