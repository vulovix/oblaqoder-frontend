export interface ITopic {
  id: string;
  name: string;
  slug: string;
  isPublic: boolean;
}

export interface ITopicPickerState {
  loading: boolean;
  topics: Array<ITopic>;
}
