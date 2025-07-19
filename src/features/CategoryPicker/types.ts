export interface ICategory {
  id: string;
  name: string;
  slug: string;
  isPublic: boolean;
}

export interface ICategoryPickerState {
  loading: boolean;
  categories: Array<ICategory>;
}
