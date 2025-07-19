export interface ICommunity {
  id: string;
  name: string;
  slug: string;
  isPublic: boolean;
}

export interface ICollectionPickerState {
  loading: boolean;
  collections: Array<ICommunity>;
}
