import { PostDirection } from "../enums";

export type Entry = {
  id: string;
  parentEntryId: string | null;
  childEntryIds: string[];
  postId: string | null;
  profileId: string;
  linkId: string | null;
  pinId: string | null;
  tabId: string | null;
  showDirection: PostDirection | null;
  shouldFetch: boolean;
}