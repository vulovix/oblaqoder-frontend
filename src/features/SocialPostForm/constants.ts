import { APP_NAME } from "~/configuration";

export const CREATE_POST_CONTENT_STORAGE_KEY = `${APP_NAME}_CREATE_POST_CONTENT_STORAGE_KEY`;

export const defaultInitialValues = {
  files: [],
  isPublic: true,
  content: "",
};
