import React, { useEffect } from "react";
import {
  SignedIn,
  SignedOut,
  useUser,
  useClerk,
  useSSO,
} from "@clerk/clerk-expo";
import {
  View,
  Button,
  SafeAreaView,
  Alert,
  Text,
  StyleSheet,
} from "react-native";
import { sendUserToBackend } from "../../api/users/create-user";
import { handleOAuthSignIn } from "@/utils/functions";

export default function Page() {
  const { startSSOFlow } = useSSO();
  const { signOut } = useClerk();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const email = user?.externalAccounts[0]?.emailAddress || "";
      const avatarUrl = user?.hasImage
        ? user?.imageUrl
        : "https://www.istockphoto.com/photos/user-avatar";
      const firstName = user?.firstName || "";
      const lastName = user?.lastName || "";

      if (email && avatarUrl && firstName && lastName) {
        sendUserToBackend(email, avatarUrl, firstName, lastName);
      }
    }
  }, [user]);


  const _handleOAuthSignIn = async (strategy: string, providerName: string) => {
    try {

      handleOAuthSignIn(startSSOFlow , strategy ,providerName)

    } catch (err: any) {
      console.error(`${providerName} SSO Error:`, err);
      Alert.alert(
        "Error",
        `${providerName} authentication failed: ${
          err.message || "Unknown error"
        }`
      );
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      Alert.alert("Success", "Signed out successfully!");
    } catch (err: any) {
      console.error("Sign out error:", err);
      Alert.alert("Error", "Failed to sign out");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <SignedOut>
        <View style={styles.authContainer}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>Please sign in to continue</Text>
          <Button
            title="Sign in with Google"
            onPress={() => _handleOAuthSignIn("oauth_google", "Google")}
          />
          <Button
            title="Sign in with Facebook"
            onPress={() => _handleOAuthSignIn("oauth_facebook", "Facebook")}
          />
          <Button
            title="Sign in with Twitter"
            onPress={() => _handleOAuthSignIn("oauth_twitter", "Twitter")}
          />
        </View>
      </SignedOut>

      <SignedIn>
        <View style={styles.authContainer}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>
            Hello, {user?.firstName} {user?.externalAccounts[0]?.emailAddress}
          </Text>
          <Text style={styles.info}>You are already signed in</Text>

          <View style={styles.buttonContainer}>
            <Button title="Go to Dashboard" onPress={() => Alert.alert("No")} />
            <View style={styles.spacer} />
            <Button title="Sign Out" onPress={handleSignOut} color="#FF3B30" />
          </View>
        </View>
      </SignedIn>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  authContainer: {
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  info: {
    fontSize: 14,
    color: "#007AFF",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 200,
  },
  spacer: {
    height: 12,
  },
});
