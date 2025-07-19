export interface ICommunity {
  id: number;
  name: string;
  slug: string;
  isPublic: boolean;
  userId: number;
}

export type NewCommunity = Omit<ICommunity, "id">;

export const CommunityEvent = {
  CommunityUpdate: "CommunityUpdate",
};
