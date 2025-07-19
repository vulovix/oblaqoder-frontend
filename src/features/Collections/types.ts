export interface ICollection {
  id: number;
  name: string;
  slug: string;
  isPublic: boolean;
  userId: number;
}

export type NewCollection = Omit<ICollection, "id">;

export const CollectionEvent = {
  CollectionUpdate: "CollectionUpdate",
};
