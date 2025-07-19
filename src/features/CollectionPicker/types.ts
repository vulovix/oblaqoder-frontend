export interface ICollection {
  id: string;
  name: string;
  slug: string;
  isPublic: boolean;
}

export interface ICollectionPickerState {
  loading: boolean;
  collections: Array<ICollection>;
}
