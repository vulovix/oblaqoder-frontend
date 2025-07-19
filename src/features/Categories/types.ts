export interface ICategory {
  id: number;
  name: string;
  slug: string;
  isPublic: boolean;
  userId: number;
}

export type NewCategory = Omit<ICategory, "id">;

export const CategoryEvent = {
  CategoryUpdate: "CategoryUpdate",
};
