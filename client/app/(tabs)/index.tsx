import React, { useState, useEffect } from 'react';
import * as AuthSession from 'expo-auth-session';
import { SignedIn, SignedOut, useAuth, useUser, useClerk, useSSO } from '@clerk/clerk-expo';
import { View, Button, SafeAreaView, Alert, Text, StyleSheet, Platform } from 'react-native';

export default function Page() {
  const { startSSOFlow } = useSSO();
  const { signOut } = useClerk();
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const [hasInitialized, setHasInitialized] = useState(false);

  const sendUserToBackend = async (email: string, fullName: string, imageUrl: string | null) => {
    try {
      const payload = { email, fullName, imageUrl };

//192.168.1.103
      const response = await fetch('http://localhost:3000/api/user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      
      Alert.alert(
        data.isNewUser ? 'Success' : 'Info', 
        data.isNewUser ? 'User created successfully!' : 'Welcome back!'
      );
    } catch (error: any) {
      console.error('Error sending user data:', error);
      Alert.alert('Error', 'Failed to sync user data. Please try again.');
    }
  };

  // Initialize user data only once when signed in
  useEffect(() => {
    if (user && isSignedIn && !hasInitialized) {
      const email = user?.externalAccounts[0]?.emailAddress || '';
      const fullName = user?.fullName || '';
      const imageUrl = user?.hasImage ? user?.imageUrl : null;
      
      
      if (email) {
        sendUserToBackend(email, fullName, imageUrl);
      }
      
      setHasInitialized(true);
    } else if (!isSignedIn) {
      setHasInitialized(false);
    }
  }, [user, isSignedIn, hasInitialized]);

  // Generic OAuth handler
  const handleOAuthSignIn = async (strategy: string, providerName: string) => {
    try {
      console.log(`Starting ${providerName} SSO flow...`);
      
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
        redirectUrl: AuthSession.makeRedirectUri({
          scheme: 'client',
          path: '/oauth-callback'
        }),
      });

      console.log(`${providerName} SSO flow completed`, { createdSessionId });
      
      if (createdSessionId) {
        await setActive({ session: createdSessionId });
        Alert.alert('Success', `Signed in with ${providerName} successfully!`);
      } else {
        Alert.alert('Info', 'Additional verification steps may be required');
      }
    } catch (err: any) {
      console.error(`${providerName} SSO Error:`, err);
      Alert.alert('Error', `${providerName} authentication failed: ${err.message || 'Unknown error'}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setHasInitialized(false);
      Alert.alert('Success', 'Signed out successfully!');
    } catch (err: any) {
      console.error('Sign out error:', err);
      Alert.alert('Error', 'Failed to sign out');
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
            onPress={() => handleOAuthSignIn('oauth_google', 'Google')} 
          />
          <Button 
            title="Sign in with Facebook" 
            onPress={() => handleOAuthSignIn('oauth_facebook', 'Facebook')} 
          />
          <Button 
            title="Sign in with Twitter" 
            onPress={() => handleOAuthSignIn('oauth_twitter', 'Twitter')} 
          />
        </View>
      </SignedOut>

      <SignedIn>
        <View style={styles.authContainer}>
          <Text style={styles.title}>Welcome back!</Text>
          <Text style={styles.subtitle}>
            Hello, {user?.firstName}  {user?.externalAccounts[0]?.emailAddress}
          </Text>
          <Text style={styles.info}>You are already signed in</Text>
          
          <View style={styles.buttonContainer}>
            <Button 
              title="Go to Dashboard" 
              onPress={() => Alert.alert('No')} 
            />
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
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  authContainer: {
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  info: {
    fontSize: 14,
    color: '#007AFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 200,
  },
  spacer: {
    height: 12,
  },
});