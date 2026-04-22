export type ApiResponse<T> = {
  success: boolean;
  data: T;
  error: { code: string; message: string } | null;
};

export type UserPayload = {
  id: string;
  email: string;
  displayName: string;
};

export type AuthResponse = {
  accessToken: string;
  user: UserPayload;
};

export type Cake = {
  cakeId: string;
  title: string;
  flavor: "CHOCOLATE" | "MANGO" | "MATCHA" | "STRAWBERRY" | "VANILLA";
  shareToken: string;
  birthday: string;
  openAt: string;
  closeAt: string;
  candleCount: number;
};

export type Candle = {
  candleId: string;
  nickname: string;
  positionX: number;
  positionY: number;
  candleColor: string;
  candleStyle: string;
};

export type Letter = {
  letterId: string;
  candleId: string;
  nickname: string;
  content: string;
  imageUrl?: string;
  unlocked: boolean;
  createdAt: string;
};

export type SavedLetter = {
  savedLetterId: string;
  sourceLetterId: string;
  nickname: string;
  content: string;
  savedAt: string;
};

export type UnlockState = {
  featureKey: string;
  thresholdCount: number;
  unlocked: boolean;
};
