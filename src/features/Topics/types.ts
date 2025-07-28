export interface ITopic {
  id: number;
  name: string;
  slug: string;
  isPublic: boolean;
  userId: number;
}

export type NewTopic = Omit<ITopic, "id">;

export const TopicEvent = {
  TopicUpdate: "TopicUpdate",
};

export interface TopicRelationItem {
  id: number;
  name: string;
  slug: string;
}

export interface TopicWithRelations extends ITopic {
  collections: TopicRelationItem[];
  categories: TopicRelationItem[];
  communities: TopicRelationItem[];
}

export interface LinkTopicToRelationFormProps {
  topicId: number;
}
