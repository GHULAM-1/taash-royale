import axios from "axios";
import { Alert } from "react-native";
import {  UserRequest } from "@/types/user-types";
 
export const sendUserToBackend = async (
  email: string,
  avatarUrl: string,
  firstName: string,
  lastName: string
): Promise<UserRequest | undefined> => {
  try {
    const payload = { email, firstName, lastName, avatarUrl };
    
    const response = await axios.post<{ user: UserRequest; isNewUser: boolean }>(
      `http://192.168.0.103:3000/user`,
      payload
    );

    const { user } = response.data;

    return user;
  } catch (error: any) {
    console.error("Error sending user data:", error.response.data);
    Alert.alert("Error", "Failed to sync user data. Please try again.");
    return undefined;
  }
};
