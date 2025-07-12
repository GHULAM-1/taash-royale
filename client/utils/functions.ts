import * as AuthSession from "expo-auth-session";
import { Alert } from "react-native";

import { OAuthResult } from "../types/user-types";

export const handleOAuthSignIn = async (
  startSSOFlow: any, // wasn't able to find the type
  strategy: string,
  providerName: string
): Promise<OAuthResult> => {
  try {
    console.log(`Starting ${providerName} SSO flow...`);

    const { createdSessionId, setActive } = await startSSOFlow({
      strategy,
      redirectUrl: AuthSession.makeRedirectUri({
        scheme: "client",
        path: "/oauth-callback",
      }),
    });

    console.log(`${providerName} SSO flow completed`, { createdSessionId });

    if (createdSessionId) {
      await setActive({ session: createdSessionId });
      Alert.alert("Success", `Signed in with ${providerName} successfully!`);

      return {
        success: true,
        sessionId: createdSessionId,
      };
    } else {
      Alert.alert("Info", "Additional verification steps may be required");
      return {
        success: false,
        error: "Additional verification required",
      };
    }
  } catch (err: any) {
    console.error(`${providerName} SSO Error:`, err);
    Alert.alert(
      "Error",
      `${providerName} authentication failed: ${err.message || "Unknown error"}`
    );

    return {
      success: false,
      error: err.message || "Unknown error",
    };
  }
};
