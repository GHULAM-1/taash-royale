
export type UserRank = "beginner" | "master" | "expert" | "legend";

export type User = {
  _id?: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  rank: UserRank;
  totalTrophies: number;
  createdAt?: string;
  updatedAt?: string;
};
export type OAuthResult = {
  success: boolean;
  sessionId?: string;
  error?: string;
};

export type UserRequest = Omit<User, "_id" | "createdAt" | "updatedAt" | "rank" | "totalTrophies">;
